import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from '../cta'
import { pageMetadata } from '../seo'

/* Every file that says what this page covers. Change what the page holds
   and these go stale.

   - The meta description below, and the two comments in this file that
     count the sections, one on `stack` and one on the appendix
   - docs/purview_method_page_copy.md
   - docs/purview_assistant_knowledge_base.md, section 11 and section 7
   - docs/purview_assistant_spec.md, the linking rule and the never do rule
   - docs/purview_build_instructions.md, the route table and order of work
   - docs/purview_site_restructure.md, what this does not change
   - app/globals.css, the .appendix block, which counts the sections above
     it

   Record of one pass rather than a current description:
   docs/purview_copy_pass.md. */

export const metadata = pageMetadata({
  title: 'Method',
  description:
    'Seven things that shape what we check for, including the survivorship correction on sales cycle, the three engines, the separation test, and the confounding check that follows it.',
  path: '/method',
})

const engines = [
  {
    lead: 'The designed engine.',
    body: 'What leadership believes they built.',
  },
  {
    lead: 'The documented engine.',
    body:
      'What the playbooks, CRM fields, dashboards, and onboarding docs say.',
  },
  {
    lead: 'The actual engine.',
    body: 'How people get work done. This one usually involves a spreadsheet somebody maintains by hand and a few steps that only happen because a specific person remembers them.',
  },
]

const layers = [
  {
    lead: 'Layer one. Does the practice exist.',
    body: 'Can you name your ICP in a sentence. Is there a described sales process. Do you know your pilot conversion rate. Failing here means the practice was never built.',
  },
  {
    lead: 'Layer two. Can you produce the numbers.',
    body: 'Stage conversion, cycle length, win rate by segment, CAC, retention, pipeline coverage. Failing here while passing layer one means the practice exists and was never instrumented. This is the most common failure and the easiest to fix.',
  },
  {
    lead: 'Layer three. Does the system produce them without a person.',
    body: 'Can the numbers be pulled, or does someone assemble them. A metric that requires a person to assemble is that person answering with extra steps. That is key person risk, and it is what diligence finds.',
  },
]

const separationSteps = [
  'Ask for the stated benchmark.',
  'Ask whether it is computed across one population or several.',
  'Ask for the same number split by segment.',
  'If step three cannot be produced, that is the finding. If it can, the gap between segments is the size of the opportunity.',
]

/* The only place on the site where tools are named, and deliberately quieter
   than the seven sections above it. */
const stack = [
  {
    lead: 'Analysis.',
    body: 'SQL and Postgres. Data quality checks run as their own stage rather than inline. Public examples at ',
    link: { label: 'github.com/JohnZebell', href: 'https://github.com/JohnZebell' },
    tail: '.',
  },
  {
    lead: 'CRM.',
    body: 'HubSpot, certified in Marketing Hub, Revenue Operations, and Reporting. GoHighLevel. Salesforce object model, not administration.',
  },
  {
    lead: 'Enrichment and data.',
    body: 'Clay, including multi-stage pipelines with waterfall provider ordering, run conditions, and staged tables so cheap qualification happens before expensive lookups. Apollo, ZeroBounce.',
  },
  {
    lead: 'Automation.',
    body: 'n8n, Zapier, Make. REST APIs and webhooks. Python and JavaScript where the logic needs it.',
  },
  {
    lead: 'AI, where it earns its place.',
    body: 'Classification of free text into fields you can group by. Reading unstructured sources to answer questions no data provider has a field for. Never writing to a CRM field without a check in front of it, and never as a substitute for a rule.',
  },
]

