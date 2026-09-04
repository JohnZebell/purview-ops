import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from '../cta'
import { pageMetadata } from '../seo'

/* Every file that says what this page covers. Change what the page holds
   and these go stale.

   - The meta description below, and the two comments in this file, one on
     the stage part shape and one on the sequence section
   - docs/purview_work_page_copy.md
   - docs/marketing_ops_sequence_copy.md, the sequence section
   - docs/purview_assistant_knowledge_base.md, section 11 and section 3
   - docs/purview_assistant_spec.md, the linking rule
   - docs/purview_build_instructions.md, the route table and order of work
   - app/globals.css, the Work page banner, which counts the parts per
     stage

   Record of one pass rather than a current description:
   docs/purview_copy_pass.md. */

export const metadata = pageMetadata({
  title: 'Our work',
  description:
    'Four ways revenue operations usually goes wrong in energy and environmental infrastructure, and what we build in each one.',
  path: '/work',
})

/* Every stage runs the same parts in the same order. Cost first, because the
   reader has to feel the number before they care about the fix.

   A part is either prose or a run-in list. `muted` marks the boundary
   statement, which reads at footnote weight rather than earning its own
   level. */
type Part = {
  label: string
  paras?: string[]
  items?: { lead: string; paras: string[] }[]
  muted?: boolean
}

type Stage = {
  id: string
  label: string
  title: string
  parts: Part[]
}

