import IntakeForm from './IntakeForm'
import { pageMetadata } from '../seo'

export const metadata = pageMetadata({
  title: 'The RevOps Audit',
  description:
    'Two weeks. We tell you where your revenue is leaking and what each leak is worth.',
  path: '/audit',
})

const steps = [
  'You fill in a short intake doc. Where you think it is leaking, in your words. Send it to whoever on your team has an opinion, because the places they disagree are usually the interesting part.',
  'Read only access to your CRM and whatever else holds revenue data. We run the checks against your real numbers, not a benchmark.',
  'A findings document. Every leak with a number on it, ordered by what to fix first.',
]

const checks = [
  {
    lead: 'Your actual market size, counted rather than estimated.',
    body: 'Most companies have a market number that came off a slide someone made two years ago. Your market is countable. There are a specific number of companies that fit what you sell and they can be named. We build the list and give you the count, plus the accounts in it.',
  },
  {
    lead: 'Whether your ICP describes who you have actually won.',
    body: 'There is the customer you meant to sell to and the customer who keeps signing. When those diverge, marketing is spending against the first one while sales is closing the second. That gap is expensive and almost nobody checks it.',
  },
  {
    lead: 'How many inbound leads got contacted at all, and how fast.',
    body: 'Not average response time. The percentage that received any first touch, plus the median and the slowest tenth. You paid to generate every one of those records.',
  },
  {
    lead: 'Records sitting with no owner, or an owner who left.',
    body: "Deals assigned to someone who is no longer at the company do not surface in anyone's pipeline review. Neither do leads that never got assigned to anyone. Both are quietly sitting there.",
  },
  {
    lead: 'Your real sales cycle, counting deals that stalled.',
    body: 'The number most companies quote counts only deals that finished. Anything stuck gets excluded, so the number gets faster every time something stalls. We compute it against every deal you opened, carrying open ones at time elapsed. The two numbers are usually not close.',
  },
  {
    lead: 'Whether your win rate holds up when you split it by segment.',
    body: 'A blended win rate across a utility deal and a corporate deal describes neither of them. Sometimes the blend moves the right way for the wrong reason, which is why nobody quite trusts it. Being unable to produce the split is itself a finding.',
  },
  {
    lead: "How much of your team's week goes to fixing things that should have worked.",
    body: 'Re-entering data that arrived wrong. Rebuilding a report because the numbers looked off. Rescuing a deal that went quiet because nobody was watching. This is work that exists only because something upstream failed, and it is the most expensive thing on this list because nobody has ever counted it.',
  },
]

const groups = [
  {
    lead: 'Stop the bleeding.',
    body: 'Things actively losing money right now. Broken routing, missing ownership, alerts nobody set up.',
  },
  {
    lead: 'Take things out.',
    body: 'Fields, steps, approvals, and reports that do not improve any decision. Complexity compounds and every one of these is something your team maintains forever.',
  },
  {
    lead: 'Agree on what things mean.',
    body: 'The definitions, stage criteria, and handoff standards that make good work repeatable instead of dependent on who did it.',
  },
  {
    lead: 'Then automate.',
    body: 'Only after the three above. Automating a process nobody understands produces a faster version of the same problem.',
  },
]

export default function Audit() {
  return (
    <main>
      {/* HERO. Sits at the shell edge rather than on the label spine, the
          same as the home page hero, because the copy gives it no label. */}
      <section className="hero">
        <div className="shell">
          <h1 className="auditHero">The RevOps Audit</h1>
          <p className="sub">
            Two weeks. We tell you where your revenue is leaking and what each
            leak is worth.
          </p>
          <div className="pricebar">
            <span>Two weeks</span>
            <span>$1,000</span>
            <span>Credited against your first month</span>
          </div>
        </div>
      </section>

      {/* HOW IT RUNS. The section labels carry the heading level on this page,
          because the copy gives these sections no headlines. */}
      <section>
        <div className="shell row">
          <h2 className="label">How it runs</h2>
          <div>
            <div className="steps stepsWide">
              {steps.map((step, i) => (
                <div className="step" key={step}>
                  <span className="sn">{String(i + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE PREMISE */}
      <section>
        <div className="shell row">
          <h2 className="label">The premise</h2>
          <div>
            <p>
              Most companies are running three versions of the same revenue
              engine.
            </p>
            <p>
              The one leadership thinks they built. The one written down in
              playbooks and CRM fields. And the one your team actually uses to
              get work done, which usually involves a spreadsheet somebody
              maintains by hand and a few things that only work because a
              specific person remembers to do them.
            </p>
            <p>
              Nobody is hiding anything. The three drifted apart one small
              decision at a time, and no single decision was wrong.
            </p>
            <p>
              The gap between those three is where most of what we find lives.
            </p>
          </div>
        </div>
      </section>

      {/* THE CHECKS */}
      <section>
        <div className="shell row">
          <h2 className="label">The checks</h2>
          <div>
            <p>
              Each of these produces a number. If you can already answer one,
              that is good news and we move on.
            </p>
            <div className="doList">
              {checks.map((check) => (
                <div className="doItem" key={check.lead}>
                  <p>
                    <strong>{check.lead}</strong> {check.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE DELIVERABLE */}
      <section>
        <div className="shell row">
          <h2 className="label">The deliverable</h2>
          <div>
            <p>
              A findings document. Each leak stated plainly, with a count and a
              dollar figure, sorted into four groups.
            </p>
            <div className="doList">
              {groups.map((group) => (
                <div className="doItem" key={group.lead}>
                  <p>
                    <strong>{group.lead}</strong> {group.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="auditBody">
              The order matters more than the list. Most of the value is knowing
              what not to do yet.
            </p>
            <div className="callout">
              <p>
                <strong>It is yours either way.</strong> If you never talk to us
                again, hand it to whoever fixes it. No part of it is written to
                be unusable without us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOUNDARIES */}
      <section>
        <div className="shell row">
          <h2 className="label">Boundaries</h2>
          <div>
            <p>
              We do not need a discovery call before the intake doc. You fill in
              the doc, we ask follow ups in writing if we have any.
            </p>
            <p>We do not need access to anything we cannot read only.</p>
            <p>
              We are not going to tell you your team is bad at their jobs. The
              things we find are almost always work that belonged to nobody, not
              work somebody did wrong.
            </p>
            <p>
              And we do not stay after unless you want us to. The audit is a
              fixed piece of work with a fixed price and an end.
            </p>
          </div>
        </div>
      </section>

      {/* THE FORM */}
      <section id="start">
        <div className="shell row">
          <h2 className="label">Start</h2>
          <div>
            <h3 className="formTitle">
              Tell us where you think it is leaking
            </h3>
            <p className="sub formSub">
              Six questions. Two minutes. We will come back with what access we
              need.
            </p>
            <IntakeForm />
          </div>
        </div>
      </section>
    </main>
  )
}
