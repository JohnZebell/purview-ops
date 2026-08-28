import type { Metadata } from 'next'
import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from '../cta'

/* The opening value proposition. Build notes say this should read identically
   here, on the LinkedIn company page and in any directory listing, because
   LLMs cross reference them and a mismatch reads as low confidence about what
   the business is. Kept in one constant so the page and the meta description
   cannot drift apart. */
const VALUE_PROPOSITION =
  'Purview Ops is a revenue operations and go to market engineering practice for companies selling into energy, water, waste, and grid infrastructure. It is run by John Zebell from Denver, Colorado.'

const LINKEDIN = 'https://www.linkedin.com/in/john-zebell-iii-60b745163/'
const GITHUB = 'https://github.com/JohnZebell'
const PORTFOLIO = 'https://johnzebellportfolio.vercel.app'

export const metadata: Metadata = {
  title: 'About',
  description: VALUE_PROPOSITION,
}

/* Each links to its own verification page, so the "all verifiable" claim on
   this page is checkable rather than asserted. These also feed hasCredential
   in the schema below, so the visible list and the structured data come from
   one source. */
const certifications = [
  {
    name: 'HubSpot Marketing Hub Software Certified',
    year: '2026',
    issuer: 'HubSpot Academy',
    href: 'https://app-na2.hubspot.com/academy/achievements/0q0jpjqw/en/1/john-zebell/hubspot-marketing-hub-software',
  },
  {
    name: 'HubSpot Revenue Operations Certified',
    year: '2026',
    issuer: 'HubSpot Academy',
    href: 'https://app-na2.hubspot.com/academy/achievements/jqncmj73/en/1/john-zebell/revenue-operations',
  },
  {
    name: 'HubSpot Reporting Certified',
    year: '2026',
    issuer: 'HubSpot Academy',
    href: 'https://app-na2.hubspot.com/academy/achievements/82c4dgrx/en/1/john-zebell/hubspot-reporting',
  },
  {
    name: 'SQL Certified, HackerRank',
    year: '2026',
    issuer: 'HackerRank',
    href: 'https://www.hackerrank.com/certificates/f9377202dc3c',
  },
]

const publicWork = [
  {
    label: 'github.com/JohnZebell',
    href: GITHUB,
    body: 'SQL data quality and audit repositories, behavioral signal models built on Postgres',
  },
  {
    label: 'johnzebellportfolio.vercel.app',
    href: PORTFOLIO,
    body: 'Build documentation and wiring for production systems',
  },
]

const howWeWork = [
  {
    lead: 'Recorded walkthroughs and writing.',
    body: 'Findings arrive as something you watch on your own schedule and forward to whoever was not in the room. Meetings when you want one, never on a standing invite.',
  },
  {
    lead: 'We recommend, you execute.',
    body: 'We build the systems and tell you what the data says. We do not run your revenue org, sit in your standups, or become something you cannot operate without.',
  },
  {
    lead: 'Read only access.',
    body: 'Nothing we ask for lets us change anything in your systems.',
  },
  {
    lead: 'A fixed audit before anything else.',
    body: 'Two weeks, $1,000, credited against the first month if the engagement continues. The findings document is yours whether or not it does.',
  },
]

const situations = [
  {
    lead: 'A founder still closing most deals, under fifteen customers.',
    body: "The problem is that nothing is being recorded, so the history that would answer next year's questions is not being captured. The work is a countable market and the five instrumentation decisions that cost nothing now and require backfilling later.",
  },
  {
    lead: 'First revenue hires landed, and nobody can reproduce the numbers everyone quotes.',
    body: 'The funnel math came from a spreadsheet built once. Inbound is arriving faster than anyone is routing it. The work is reconciling the stated numbers against the system, and building routing that handles its own failure cases.',
  },
  {
    lead: 'Enough volume to compute the numbers, and enough to compute them wrong.',
    body: 'Every metric is an average across segments that behave differently, and sales and marketing are using the same words to mean different things. The work is splitting the metrics and settling the definitions against closed won data rather than by argument.',
  },
  {
    lead: 'Growth still depending on new logos.',
    body: 'Percentage growth slows as the base grows, and expansion is not instrumented separately, so nobody can say how much it carries. The work is decomposing it and building the signals that surface expansion before someone asks.',
  },
]

/* Drives both the visible questions and the FAQPage schema below, so the
   markup and the structured data cannot drift apart. Google treats schema
   that does not match visible content as a violation. */
const questions = [
  {
    q: 'What access do you need?',
    a: 'Read only access to your CRM, and to whatever else holds revenue data. Nothing that permits changes.',
  },
  {
    q: 'What if we do not have a CRM?',
    a: 'Then the audit is the wrong first step. That situation needs a described process before it needs analysis, and we would say so rather than sell you an audit.',
  },
  {
    q: 'How long does the audit take?',
    a: 'Two weeks from access being granted. The intake doc takes about fifteen minutes on your side and nothing else is required until the findings arrive.',
  },
  {
    q: 'What does the audit cost?',
    a: '$1,000, credited in full against the first month if you continue.',
  },
  {
    q: 'Do we have to continue after the audit?',
    a: 'No. The findings document is yours either way, and it is written to be usable by whoever fixes the problems, including someone who is not us.',
  },
  {
    q: 'Do you work with companies outside energy and environmental infrastructure?',
    a: 'The method applies anywhere. The market and timing work is specific to markets where buyers are countable and buying windows are public, which is why the practice is pointed here.',
  },
  {
    q: 'Where are you located?',
    a: 'Denver, Colorado. All work is remote.',
  },
]

