import type { MetadataRoute } from 'next'
import { SITE_URL } from './seo'

/* Allow everything. There is nothing on this site to hide and the whole point
   of it is being findable.

   /api is not disallowed either. It holds one POST route that answers 405 to a
   GET, so there is nothing there for a crawler to index and a Disallow line
   would only advertise the path. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  }
}
