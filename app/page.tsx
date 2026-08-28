import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from './cta'
import { pageMetadata, SITE_DESCRIPTION } from './seo'

/* No title. The home page takes the layout's default rather than running
   through the `%s · Purview Ops` template and saying the name twice. */
export const metadata = pageMetadata({
  description: SITE_DESCRIPTION,
  path: '/',
})

const symptoms = [
  'Leads nobody followed up on.',
  'Reps spending mornings researching instead of selling.',
  'A number in the dashboard that nobody quite believes.',
  'Leads you disqualified last quarter that would qualify today, sitting where nobody will look at them again.',
]

/* Public timing leads. It is the only claim here a generalist cannot learn
   quickly, so it argues rather than lists, which is why it runs long and the
   other three stay short. Run-in leads reuse the .doItem treatment from
   /method rather than earning a fourth type level. */
const facts = [
  {
    lead: 'A lot of what decides your timeline is already published.',
    body: 'Your buyers are utilities, municipalities, districts, and agencies. When they decide to spend money, they do it in a public meeting, with minutes. The capital plan is on a website. The bond measure was on a ballot. The permit is in a county database. Most of it exists months before anyone posts an RFP, and by the time the RFP is out the specification was usually written with somebody already in the room.',
  },
  {
    lead: 'Your market is small enough to count.',
    body: 'There are only so many companies and institutions that fit what you sell, which means you can know the real number instead of estimating it, and you can know who is in it.',
  },
  {
    lead: 'Your customers do not all buy the same way.',
    body: 'A utility, a municipality, and a private operator have almost nothing in common except that you sell to all three. Blending them into one pipeline number gives you an average that describes none of them.',
  },
  {
    lead: 'A first deal is a trial.',
    body: 'It either works or you do not get the second one, which makes what happens after the close matter as much as the close.',
  },
]

const stages = [
  {
    title: 'The founder still closes everything',
    body: "You have a handful of customers and most of what happened lives in one person's head. It works until it doesn't, usually around thirty or forty accounts, and by then there's no history to reconstruct.",
    href: '/work#founder-led',
  },
  {
    title: 'Your funnel math lives in a spreadsheet',
    body: "The numbers everyone quotes came from a spreadsheet someone built once. You have a real team now and nobody can rebuild them from the system. Meanwhile a lot of inbound never gets a first touch, because routing was never anyone's job.",
    href: '/work#unreproducible',
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
              {/* Same constant as the meta description and the social card,
                  so the front door claim cannot drift between them. */}
              <p className="sub">{SITE_DESCRIPTION}</p>
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
                <div className="fact" key={fact.lead}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <p>
                    <strong>{fact.lead}</strong> {fact.body}
                  </p>
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

              {/* Its own label and destination, not an override of the CTA
                  constant. Three audit CTAs remain: header, hero, close. */}
              <div className="cta">
                <Link className="btn big" href="/audit">
                  See what we check
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
              <div className="cta">
                <Link className="btn big" href="/method">
                  How the diagnosis works
                </Link>
              </div>
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