const stages: Stage[] = [
  {
    id: 'founder-led',
    label: 'Founder led',
    title: 'The founder still closes everything',
    parts: [
      {
        label: 'What it is costing you',
        paras: [
          "You are running on memory. That works, and it keeps working, right up until it doesn't. The number where it breaks is usually somewhere between thirty and forty accounts, and nobody notices the day it happens.",
          'What it costs is not visible now. It shows up eighteen months from now when someone asks a question you should be able to answer and the data to answer it was never captured. Which customers churned and what they had in common. How long a deal actually takes. Whether the segment you say you win in is the one you actually win in.',
          'You cannot go back and get it. That history had to be recorded while it was happening.',
        ],
      },
      {
        label: 'Why it happens',
        paras: [
          'Nobody is wrong here. At ten customers, instrumentation has no payoff. Every hour spent setting up fields and stages is an hour not spent closing, and closing is correctly the only thing that matters.',
          'So the decision gets deferred, which is right. It just never gets undeferred, because there is no week where it becomes urgent.',
        ],
      },
      {
        label: 'What we do',
        items: [
          {
            lead: 'Build the market, do not estimate it.',
            paras: [
              'Your market is countable. There are a specific number of companies that fit what you sell and they can be named. We source the full population, filter on real attributes, and hand you the list plus the pipeline that produced it, so you can add companies at the top and get validated contacts out the bottom.',
            ],
          },
          {
            lead: 'Find the customers you should not chase.',
            paras: [
              'Take closed lost, churned, and high support cost accounts and find what they share. That set is usually easier to describe than the good one and it saves more time, because it becomes a filter rather than a low score. A low scored account stays visible, and anything visible eventually gets worked.',
            ],
          },
          {
            lead: 'Instrument the five things that get expensive later.',
            paras: [
              'A maintained segment field. Closed lost as a required list rather than a text box. Stage timestamps that fire on an event rather than when someone drags a card. A defined moment where a customer first gets value. Opportunity creation recorded separately from close.',
              'None of it requires new tooling. All of it requires a decision nobody currently has a reason to make.',
            ],
          },
          {
            lead: 'Set pilot criteria before pilots start.',
            paras: [
              'The customer names what success looks like, with a number and a deadline, before anything begins. At your volume this beats any analytical approach, because the only opinion that decides renewal is theirs.',
            ],
          },
        ],
      },
      {
        label: 'What changes',
        paras: [
          'The market number stops being a guess. You get a count you can defend to anyone who asks.',
          'Founder hours come off list building, priced against what a founder hour is worth.',
          'And in a year, when someone asks a question about your first hundred customers, the answer exists.',
        ],
      },
      {
        label: 'What this does not include',
        muted: true,
        paras: [
          'Win rate analysis, forecasting, or scoring models. Twenty closed deals cannot support any of them. Anyone selling you those at this stage is selling you a number you should not trust.',
        ],
      },
    ],
  },

  {
    id: 'unreproducible',
    /* Was "Post raise", which assumed the reader raised money in exactly the
       way the rest of this section was rewritten to stop doing. */
    label: 'Funnel math',
    title: 'Your funnel math lives in a spreadsheet',
    parts: [
      {
        label: 'What it is costing you',
        paras: [
          'At companies with no routing, roughly four out of five inbound records never receive a first touch. Not a slow touch. None.',
          'You paid to generate every one of those. Multiply your cost per lead by the ones nobody contacted and that is a number sitting on your P&L that nobody has ever calculated.',
          'Then there is the second number. The funnel math everyone quotes came from a spreadsheet built once. Every plan you make gets measured against it, at a volume where it should now be computable from the system. Right now it is not.',
        ],
      },
      {
        label: 'Why it happens',
        paras: [
          "Routing does not belong to anyone. Marketing's job ended when the lead arrived. Sales' job starts when someone assigns it. Nothing in between is on anyone's list.",
          'The funnel math is the same shape. Early on those numbers were assertions supported by anecdote, which was correct at the time. Nothing required them to be measurable, only credible. So the instrumentation that would make them checkable never got built.',
        ],
      },
      {
        label: 'What we do',
        items: [
          {
            lead: 'Trace every number you state about yourself.',
            paras: [
              'Conversion rates, cycle length, the segment you say you win in. For each one, find out whether it can be reproduced from your system today. The gap has a predictable shape and it is always bigger than anyone expects.',
            ],
          },
          {
            lead: 'Recompute cycle length against every deal, not just the closed ones.',
            paras: [
              'The version most companies have only counts deals that finished, so anything stuck is invisible and the number gets faster every time something stalls. The corrected version counts everything created in the window and carries open deals at time elapsed. Those two numbers are usually not close.',
            ],
          },
          {
            lead: 'Build routing with the failure cases handled.',
            paras: [
              'Enrichment on submission, assignment inside a defined window, and a fallback for each of the four cases that break every routing build. No rep matches. The matching rep is unavailable or gone. The record is a duplicate. The account already has an owner. Each one gets a status and an alert rather than disappearing.',
            ],
          },
          {
            lead: 'Recover what is already stranded.',
            paras: [
              'Deals sitting on deactivated users. Qualified contacts nobody ever contacted. This is revenue from records you already own and already paid for.',
            ],
          },
          {
            lead: 'Check that your contacts still work where your CRM says they do.',
            paras: [
              'A record does not decay visibly. The name is still there, the title is still there, and the person left eighteen months ago. On a six to eighteen month cycle that matters more than it does elsewhere, because the relationship you spent two years building is attached to someone who is no longer in the building. The ones who moved get surfaced instead of sitting there looking correct.',
            ],
          },
          {
            lead: 'Validate scoring before deploying it.',
            paras: [
              'Run win rate by score band against your actual history first. If the bands do not separate, the criteria are wrong, and no amount of weight tuning fixes wrong criteria.',
            ],
          },
        ],
      },
      {
        label: 'What changes',
        paras: [
          'Percentage of inbound contacted, measured before and after. That one moves in weeks rather than quarters.',
          'Recovered pipeline from stranded and never-contacted records, with a dollar figure attached.',
          'A funnel that reconciles. That one cannot be assembled retroactively, because stage timestamps only exist if the system was recording at the time.',
        ],
      },
      {
        label: 'One thing to expect',
        paras: [
          'Pipeline volume will go down. Tighter qualification means fewer opportunities created, and that reads as failure to anyone who was not warned. What should improve instead is opportunity to close conversion, win rate by band, and cycle length. We state this at kickoff so nobody is surprised in month two.',
        ],
      },
      {
        label: 'What this does not include',
        muted: true,
        paras: [
          'Compensation and quota design. Those become real problems around the same time and they should not be solved by whoever is fixing the pipe underneath them.',
        ],
      },
    ],
  },

  {
    id: 'blended-numbers',
    label: 'Blended numbers',
    title: 'Every number is two things averaged together',
    parts: [
      {
        label: 'What it is costing you',
        paras: [
          'You have a win rate. It is an average across a utility deal and a corporate deal, which have almost nothing in common except that you sell to both.',
          'The average moves. Sometimes it moves the right way for the wrong reason, like when one segment shrinks rather than the other improving. That happens often enough that nobody fully trusts the number, and everybody quotes it anyway, including in the numbers that go upstairs.',
          'The cost is every decision made from it. Where headcount goes. Which segment gets the marketing budget. What the forecast says.',
        ],
      },
      {
        label: 'Why it happens',
        paras: [
          'You could not compute these numbers a year ago. Now you can, which means now you can compute them wrong.',
          'And the definitional problem underneath it is genuinely unresolvable by argument. Ask marketing what qualified means and ask sales the same question, and both answers are correct under their own definition. That meeting never settles anything because there is nothing to settle it with.',
        ],
      },
      {
        label: 'What we do',
        items: [
          {
            lead: 'Split every metric that is currently blended.',
            paras: [
              'Cycle length, win rate, CAC, and retention, broken out by segment, by source, by deal size, by rep tenure. The inability to produce that split is the first finding. The size of the gap once produced is the size of the opportunity.',
            ],
          },
          {
            lead: 'Collect the definitions separately, then let the data pick.',
            paras: [
              'Each function writes down what they mean by qualified, by opportunity, by stage entry, by closed lost versus disqualified versus no decision. Then we run each competing definition against what actually closed. Whichever population converts at a materially different rate is the one carrying information.',
              'Nobody gets overruled. They get shown a number. That is the difference between an argument and a decision.',
            ],
          },
          {
            lead: 'Enforce it in the system, not in a document.',
            paras: [
              'A definition nobody can violate is a definition. Stage criteria in a doc, with a CRM that lets anyone drag any deal anywhere, is a doc. The output is required fields, validation rules, and stage gates.',
            ],
          },
          {
            lead: 'Name one owner per contested field.',
            paras: [
              'Account revenue lives in the CRM, in billing, and in the finance model. Segment frequently exists in three places with three values. For each one, a single system of record, a single sync direction, and a named person who can override. Connecting systems that disagree just propagates the disagreement faster.',
            ],
          },
          {
            lead: 'Check coverage against your actual win rate.',
            paras: [
              'Correct pipeline coverage is roughly the inverse of your win rate plus a slippage buffer, not a flat three or four times. Coverage and win rate are the same fact stated two ways, and a company carrying a ratio that does not match its own win rate is either holding junk pipeline or heading for a miss it cannot see.',
            ],
          },
        ],
      },
      {
        label: 'What changes',
        paras: [
          'Forecast variance, tracked by quarter, with the trend mattering more than any single number. That one metric tests whether stage definitions mean anything, whether reps report honestly, whether qualification discriminates, and whether leadership understands its own funnel. Any one of those broken shows up as variance.',
          'Consolidated tooling, stated annually. Most companies at this stage are paying three vendors for overlapping coverage and nobody has looked.',
          'And a headline number that traces back to something.',
        ],
      },
      {
        label: 'What this does not include',
        muted: true,
        paras: [
          'Owning the forecast as a process, territory design, or quota design. We make the forecast more accurate. We do not run it.',
        ],
      },
    ],
  },

  {
    id: 'expansion',
    label: 'Expansion',
    title: 'New logos are carrying too much',
    parts: [
      {
        label: 'What it is costing you',
        paras: [
          'Percentage growth slows as your base gets bigger. That is arithmetic, not performance. A company still getting ninety percent of growth from new logos at fifteen million is walking toward a wall it cannot currently see.',
          'There is a more specific cost, and it is usually the one that lands. Somewhere in your customer base are accounts sitting at ninety five to ninety nine percent of a limit, month after month, not upgrading. They want to give you more money and something is in the way. Nobody has that list.',
        ],
      },
      {
        label: 'Why it happens',
        paras: [
          'Expansion has no owner in most companies. Sales is compensated on new logos. Customer success is compensated on retention. Expansion sits between them and gets whatever attention is left over.',
          'And the instrumentation that would make it visible usually does not exist. If expansion revenue and new business revenue are not separated in the system, then expansion share of growth, retention decomposed by its parts, and expansion velocity are all uncomputable. One recording decision blocks four metrics.',
        ],
      },
      {
        label: 'What we do',
        items: [
          {
            lead: 'Compute expansion as a share of total growth, trended.',
            paras: [
              'This is a better diagnostic than net retention, which tells you the base is growing while this tells you how much of the whole engine is the cheap half.',
            ],
          },
          {
            lead: 'Decompose net retention into its six parts.',
            paras: [
              'Seat, usage, cross sell, price, contraction, churn. One number blends all six and hides which one is moving. Gross retention stated alongside it, always.',
            ],
          },
          {
            lead: 'Audit the friction, which nobody does.',
            paras: [
              'How long a small upsell takes from customer agreement to invoiced. Whether adding something requires a new contract, an amendment, or a click. Whether a small expansion routes through the same approval path as a new deal. And the accounts sitting persistently at a limit without upgrading.',
            ],
          },
          {
            lead: 'Build the signal layer.',
            paras: [
              'Deterministic criteria, evaluated on a schedule, alerting when something changes state. Limit proximity, usage deviating from the expected path, a champion promoted or departed, a buying window opening.',
            ],
          },
          /* The four items above assume a meter. These two carry the same
             layer for clients whose product gets installed rather than logged
             into, which is roughly half the stated ICP and had nothing here
             before. A parallel set rather than a rewrite, because limit
             proximity is the strongest signal on the page for the clients it
             does describe.

             The funding document signal is the /timing argument pointed at an
             existing customer rather than a new one. Not linked, because paras
             are plain strings and a link would mean changing Part and
             StagePart. */
          {
            lead: 'Read the installed base when there is no meter.',
            paras: [
              'Limit proximity and usage assume a meter. If what you sell gets installed rather than logged into, the strongest signal is age. A unit put in eight years ago against a ten year service life is a buying window on a computable schedule, and the schedule runs whether or not anyone is reading it.',
              'The next one is the document that funded you. Capital work arrives in tranches, and the plan that paid for the first job often approved the second at the same time. Phase two was sitting in the document that funded phase one and nobody read it.',
              "Then coverage inside the account. How many of a customer's sites run your equipment, against how many they operate. That is a number you can state, and almost nobody states it.",
              'And change orders, which are the expansion motion in a project business whether or not anyone calls them that. Value as a share of contract says how much is already happening. Cycle time from agreement to invoiced says what it costs to get.',
            ],
          },
          {
            lead: 'Replace net retention where there is nothing recurring under it.',
            paras: [
              'The six parts need a subscription to decompose. Without one, the same questions get answered by repeat purchase rate, time to second order, revenue per account per year trended, and service contract retention. Most equipment companies already have that last number and do not read it as retention.',
            ],
          },
        ],
      },
      {
        label: 'What changes',
        paras: [
          'The strongest output here is not a recommendation. It is a list of named accounts with revenue attached that are trying to spend more with you and cannot easily do it.',
          'Revenue per employee, which is the metric the CEO and CFO already care about.',
          'Expansion cycle time against new logo cycle time. If those are close, the process is treating an existing customer like a stranger.',
        ],
      },
      {
        label: 'What this does not include',
        muted: true,
        paras: [
          'Pricing and packaging strategy. We can show you exactly where the current model is causing accounts to stall. Deciding what to change it to is a different job.',
        ],
      },
    ],
  },
]

