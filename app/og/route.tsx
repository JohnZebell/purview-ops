import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { OG_SIZE, SITE_DESCRIPTION, SITE_NAME } from '../seo'

/* The social card for the whole site.

   A route rather than the file based opengraph-image convention. Next attaches
   a file based image only to the segment that holds the file, and a page that
   declares its own openGraph replaces the inherited one, so /about, /work,
   /timing, /method and /audit all shipped without a card until this moved
   here. Referenced once from pageMetadata instead, which every route already
   goes through.

   Text only, in the same tokens as globals.css. No imagery and no gradient,
   because the site has none and a card that does not look like the page it
   opens is a worse first impression than a plain one. */

/* Prerendered at build like the pages, rather than rendered per request. */
export const dynamic = 'force-static'

/* globals.css :root, copied rather than imported. Satori resolves no custom
   properties and no stylesheet, so these are the values in literal form. Keep
   them in step with the tokens. */
const BASE = '#faf8f5'
const INK = '#141613'
const MUTED = '#5c605a'
const RULE = '#ddd8d0'
const GREEN = '#22402f'

/* Vendored, not fetched. These used to come from Google Fonts during the
   build, which meant a deploy could fail because someone else's CDN was
   unreachable, for a reason unrelated to anything that changed in the commit.

   Read with process.cwd() rather than traced as an import, which is safe
   because force-static means this handler only ever runs at build, where the
   working directory is the project root. See fonts/README.md for provenance
   and how to regenerate them. */
const FONT_DIR = join(process.cwd(), 'app', 'og', 'fonts')

export async function GET() {
  const [fraunces, inter] = await Promise.all([
    readFile(join(FONT_DIR, 'fraunces-400-subset.ttf')),
    readFile(join(FONT_DIR, 'inter-400-subset.ttf')),
  ])

  const [first, second] = SITE_NAME.split(' ')

  return new ImageResponse(
    (
      /* Anchored left with the right margin left open, the same composition as
         .shell on the site. Every node declares display flex, because Satori
         has no block layout. */
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: BASE,
          padding: '0 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Fraunces',
            fontSize: 68,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: INK }}>{first}&nbsp;</span>
          {/* The one place the second word takes the accent, same as .mark span. */}
          <span style={{ color: GREEN }}>{second}</span>
        </div>

        {/* The rule is the site's separator of record. */}
        <div
          style={{
            display: 'flex',
            width: 620,
            height: 1,
            background: RULE,
            margin: '44px 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontFamily: 'Inter',
            fontSize: 42,
            lineHeight: 1.35,
            color: MUTED,
            maxWidth: 880,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Fraunces', data: fraunces, style: 'normal', weight: 400 },
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
      ],
    }
  )
}
