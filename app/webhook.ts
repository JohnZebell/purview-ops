/* Where the intake form posts.

   Currently a local stub at app/api/intake/route.ts, which logs the payload
   and returns ok. Swapping this to the real n8n webhook is one line, and
   nothing else in the form has to change.

   The form does not post to HubSpot directly. n8n is the orchestration
   layer, per purview_system_scope.md section 4. */
export const INTAKE_WEBHOOK_URL = '/api/intake'
