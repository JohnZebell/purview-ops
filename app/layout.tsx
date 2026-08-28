import type { Metadata } from 'next'
import Link from 'next/link'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { CTA_HREF, CTA_LABEL } from './cta'
import './globals.css'

/* Self hosted at build time by next/font, so there is no request to a font
   CDN and no layout shift on load.

   Weights are pinned to what the design actually uses, which keeps the
   preloaded font payload inside the 200KB page budget. Fraunces sets
   headlines and the wordmark at 400 and nothing else. Mono sets labels,
   figures and step numerals, all at 400. Inter stays variable because it
   needs 400 for body, 500 for h3 and buttons, and 700 for strong. */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Purview Ops',
    template: '%s — Purview Ops',
  },
  description:
    'Go to market engineering and revenue operations for climate technology companies.',
}

/* Items with no href are not built yet. They render as plain text with a
   marker rather than as links to a placeholder page, so nothing 404s and no
   thin page gets indexed. Add the href when the page ships. */
const navItems: { label: string; href?: string }[] = [
  { label: 'Work', href: '/work' },
  { label: 'Method' },
  { label: 'About', href: '/about' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <header>
          <div className="shell bar">
            <Link className="mark" href="/">
              Purview <span>Ops</span>
            </Link>

            <nav className="nav" aria-label="Main">
              {navItems.map((item) =>
                item.href ? (
                  <Link href={item.href} key={item.label}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="navSoon" key={item.label}>
                    {item.label}
                    <i>soon</i>
                  </span>
                )
              )}
            </nav>

            <Link className="btn" href={CTA_HREF}>
              {CTA_LABEL}
            </Link>
          </div>
        </header>

        {children}

        <footer>
          <div className="shell">
            Purview Ops &nbsp;&middot;&nbsp; Denver, Colorado
          </div>
        </footer>
      </body>
    </html>
  )
}
