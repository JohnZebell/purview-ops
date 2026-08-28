/* Where the assistant posts.

   The local route at app/api/chat/route.ts, which writes the user turn to
   pv_chat_log and then forwards the turn to n8n. Same shape as
   INTAKE_WEBHOOK_URL: the widget posts to this app, and this app is what talks
   to n8n. The service role key and the n8n url both stay server side because
   of it.

   Set it back to '' and the widget renders nothing at all, which is how this
   shipped before n8n existed. Same rule as DISCORD_WEBHOOK_URL in
   app/notify.ts, and the switch to reach for if the assistant ever has to come
   off the site without a rollback.

   An answer also needs N8N_CHAT_WEBHOOK_URL set in the environment. Without it
   the route still records the question and returns a failure, which is the
   ordering the whole thing is built around. */
export const CHAT_WEBHOOK_URL = '/api/chat'