export default function Method() {
  return (
    <main>
      {/* OPENING */}
      <section>
        <div className="shell row">
          <div className="label">Method</div>
          <div>
            <h1 className="introTitle">How the diagnosis works</h1>
            <p>
              Seven things that shape what we check for and why each one matters.
              If you want to run any of this yourself, the descriptions here are
              enough to do it.
            </p>
          </div>
        </div>
      </section>

      {/* 1. SURVIVORSHIP. First on purpose, it is the strongest item here. */}
      <section>
        <div className="shell row">
          <h2 className="label">Survivorship</h2>
          <div>
            <p>
              Most companies compute average sales cycle from deals that closed.
            </p>
            <p>
              That excludes every deal still open. Deals stay open because they
              stalled, so the ones you drop are disproportionately the slow
              ones. The number that comes back is faster than reality, and it
              gets faster every time something gets stuck.
            </p>

            {/* Same panel as the home page hero. The point is that two correct
                looking numbers come from the same data, which a code block
                would turn into a point about SQL. */}
            <div className="viz vizInline">
              <div className="vizhead">Average sales cycle</div>
              <div className="vizrow">
                <div className="k">Closed deals only</div>
                <div className="v bad">64d</div>
              </div>
              <div className="vizrow">
                <div className="k">Every deal created in the window</div>
                <div className="v good">171d</div>
              </div>
              <p className="viznote">
                Same data. The second number includes the deals that never came
                out.
              </p>
            </div>

            <p>
              The fix is to compute against every opportunity created in the
              window, carrying open deals at time elapsed rather than dropping
              them. In SQL that is the difference between an inner join and a
              left join. One line.
            </p>
            <p>
              Both numbers are correct. They answer different questions. The one
              on your slide answers how long a deal takes if it closes. The one
              you need answers how long a deal takes.
            </p>
            <p>
              This matters more here than in most industries because the cycles
              are long. A six month gap between the two numbers changes your
              hiring plan and your cash forecast.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE THREE ENGINES */}
      <section>
        <div className="shell row">
          <h2 className="label">The three engines</h2>
          <div>
            <p>Every company is running three revenue engines at once.</p>
            <div className="doList">
              {engines.map((item) => (
                <div className="doItem" key={item.lead}>
                  <p>
                    <strong>{item.lead}</strong> {item.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="auditBody">
              The distance between the three is where most findings come from.
            </p>
            <p>
              The evidence for the third one is not hidden. It is personal
              spreadsheets, self-built dashboards, Slack threads used as a
              system of record, and manual reconciliation before every report.
            </p>
            <p>
              People route around a system for a reason. Usually the official
              version does not fit the work. So the workaround is information,
              not a violation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE LAYERS */}
      <section>
        <div className="shell row">
          <h2 className="label">The layers</h2>
          <div>
            <p>
              Every company fails at one of three layers. Which one tells you
              what to fix.
            </p>
            <div className="doList">
              {layers.map((item) => (
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

      {/* 4. FAILURE DEMAND */}
      <section>
        <div className="shell row">
          <h2 className="label">Failure demand</h2>
          <div>
            <p>
              Failure demand is work that exists only because something failed
              the first time.
            </p>
            <p>
              Re-entering data that arrived wrong. Rebuilding a report because
              the numbers looked off. Rerouting a record that went to the wrong
              person. Rescuing a deal that went quiet because nobody was
              watching. Calming a customer who should not have been surprised.
            </p>
            <p>
              None of it appears on anyone&apos;s job description. All of it is
              on someone&apos;s calendar.
            </p>
            <p>
              This is how we count what a leak costs. We count hours spent on
              work that should not have existed. The work is observable and the
              cause is nameable.
            </p>
            <p>
              A busy team is not necessarily a productive one. Sometimes it is a
              team processing the consequences of a broken system.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SEPARATION */}
      <section>
        <div className="shell row">
          <h2 className="label">Separation</h2>
          <div>
            <p>
              An average across two populations that behave differently
              describes neither of them.
            </p>
            <p>
              Your win rate is a blend of a utility deal and a corporate deal.
              Your cycle length is a blend of a repeat customer and a first-time
              buyer. When the blend moves, nobody can say whether performance
              changed or the mix did.
            </p>
            <p>The test has four steps.</p>
            {/* Same numbered rows as the home page facts. */}
            <div className="testSteps">
              {separationSteps.map((step, i) => (
                <div className="fact" key={step}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <p className="auditBody">
              This works on win rate, cycle length, CAC, and retention. Split by
              segment, by source, by deal size, and by rep tenure.
            </p>
            <p>
              It also settles definitional arguments. When sales and marketing
              disagree about what qualified means, both are correct under their
              own definition, which is why the meeting never resolves. Run both
              definitions against closed won data instead. Whichever population
              converts differently is the one carrying information.
            </p>
          </div>
        </div>
      </section>

      {/* 6. THE THIRD THING */}
      <section>
        <div className="shell row">
          <h2 className="label">The third thing</h2>
          <div>
            <p>
              Separation gives you two populations that behave differently. It
              does not tell you why, and the why decides whether the gap is
              worth anything.
            </p>
            <p>
              One team ran the numbers and found their California accounts
              closed at a much higher rate. The finding was real. The
              explanation was not. Their reps sat on the east coast, so west
              coast accounts fell inside a wider calling window and got more
              attempts before anyone gave up. Location was standing in for how
              many times someone picked up the phone.
            </p>
            <p>
              Nothing in the data says which of those it is. The gap looks
              identical either way.
            </p>
            <p>
              So every separation that survives gets one more question asked of
              it, which is what else moves alongside it. Territory. Rep tenure.
              Deal size. When that segment started being sold to at all. If a
              third thing explains both sides, the segment was never the
              finding.
            </p>
          </div>
        </div>
      </section>

      {/* 7. LAG */}
      <section>
        <div className="shell row">
          <h2 className="label">Lag</h2>
          <div>
            <p>
              Any change to how deals are qualified, routed, worked, or handed
              off is invisible in win rate and cycle length until a full cycle
              has passed.
            </p>
            <p>
              With cycles running six to eighteen months, that means an
              intervention made in January shows up in win rate somewhere in the
              second half of the year. Anything you measure before then is
              noise.
            </p>
            <p>
              Five things do move immediately. Opportunity creation rate,
              qualification pass rate, first touch percentage, time to first
              touch, stage entry counts.
            </p>
            <p>
              We state this at the start of an engagement, not at the end.
              Otherwise good work gets judged on a number that could not have
              moved yet, and the intervention gets reversed for the wrong
              reason.
            </p>
            <p>
              <strong>One thing that follows from it.</strong> Tightening
              qualification lowers pipeline volume. That is the mechanism
              working. Volume down and revenue up is the success case, and it
              reads as failure to anyone who was not told in advance.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNICAL APPENDIX. Muted, tighter, smaller. It is here for the
          reader who wants it and should not compete with the seven above. */}
      <section className="tight">
        <div className="shell row">
          <h2 className="label">Stack</h2>
          <div>
            <div className="appendix">
              {stack.map((item) => (
                <div className="appendixItem" key={item.lead}>
                  <p>
                    <strong>{item.lead}</strong> {item.body}
                    {item.link && (
                      <a
                        className="appendixLink"
                        href={item.link.href}
                        rel="noopener"
                        target="_blank"
                      >
                        {item.link.label}
                      </a>
                    )}
                    {item.tail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="tight">
        <div className="shell row">
          <div className="label">Next</div>
          <div>
            <h2 className="closeTitle">What the audit looks for</h2>
            <p className="closeSub">
              The audit runs seven checks against your real data. Three of the
              seven things above are among them. The other four are how the
              findings get read. It is $1,000, credited against your first month
              if you keep going. The findings are yours either way.
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