/* The sequence section's three months. Same Part shape the stages use, so
   they run through StagePart and render as a label plus paragraphs.

   Structural rather than cosmetic. .stageTitle carries margin-bottom 0 and
   the gap under it comes from .subLabel's margin-top, so an h2 followed
   directly by a p sits flush. Every situation above is spaced by the label
   that follows its title, and this section now is too.

   Each opener drops the month name, because the label already says it. */
const months: Part[] = [
  {
    label: 'Month one, the record',
    paras: [
      "Whether a deal has an owner, whether a stage means the same thing to two people, whether a lost reason can be grouped, whether the fields that answer next quarter's question exist yet.",
      'None of that is interesting on its own. It is the thing everything else sits on.',
    ],
  },
  {
    label: 'Month two, the reporting',
    paras: [
      'This starts once there is enough closed history to report on. Cycle length computed against every opportunity created rather than only the ones that closed. Win rate split by whichever populations actually behave differently. Stage conversion and time in stage. Pipeline coverage checked against a real win rate instead of a flat multiple.',
      'That work is only possible after month one. A report built on a record that does not hold the right fields is a reliable wrong number, which is worse than no number, because people act on it.',
    ],
  },
  {
    label: 'Month three, the inputs',
    paras: [
      'Whether a campaign parameter survives the click, lands in a hidden field, writes to the record, and is still attached when the deal closes. Whether every form on the site completes its path or quietly fails after showing the visitor a confirmation. Whether there is one way to name a campaign or four. Which audiences are still being sent to and which have not been touched in a year.',
      'This is where most companies want to start, because it is the part that feels like growth. Started here, it produces attribution for a pipeline nobody can measure and campaigns feeding a record nobody trusts.',
    ],
  },
]

