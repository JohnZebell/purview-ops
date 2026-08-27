import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from './cta'

const symptoms = [
  'Leads nobody followed up on.',
  'Reps spending mornings researching instead of selling.',
  'A number in the dashboard that nobody quite believes.',
  'Leads you disqualified last quarter that would qualify today, sitting where nobody will look at them again.',
]

const facts = [
  "Your market is small enough to count. There are only so many companies that fit what you sell, which means you can know the real number instead of estimating it, and you can know who's in it.",
  "Your customers don't all buy the same way. A utility, a developer, and a corporate sustainability team have almost nothing in common except that you sell to all three. Blending them into one pipeline number gives you an average that describes none of them.",
  'A lot of what decides your timeline is public. Grant cycles, budget approvals, procurement calendars. Most of it is published somewhere before anyone announces anything.',
  "And a first deal is a trial. It either works or you don't get the second one, which makes what happens after the close matter as much as the close.",
]

const stages = [
  {
    title: 'The founder still closes everything',
    body: "You have a handful of customers and most of what happened lives in one person's head. It works until it doesn't, usually around thirty or forty accounts, and by then there's no history to reconstruct.",
    href: '/work#founder-led',
  },
  {
    title: "You raised on numbers you can't reproduce",
    body: 'The funnel math in the deck came from a spreadsheet someone built once. You have a real team now and nobody can rebuild it from the system. Meanwhile a lot of inbound never gets a first touch.',
    href: '/work#post-raise',
  },
  {
    title: 'Every number is two things averaged together',
    body: "You finally have enough volume to compute win rate and cycle length, which means you finally have enough to compute them wrong. A utility deal and a corporate deal don't behave alike.",
    href: '/work#blended-numbers',
  },
  {
    title: 'New logos are carrying too much',
    body: 'Your base is big enough that percentage growth slows on its own. Repeat business should be carrying more of it, and nothing separates that out so you can see how much it actually carries.',
    href: '/work#expansion',
  },
]

const steps = [
  'You fill in a short intake doc. Where you think it is leaking, in your words.',
  'Read only access. We run the checks against your real data.',
  'A findings document. Every leak with a number on it, ordered by what to do first.',
]

const checks = [
  'Your actual market size, counted from the real list rather than the number on a slide from two years ago',
  'Whether your ICP describes the customers you have actually won, or the ones you meant to',
  'How many of your inbound leads got contacted at all, and how fast',
  'Records sitting with no owner, or an owner who left',
  'Your real sales cycle, counting the deals that stalled instead of only the ones that closed',
  'Whether your win rate holds up when you split it by segment',
  "How much of your team's week is spent fixing things that should have worked the first time",
]

export default function Home() {
  return (
    <main>
        {/* HERO — sits at the shell edge rather than on the label spine,
            because it does not use .row. */}
        <section className="hero">
          <div className="shell heroGrid">
            <div>
              <h1>Find out what your revenue data actually says.</h1>
              <p className="sub">
                Go to market engineering and revenue operations for climate
                technology companies.
              </p>
              <Link className="btn big" href={CTA_HREF}>
                {CTA_LABEL}
              </Link>
            </div>

            {/* Placeholder figures. Replace with real ones when available. */}
            <div className="viz">
              <div className="vizhead">Average sales cycle</div>
              <div className="vizrow">
                <div className="k">Counting only deals that closed</div>
                <div className="v bad">64d</div>
              </div>
              <div className="vizrow">
                <div className="k">Counting every deal you opened</div>
                <div className="v good">171d</div>
              </div>
              <p className="viznote">
                Same data. One number is on a slide. The other is what is
                happening.
              </p>
            </div>
          </div>
        </section>

        {/* ENEMY */}
        <section>
          <div className="shell row">
            <div className="label">The problem</div>
            <div>
              <h2 className="enemyTitle">
                Your product is good. Your reps can sell.
              </h2>
              <p>
                Something between those two facts is costing you deals and
                nobody can point at it.
              </p>
              <div className="symptoms">
                {symptoms.map((symptom) => (
                  <div className="symptom" key={symptom}>
                    {symptom}
                  </div>
                ))}
              </div>
              <p className="enemyClose">
                None of that is a people problem. It is what happens when the
                systems underneath a sales team were built one piece at a time
                by whoever had a minute.
              </p>
              <p>
                <strong>We find where it is leaking and we fix it.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section>
          <div className="shell row">
            <div className="label">Why us</div>
            <div>
              <h2 className="diffTitle">
                We know how your business actually works
              </h2>
              {facts.map((fact, i) => (
                <div className="fact" key={fact}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <p>{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAGE SELECTOR — the label and headline sit on the spine, the cards
            break out to the full width of the shell. The only full bleed row
            on the page, and the only cards. */}
        <section>
          <div className="shell">
            <div className="row stagesHead">
              <div className="label">Your stage</div>
              <div>
                <h2 className="stagesTitle">
                  Pick the one that sounds like your quarter
                </h2>
              </div>
            </div>
            <div className="stages">
              {stages.map((stage) => (
                <div className="card" key={stage.title}>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                  <Link href={stage.href}>See the work &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUDIT */}
        <section id="audit">
          <div className="shell row">
            <div className="label">The offer</div>
            <div>
              <h2 className="auditTitle">The RevOps Audit</h2>
              <div className="pricebar">
                <span>Two weeks</span>
                <span>$1,000</span>
                <span>Credited against month one</span>
              </div>

              <div className="steps">
                {steps.map((step, i) => (
                  <div className="step" key={step}>
                    <span className="sn">{String(i + 1).padStart(2, '0')}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>

              <p className="auditBody">
                Most companies are running three versions of the same revenue
                engine. The one leadership thinks they built. The one written
                down in playbooks and CRM fields. And the one your team actually
                uses to get work done, which usually involves a spreadsheet
                somebody maintains by hand. The gap between those three is where
                most of this lives.
              </p>

              <div className="label labelStandalone">What we check</div>
              <ul className="checks">
                {checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>

              <div className="callout">
                <p>
                  <strong>It is yours either way.</strong> If you never talk to
                  us again, you can hand the findings to whoever fixes it.
                </p>
              </div>

              <div className="cta">
                <Link className="btn big" href={CTA_HREF}>
                  {CTA_LABEL}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BOUNDARY */}
        <section className="tight">
          <div className="shell row">
            <div className="label">How we work</div>
            <div>
              <p>
                We build the systems and tell you what the data says. We don&apos;t
                run your revenue org or sit in your standups.
              </p>
              <p>
                Recorded walkthroughs and writing. You get it on your schedule
                and you can forward it to whoever wasn&apos;t in the room.
                Meetings when you want one, never on a standing invite.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSE */}
        <section className="tight">
          <div className="shell row">
            <div className="label">Next</div>
            <div>
              <h2 className="closeTitle">Start with the audit</h2>
              <p className="closeSub">
                Two weeks, $1,000, credited against your first month if you keep
                going. You get the findings either way.
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
