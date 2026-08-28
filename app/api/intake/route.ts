/* Capture-first intake capture.

   One hop: write the raw payload to Supabase. No enrichment, no HubSpot, no
   derived fields. Those are n8n's job, per section 7 of
   purview_hubspot_setup.md, and neither HubSpot nor n8n exists yet.

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
