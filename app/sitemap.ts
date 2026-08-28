import type { MetadataRoute } from 'next'
import { SITE_URL } from './seo'

/* Every route the site has. Listed by hand rather than walked off the file
   system, so adding a page is a deliberate decision to have it indexed.

   priority is ordered by what the site wants found. The audit is the offer and
   the front door, so it sits with the home page. */
const routes: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/audit', priority: 0.9 },
  { path: '/work', priority: 0.8 },
  { path: '/timing', priority: 0.8 },
  { path: '/method', priority: 0.8 },
  { path: '/about', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  /* Build time, which is the last time any of this copy could have changed.
     A hand maintained date per route would go stale silently. */
  const lastModified = new Date()

  return routes.map(({ path, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