/* No canonical url property yet, because there is no domain. Add `url` and an
   Organization-level `sameAs` when the site is deployed. A wrong url in schema
   is worse than an absent one. */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Purview Ops',
  description: VALUE_PROPOSITION,
  founder: {
    '@type': 'Person',
    name: 'John Zebell',
    jobTitle: 'Revenue operations and go to market engineer',
    /* Profiles of the entity, not claims about it. Certificates go in
       hasCredential below. */
    sameAs: [LINKEDIN, GITHUB, PORTFOLIO],
    /* On the founder rather than on the Organization, because these were
       awarded to the person. HubSpot Academy issues to an individual and the
       verification URLs say so, each one carrying /john-zebell/ in its path.
       Organization.hasCredential would be a claim that Purview Ops holds the
       certificate, which is a different and untrue statement. Built from the
       same array as the visible list. */
    hasCredential: certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      url: cert.href,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
    })),
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Denver',
    addressRegion: 'CO',
    addressCountry: 'US',
  },
  knowsAbout: [
    'Revenue operations',
    'Go to market engineering',
    'CRM architecture',
    'Lead routing',
    'Marketing and sales instrumentation',
    'Energy and environmental infrastructure',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function About() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* OPENING. The label stays a div here because this section has a
          headline to carry the heading level. Sections without one below take
          it on their label, the same as /audit. */}
      <section>
        <div className="shell row">
          <div className="label">About</div>
          <div>
            <h1 className="aboutTitle">Purview Ops</h1>
            <p>{VALUE_PROPOSITION}</p>
            <p>
              The work is the systems underneath a revenue team. Lead routing,
              lifecycle and stage instrumentation, CRM architecture, enrichment
              pipelines, reporting people can trust, and the checks that catch
              it when one of those quietly stops working.
            </p>
            <p>
              Engagements start with a two week audit, then continue as a
              monthly retainer if the findings warrant it.
            </p>
          </div>
        </div>
      </section>

      {/* WHO RUNS IT */}
      <section>
        <div className="shell row">
          {/* This section now has a headline, so the label goes back to being
              a div and the h2 carries the heading level. */}
          <div className="label">Who</div>
          <div>
            <h2 className="whoTitle">John Zebell</h2>
            <p className="whoPlace">Denver, Colorado.</p>
            <p>
              I build revenue systems. Over the past year I have built and
              delivered them across concurrent client engagements in wellness,
              telehealth, and services, as the technical point of contact on
              each one.
            </p>
            <p>
              That work is lead routing and scoring, lifecycle automation,
              enrichment pipelines, CRM architecture and data hygiene,
              reporting, and AI agents running in production with guardrails on
              what they are allowed to write.
            </p>
            <p>
              Everything I build runs unattended, so I instrument it to prove
              its own output rather than report that it succeeded. Run level
              logging on cost and latency, validation on every write, and an
              alert when something fails rather than a record quietly
              disappearing.
            </p>

            <h3 className="label subLabel">Certifications, all verifiable</h3>
            <ul className="creds">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <a href={cert.href} rel="noopener" target="_blank">
                    {cert.name}
                  </a>
                  <span className="credYear">{cert.year}</span>
                </li>
              ))}
            </ul>

            <h3 className="label subLabel">Public work</h3>
            <ul className="linkList">
              {publicWork.map((item) => (
                <li key={item.href}>
                  <a href={item.href} rel="me noopener" target="_blank">
                    {item.label}
                  </a>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHY THIS MARKET */}
      <section>
        <div className="shell row">
          <h2 className="label">Why this market</h2>
          <div>
            <p>Two reasons, and one of them is not about the climate.</p>
            <p>
              Climate and energy companies sell into markets that can be
              counted. There are a specific number of utilities, developers, and
              municipalities that fit what any given company sells, and that
              list is public. Most revenue playbooks assume an unbounded market
              and estimate their way around it. Here you can build the actual
              list.
            </p>
            <p>
              A lot of what decides timing is also public. Procurement
              calendars, budget approvals, grant cycles, interconnection
              filings. In most industries you have to guess when a buyer is
              ready. In this one, much of it is published before anyone
              announces anything.
            </p>
            <p>
              The other reason is that I would rather the systems I build sit
              underneath companies doing this than underneath another software
              company.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section>
        <div className="shell row">
          <h2 className="label">How</h2>
          <div>
            <div className="doList">
              {howWeWork.map((item) => (
                <div className="doItem" key={item.lead}>
                  <p>
                    <strong>{item.lead}</strong> {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section>
        <div className="shell row">
          <h2 className="label">Who this is for</h2>
          <div>
            <p>
              Four situations. Most companies are in exactly one, and most are
              wrong about which.
            </p>
            <div className="doList">
              {situations.map((item) => (
                <div className="doItem" key={item.lead}>
                  <p>
                    <strong>{item.lead}</strong> {item.body}
                  </p>
                </div>
              ))}
              <div className="doItem">
                <p className="excluded">
                  <strong>Not a fit.</strong> Under three people selling, no
                  CRM, or a company that wants someone to run their revenue org
                  rather than build the systems underneath it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMON QUESTIONS. Exists for answer retrieval as much as for readers,
          so it carries FAQPage schema built from the same array. */}
      <section>
        <div className="shell row">
          <h2 className="label">Questions</h2>
          <div>
            <dl className="faq">
              {questions.map((item) => (
                <div className="faqItem" key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="tight">
        <div className="shell row">
          <h2 className="label">Contact</h2>
          <div>
            <p className="contact">
              John Zebell
              <br />
              Denver, Colorado
              <br />
              <a href={LINKEDIN} rel="me noopener" target="_blank">
                LinkedIn
              </a>
            </p>
            <div className="cta">
              <Link className="btn big" href={CTA_HREF}>
                {CTA_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
