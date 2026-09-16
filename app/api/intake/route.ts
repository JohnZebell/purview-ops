/* Capture-first intake capture.

   One hop the visitor waits on: write the raw payload to Supabase. No
   normalising, no HubSpot, no derived fields. Those are n8n's, per section 4
   of purview_system_scope.md, and they run after the response has gone.

   A failed write returns a real error, per section 2 of
   purview_system_scope.md: never a silent failure on the user side either.

   This route used to return ok regardless, on the reasoning that a failed
   write is ours to fix rather than the visitor's. That reasoning is wrong in
   this one place. Capture is the only step with no second copy. If the write
   fails, the person who typed the answers is the last remaining record of
   them, and telling them it saved is what destroys the lead. Every later step
   in the pipeline can fail quietly precisely because step 2 already holds the
   payload. Step 2 cannot.

   So the visitor gets the truth and the form's failure branch gives them an
   address to send it to. The log still gets the whole payload, because it is
   the only copy on our side. */

import { after } from 'next/server'

import { notifyIntake } from '../../notify'

const TABLE = 'pv_intake_raw'

export async function POST(request: Request) {
  let payload: unknown = null
  let rowId: string | null = null

  try {
    payload = await request.json()
    rowId = await capture(payload)
  } catch (error) {
    /* Everything that can go wrong lands here: a malformed body, missing
       config, Supabase down, a schema mismatch. The visitor cannot fix any of
       it, but they are the only one still holding the answers, so they are
       told rather than reassured. */
    console.error(
      '\n=== INTAKE CAPTURE FAILED ===\n' +
        'The submission below was NOT written to ' +
        TABLE +
        '. It exists only here.\n' +
        'Reason: ' +
        (error instanceof Error ? error.message : String(error)) +
        '\nPayload: ' +
        JSON.stringify(payload, null, 2) +
        '\n=== END INTAKE CAPTURE FAILED ===\n',
    )

    /* The form throws on a non-ok response and shows its failure branch, which
       names an address to send the answers to. Nothing after this runs: there
       is no row to announce. */
    return Response.json({ ok: false }, { status: 500 })
  }

  /* Only once the row exists. An alert about a lead that was not saved would
     point at nothing, and the capture failure above is already loud. Kept
     outside the try so a notifier problem can never be logged as a capture
     problem. notifyIntake handles its own errors and does not throw. */
  if (rowId) {
    await notifyIntake(payload as Record<string, unknown>, rowId)

    /* Everything after capture is n8n's, per section 4 of
       purview_system_scope.md. Scheduled with after() rather than awaited: the
       visitor's answers are already saved, so making them wait on HubSpot buys
       them nothing and costs them seconds.

       after() rather than a floating promise. An un-awaited promise is not
       "fire and forget" on a serverless host, it is "fire and maybe get killed
       mid-flight" once the response returns. after() is the primitive that
       keeps the invocation alive until the work settles. */
    after(() => startPipeline(payload as Record<string, unknown>, rowId))
  }

  return Response.json({ ok: true })
}

async function capture(payload: unknown) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. See .env.example.',
    )
  }

  /* raw_payload is the record. email is copied verbatim, not lowercased, both
     because the form deliberately preserves casing and because normalising
     here as well as in n8n is how a pipeline stops being reconcilable.

     domain is left null on purpose. It is derived, and deriving it is step 3,
     which n8n owns. status is left to its column default of 'received'. */
  const email =
    payload && typeof payload === 'object' && 'email' in payload
      ? (payload as { email?: unknown }).email
      : null

  const response = await fetch(`${url}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      raw_payload: payload,
      email: typeof email === 'string' ? email : null,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Supabase returned ${response.status}: ${await response.text()}`,
    )
  }

  const [row] = await response.json()
  console.log(`[intake] captured ${row?.id} into ${TABLE}`)
  return row?.id as string
}

/* Hands the saved row to n8n, which normalises, validates, checks for
   duplicates, writes HubSpot and notifies. The body is { row_id, payload }:
   n8n needs the id because it writes the HubSpot contact and deal ids back to
   that row, and it needs the raw payload because it does its own normalising
   rather than trusting ours.

   Never throws. Nothing here can change what the visitor saw, because the
   visitor has already been answered and the row already exists. This is the
   opposite of capture, which is loud and visitor-facing precisely because it
   is the one step with no second copy.

   A failure here is recoverable without anyone retyping anything: the row is
   sitting in pv_intake_raw at status 'received', and the daily verification
   job flags any row still at 'received' after an hour. That is the safety net
   this function is allowed to rely on. */
async function startPipeline(payload: Record<string, unknown>, rowId: string) {
  const url = process.env.N8N_INTAKE_WEBHOOK_URL
  const secret = process.env.N8N_INTAKE_SECRET

  /* Both or neither. A URL without the secret is a guaranteed 403, which would
     look identical to a healthy pipeline from here. */
  if (!url || !secret) {
    console.log(
      `[intake] pipeline not started for row ${rowId}: ` +
        'N8N_INTAKE_WEBHOOK_URL or N8N_INTAKE_SECRET is not set. ' +
        'See .env.example. The row is saved and can be replayed.',
    )
    return
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Purview-Intake': secret,
      },
      body: JSON.stringify({ row_id: rowId, payload }),
      /* n8n answers immediately with "Workflow was started" and does the work
         asynchronously, so this should never be slow. The timeout is here for
         the case where it is unreachable rather than merely busy. */
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      /* 403 means the secret and the n8n credential disagree. Worth naming,
         because the symptom otherwise is a pipeline that quietly does nothing
         while capture keeps working perfectly. */
      throw new Error(`n8n returned ${response.status}: ${await response.text()}`)
    }

    console.log(`[intake] pipeline started for row ${rowId}`)
  } catch (error) {
    console.error(
      `[intake] pipeline FAILED to start for row ${rowId}. The row is saved ` +
        'and HubSpot has not been told, so this one needs a replay. Reason: ' +
        (error instanceof Error ? error.message : String(error)),
    )
  }
}