function StagePart({ part }: { part: Part }) {
  return (
    <>
      <h3 className="label subLabel">{part.label}</h3>

      {part.items ? (
        <div className="doList">
          {part.items.map((item) => (
            <div className="doItem" key={item.lead}>
              {item.paras.map((text, i) => (
                <p key={text}>
                  {i === 0 && <strong>{item.lead}</strong>}
                  {i === 0 ? ` ${text}` : text}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        part.paras?.map((text) => (
          <p className={part.muted ? 'excluded' : undefined} key={text}>
            {text}
          </p>
        ))
      )}
    </>
  )
}

export default function Work() {
  return (
    <main>
      {/* INTRO. Plain section rather than .hero, because .hero h1 carries a
          16ch measure that would win on specificity over the page headline. */}
      <section>
        <div className="shell row">
          <div className="label">Our work</div>
          <div>
            <h1 className="introTitle">Four ways this usually goes wrong</h1>
            <p>
              Every engagement starts with the same audit. What we find
              determines which of these you are actually in. Most companies
              think they are in one and turn out to be in another.
            </p>
            <nav className="jump" aria-label="The four situations">
              {stages.map((stage) => (
                <a href={`#${stage.id}`} key={stage.id}>
                  {stage.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {stages.map((stage) => (
        <section id={stage.id} key={stage.id}>
          <div className="shell row">
            <div className="label">{stage.label}</div>
            <div>
              <h2 className="stageTitle">{stage.title}</h2>
              {stage.parts.map((part) => (
                <StagePart part={part} key={part.label} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* SEQUENCE. Not a stage. It has none of the five-part spine, and a
          fifth entry in `stages` would contradict both the h1 above and the
          jump nav, which promise four.

          Inline rather than through StagePart because paras are plain
          strings, so the strong on the closing line has nowhere to live.

          Carries an id so it can be linked, and is deliberately absent from
          the nav for the same reason it is absent from `stages`. */}
      <section id="sequence">
        <div className="shell row">
          <div className="label">Sequence</div>
          <div>
            <h2 className="stageTitle">Why the order matters</h2>
            {months.map((month) => (
              <StagePart part={month} key={month.label} />
            ))}
            {/* Separates from month three at the same 2.5rem the months
                separate from each other, so it reads as the conclusion
                rather than as more of month three. Not a fourth month, so
                it takes the spacing without taking a label. */}
            <p className="auditBody">
              <strong>
                That sequence is the whole reason for a three month minimum.
              </strong>{' '}
              Not a contract preference. Each month is built on the one before
              it, so a shorter engagement does not produce a partial result. It
              produces the first layer and nothing standing on it.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="tight">
        <div className="shell row">
          <div className="label">Next</div>
          <div>
            <p>Every one of these starts the same way.</p>
            <p>
              <strong>The RevOps Audit.</strong> Two weeks, $1,000, credited
              against your first month if you keep going. We find out which of
              the four you are actually in, and you get the findings either way.
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
