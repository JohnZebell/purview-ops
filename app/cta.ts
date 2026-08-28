/* One CTA, repeated. Same label and same destination everywhere on the site,
   including the button inside the home page audit section. That section keeps
   its #audit id so existing anchors still resolve, but its button now goes to
   the full offer page rather than to itself.

   On /audit this makes the header button a link to the page you are already
   on. That is deliberate and settled. Pointing it at the form anchor instead
   would need usePathname, which would turn the shared header into a client
   component for the sake of one button. Not worth it. */
export const CTA_HREF = '/audit'
export const CTA_LABEL = 'Start with the audit'
