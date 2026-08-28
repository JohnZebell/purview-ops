/* Capture-first intake capture.

   One hop: write the raw payload to Supabase, return ok. No enrichment, no
   HubSpot, no derived fields. Those are n8n's job, per section 7 of
   purview_hubspot_setup.md, and neither HubSpot nor n8n exists yet.

   The visitor always gets ok. A failed write is our problem, not theirs, and
   there is nothing they could do about it by seeing an error. So the failure
   goes to the log instead, loudly and with the whole payload, because when the
   write fails that log line is the only surviving copy of the lead. */

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
       config, Supabase down, a schema mismatch. All of it is recoverable by
       hand from this line, and none of it is the visitor's to fix. */
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
