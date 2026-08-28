/* Capture-first chat capture.

   Two hops, in this order. The user turn goes to pv_chat_log, then the whole
   turn goes to n8n, which owns the system prompt in section 1 of
   purview_assistant_spec.md, the model call, the trigger, and the write of the
   assistant turn once the model has answered.

   The order is the point, per section 3 of the spec. If n8n is down or the
   model times out, the question is still recorded, and the question is the
   reason the logging exists at all.

   This route exists because of the service role key. The widget cannot write
   to pv_chat_log itself without shipping that key to the browser, and the n8n
   url stays here for the same reason: an endpoint that is only ever called
   from the server is not worth publishing in the client bundle.

   One deliberate difference from the intake route. There, a failed capture
   returns an error and tells the visitor, because the row is the only copy of
   a lead and saying it saved is what destroys it. A chat question is not the
   only copy: it is still on screen in front of the person who typed it, and
   they can ask again. So a failed capture here is loud in the log but does not
   stop the answer, and the widget is told which of the two happened so its
   failure copy can be true rather than reassuring. */

const TABLE = 'pv_chat_log'

/* n8n has to run a model call inside this request. The default is ten
   seconds, which a real answer can exceed. Vercel clamps this to whatever the
   plan allows. */
export const maxDuration = 30

type Body = {
  conversation_id?: unknown
  turn?: unknown
  message?: unknown
  page_path?: unknown
  history?: unknown
}

export async function POST(request: Request) {
  let body: Body

  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, logged: false }, { status: 400 })
  }

  const conversationId =
    typeof body.conversation_id === 'string' ? body.conversation_id : null
  const turn = typeof body.turn === 'number' ? body.turn : null
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  /* A turn with no conversation, no position, or no question is not something
     to log or to answer. */
  if (!conversationId || turn === null || !message) {
    return Response.json({ ok: false, logged: false }, { status: 400 })
  }

  const pagePath = typeof body.page_path === 'string' ? body.page_path : null

  /* Before n8n, always. Never throws: it reports whether it worked. */
  const logged = await captureUserTurn({
    conversationId,
    turn,
    message,
    pagePath,
  })

  const url = process.env.N8N_CHAT_WEBHOOK_URL

  if (!url) {
    console.error(
      '[chat] N8N_CHAT_WEBHOOK_URL is not set, so there is no answer to give. ' +
        `The question was ${logged ? 'recorded' : 'NOT recorded'}. See .env.example.`,
    )
    return Response.json({ ok: false, logged }, { status: 502 })
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        turn,
        message,
        page_path: pagePath,
        history: Array.isArray(body.history) ? body.history : [],
      }),
      signal: AbortSignal.timeout(25000),
    })

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    const reply = typeof data?.message === 'string' ? data.message.trim() : ''

    /* A 200 with nothing in it is still a failure. Passing it through would
       render as the assistant ignoring them. */
    if (!reply) throw new Error('n8n returned no message')

    return Response.json({
      message: reply,
      trigger: typeof data?.trigger === 'string' ? data.trigger : null,
      logged,
    })
  } catch (error) {
    /* The assistant turn is n8n's to write and there is no assistant turn, so
       nothing is missing from the log that this route could have added. */
    console.error(
      `[chat] no answer for conversation ${conversationId} turn ${turn}. ` +
        `The question was ${logged ? 'recorded' : 'NOT recorded'}. ` +
        'Reason: ' +
        (error instanceof Error ? error.message : String(error)),
    )
    return Response.json({ ok: false, logged }, { status: 502 })
  }
}

/* Writes the user turn and says whether it landed. Deliberately does not
   throw: the answer is worth attempting even when the logging is broken, and
   the caller needs the outcome rather than an exception. */
async function captureUserTurn({
  conversationId,
  turn,
  message,
  pagePath,
}: {
  conversationId: string
  turn: number
  message: string
  pagePath: string | null
}) {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. See .env.example.',
      )
    }

    /* trigger is left null: it belongs to assistant turns only, and n8n sets
       it when it writes the answer. */
    const response = await fetch(`${url}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        turn,
        role: 'user',
        content: message,
        page_path: pagePath,
      }),
    })

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${await response.text()}`)
    }

    return true
  } catch (error) {
    /* The question itself goes in the log line, because at this point it is
       the only copy on our side. */
    console.error(
      '\n=== CHAT CAPTURE FAILED ===\n' +
        'The question below was NOT written to ' +
        TABLE +
        '. It exists only here.\n' +
        'Reason: ' +
        (error instanceof Error ? error.message : String(error)) +
        `\nConversation: ${conversationId} turn ${turn}\n` +
        'Question: ' +
        message +
        '\n=== END CHAT CAPTURE FAILED ===\n',
    )
    return false
  }
}
