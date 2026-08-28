import type { Metadata } from 'next'

/* One definition of where the site lives and what it says it is.

   www, not the apex. purviewops.com 308s to www.purviewops.com, so www is the
   canonical host and every self reference names the destination rather than
   the redirect. Changing hosts is a one line change here. */
export const SITE_URL = 'https://www.purviewops.com'
export const SITE_NAME = 'Purview Ops'

/* The same sentence as the home page subhead and the root meta description.
   It is the front door claim, so it appears on the hero, in search results and
   on the social card, and those three drifting apart is exactly the failure
   the /about value proposition constant already guards against. */
export const SITE_DESCRIPTION =
  'Go to market engineering and revenue operations for energy and environmental infrastructure.'

/* The generated card in app/og/route.tsx. Named here rather than left to the
   file based opengraph-image convention, which attaches an image only to the
   segment holding the file: every route below the root shipped without a card
   until this moved. Every page goes through pageMetadata, so referencing it
   here means a new page cannot forget one. */
export const OG_SIZE = { width: 1200, height: 630 }

const OG_IMAGE = {
  url: '/og',
  ...OG_SIZE,
  type: 'image/png',
  alt: `${SITE_NAME}. ${SITE_DESCRIPTION}`,
}

/* Every route builds its metadata here so canonical, Open Graph and Twitter
   cannot disagree with the page title and description, and so a new page gets
   all four by writing one call instead of twenty lines. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /* Omitted on the home page, which takes the layout's default title rather
     than running through the `%s · Purview Ops` template and doubling the
     name. */
  title?: string
  description: string
  path: string
}): Metadata {
  /* Social cards get no title template, so the full name is written out. */
  const social = title ? `${title} · ${SITE_NAME}` : SITE_NAME

  return {
    ...(title ? { title } : {}),
    description,
    /* Relative. metadataBase in the root layout resolves it, which keeps the
       host in one place. */
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      url: path,
      title: social,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description,
      images: [OG_IMAGE],
    },
  }
}
