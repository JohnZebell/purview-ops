/* Tells someone a submission arrived.

   Interim, and deliberately the smallest thing that works. Notification is
   n8n's job, per section 7 step 10 of purview_hubspot_setup.md. Until n8n
   exists the alternative is checking Supabase by hand, which is a process that
   fails quietly the first week it gets busy.

   A Discord webhook: one URL, no account to authenticate against, no
   dependency, and nothing to rotate. Set DISCORD_WEBHOOK_URL and it posts;
   leave it unset and it does not.

   Content follows section 7.1 of the setup doc. Two notes on where it cannot
   follow it exactly, both because the enrichment step that would supply the
   missing pieces is n8n's and does not exist:

   company    Not collected by the form and not derivable from it. It arrives
              at step 7, enrichment. The domain stands in its place rather
              than being invented.
   deal_url   There is no HubSpot, so the Supabase row is linked instead.

   stage_layer IS derived here, from customer_band per section 2.4, because
   the notification is meant to be actionable at a glance. Worth knowing that
   this puts the mapping in two places once n8n owns the other one. It is
   bounded: nothing reads this value back, it is never stored, and this whole
   file comes out when n8n takes over. If the mapping ever changes, it changes
   in both or the message quietly disagrees with the CRM. */

type Payload = Record<string, unknown>

/* Section 2.4. Display only. Nothing persists what this returns. */
const STAGE_LAYER: Record<string, string> = {
  under_10: 'seed',
  '10_40': 'series_a',
  '40_150': 'series_b',
  '150_plus': 'series_c',
}

/* Discord rejects a message over 2000 characters outright, so an unusually
   long answer would turn into no notification at all rather than a long one.
   The answer is sent whole whenever it fits and trimmed only to stay under
   the limit, with the row linked either way so the full text is one click
   from the alert. */
const DISCORD_LIMIT = 2000

const str = (payload: Payload, key: string) => {
  const value = payload[key]
  return typeof value === 'string' && value.trim() ? value.trim() : '—'
}

/* Never throws. A notification that fails must not affect capture, the stored
   row, or what the visitor sees. The row is already written by the time this
   runs, so the worst case is a lead that exists and has to be found by hand,
   which is the situation this is improving on rather than one it can break. */
export async function notifyIntake(payload: Payload, rowId: string) {
  const url = process.env.DISCORD_WEBHOOK_URL

  if (!url) {
    console.log(
      `[notify] skipped for row ${rowId}: DISCORD_WEBHOOK_URL is not set. ` +
        'See .env.example.',
    )
    return
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message(payload, rowId) }),
      /* Without this a hung webhook holds the visitor's request open, since
         the response is not sent until this resolves. */
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(
        `Discord returned ${response.status}: ${await response.text()}`,
      )
    }

    console.log(`[notify] posted for row ${rowId}`)
  } catch (error) {
    /* Loud, because a silent notifier is worse than no notifier: it converts
       "I check Supabase" into "I trust Discord" without earning it. */
    console.error(
      `[notify] FAILED for row ${rowId}. The row is saved; the alert is not. ` +
        'Reason: ' +
        (error instanceof Error ? error.message : String(error)),
    )
  }
}

function message(payload: Payload, rowId: string) {
  const email = str(payload, 'email')
  const domain = email.includes('@') ? email.split('@')[1] : '—'
  const band = str(payload, 'customer_band')

  const row = `https://supabase.com/dashboard/project/vdrlqtivdcaephzuqhbp/editor`

  const head = [
    '**New audit intake**',
    '',
    `${str(payload, 'website')}  ·  ${domain}`,
    `Stage: ${STAGE_LAYER[band] ?? '—'}  (${band})`,
    `Sells to: ${str(payload, 'buyer_type')}`,
    `CRM: ${str(payload, 'crm')}`,
    `Sells: ${str(payload, 'what_they_sell')}`,
    '',
    'Number they do not trust:',
  ].join('\n')

  const tail = `\n\nRow ${rowId}\n${row}`
  const answer = str(payload, 'untrusted_number')

  /* Budget what is left after the parts that must survive. */
  const room = DISCORD_LIMIT - head.length - tail.length - 8
  const fits = answer.length <= room
  const shown = fits ? answer : answer.slice(0, Math.max(room - 20, 0)).trimEnd()

  return (
    head +
    '\n> ' +
    shown.replace(/\n/g, '\n> ') +
    (fits ? '' : '\n> … trimmed, full text in the row') +
    tail
  )
}
