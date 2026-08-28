/* Where the assistant posts.

   The local route at app/api/chat/route.ts, which writes the user turn to
   pv_chat_log and then forwards the turn to n8n. Same shape as
   INTAKE_WEBHOOK_URL: the widget posts to this app, and this app is what talks
   to n8n. The service role key and the n8n url both stay server side because
   of it.

   Empty until n8n exists, and the widget renders nothing while it is empty.
   Same rule as DISCORD_WEBHOOK_URL in app/notify.ts: set it and it appears,
   leave it unset and it does not. An assistant that logs questions it cannot
   answer is worse than no assistant, so this stays off until
   N8N_CHAT_WEBHOOK_URL is set in the environment.

   Turning it on is this one line: set it to '/api/chat'. Nothing else in the
   widget has to change. */
export const CHAT_WEBHOOK_URL = ''
