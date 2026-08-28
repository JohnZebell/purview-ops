/* Tells someone a submission arrived.

   Interim, and deliberately the smallest thing that works. Notification is
   n8n's job, per section 7 step 10 of purview_hubspot_setup.md. Until n8n
   exists the alternative is checking Supabase by hand, which is a process that
   fails quietly the first week it gets busy.

   Gmail SMTP rather than an email API, because it adds no account and no
   third party holding the leads. It needs an App Password, which needs 2 Step
   Verification on the sending account. See .env.example.

   This never derives anything. stage_layer is absent on purpose even though
   customer_band determines it, because deriving it here as well as in n8n is
   exactly the two-places problem the rest of the pipeline is built to avoid.
   The band is shown raw and the mapping stays in one place. */

import nodemailer from 'nodemailer'

type Payload = Record<string, unknown>

const str = (payload: Payload, key: string) => {
  const value = payload[key]
  return typeof value === 'string' && value.trim() ? value.trim() : '—'
}

/* Never throws. A notification that fails must not affect capture, the stored
   row, or what the visitor sees. The row is already written by the time this
   runs, so the worst case is a lead that exists and has to be found by hand,
   which is the situation this is improving on rather than one it can break. */
export async function notifyIntake(payload: Payload, rowId: string) {
  const to = process.env.NOTIFY_TO
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!to || !user || !pass) {
    console.log(
      `[notify] skipped for row ${rowId}: NOTIFY_TO, GMAIL_USER or ` +
        'GMAIL_APP_PASSWORD is not set. See .env.example.',
    )
    return
  }

  /* Format from section 7.1, minus the fields that do not exist yet. No
     HubSpot deal URL because there is no HubSpot, and no company name because
     nothing enriches it. The domain is the one thing worth reading off the
     email, and reading is not deriving. */
  const email = str(payload, 'email')
  const domain = email.includes('@') ? email.split('@')[1] : '—'

  const body = [
    'New audit intake',
    '',
    `${email}  ·  ${domain}`,
    `Site: ${str(payload, 'website')}`,
    `Sells: ${str(payload, 'what_they_sell')}`,
    `Sells to: ${str(payload, 'buyer_type')}`,
    `Customers: ${str(payload, 'customer_band')}`,
    `CRM: ${str(payload, 'crm')}`,
    '',
    'Number they do not trust:',
    `"${str(payload, 'untrusted_number')}"`,
    '',
    `Row: ${rowId}`,
    'https://supabase.com/dashboard/project/vdrlqtivdcaephzuqhbp/editor',
  ].join('\n')

  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })

    await transport.sendMail({
      from: user,
      to,
      subject: `New audit intake — ${domain}`,
      text: body,
    })

    console.log(`[notify] sent for row ${rowId} to ${to}`)
  } catch (error) {
    /* Loud, because a silent notifier is worse than no notifier: it converts
       "I check Supabase" into "I trust the email" without earning it. */
    console.error(
      `[notify] FAILED for row ${rowId}. The row is saved; the alert is not. ` +
        'Reason: ' +
        (error instanceof Error ? error.message : String(error)),
    )
  }
}
