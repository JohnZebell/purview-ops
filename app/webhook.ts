/* Where the intake form posts.

   Currently a local route at app/api/intake/route.ts, which writes the raw
   payload to the Supabase table pv_intake_raw and returns ok. That is capture
   only. Normalisation, HubSpot, and notification are n8n's, per section 7 of
   purview_hubspot_setup.md, and n8n does not exist yet.

   Swapping this to the real n8n webhook is one line, and nothing else in the
   form has to change.

   The form does not post to HubSpot directly. n8n is the orchestration
   layer, per purview_system_scope.md section 4. */
export const INTAKE_WEBHOOK_URL = '/api/intake'
