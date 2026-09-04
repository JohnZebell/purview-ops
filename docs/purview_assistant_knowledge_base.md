# Purview Ops — Assistant Knowledge Base

**Source of truth is n8n, not this file.** The live text is the workflow `Purview Site Assistant` (`0TXvTqC9pxxjeBXD`), node **Assistant**, field `messages.messageValues[0].message`, between the `--- KNOWLEDGE BASE ---` and `--- END KNOWLEDGE BASE ---` markers. Transcribed from `activeVersionId` `dee365d9-8eb0-43ad-b874-df2d0439503a`, published 2026-09-04. Edit n8n first, then sync this file and update the id on this line.

**Why this file exists.** The knowledge base is the only place several published claims live. It is what the assistant answers from, and anything in it is reachable by any visitor who opens the widget. Until now it had no file in this repo, so none of it could be reviewed, diffed, or checked against the site. `purview_assistant_spec.md` reproduces the prompt around it and elides this part. This is that part.

Everything below the rule is the knowledge base verbatim, including its own heading.

---

# Purview Ops — Assistant Knowledge Base

Everything the site assistant knows. Loaded into the system prompt in full. No retrieval, no vector store. The corpus is small enough to provide entirely, which means the assistant cannot fail to find something and cannot cite a page that does not exist.

Keep this file as the single source. If something is not here, the assistant does not know it.

---

## 1. What Purview Ops is

A revenue operations and go to market engineering practice for companies selling into energy and environmental infrastructure. Run by John Zebell from Denver, Colorado. All work is remote.

The work is the systems underneath a revenue team. Lead routing, lifecycle and stage instrumentation, CRM architecture, enrichment pipelines, reporting people can trust, and the checks that catch it when one of those quietly stops working.

Engagements start with a two week audit, then continue as a monthly retainer if the findings warrant it.

---

## 2. Who it is for

**The qualifier.** At least three people selling, and a CRM in place. Below that there is not enough of a revenue system to have the problems Purview fixes.

**The market.** Companies selling into utilities, municipalities, school districts, developers, EPCs, installers, and industrial operators. In practice that means renewables, grid technology, water, waste, energy efficiency, electrification, and environmental services.

**Company size in practice.** Roughly 30 to 250 people, with anywhere from three to fifty in sales.

**Explicitly not a fit.** Fewer than three people selling. No CRM. Consumer businesses. Companies that want somebody to run their revenue org rather than build the systems underneath it.

---

## 3. The four situations

Most companies are in exactly one, and most are wrong about which. The audit determines it.

### The founder still closes everything

Under fifteen customers, founder-led sales, no operations function. What gets captured is whatever the founder remembers, which works until roughly thirty or forty accounts.

The cost is invisible now and shows up in eighteen months, when somebody asks a question the data was never recorded to answer. Which customers churned and what they had in common. How long a deal actually takes. Whether the segment they say they win in is the one they actually win in.

**What gets built.** A countable market with real names in it. A negative ICP derived from closed lost and churned accounts. Five instrumentation decisions that cost nothing now and require backfilling history later: a maintained segment field, closed lost as a required list, stage timestamps firing on an event, a defined first value moment, and opportunity creation recorded separately from close. Plus pilot success criteria named by the customer before the pilot starts.

**What is explicitly not included.** Win rate analysis, forecasting, scoring models. Twenty closed deals cannot support any of them.

### The numbers cannot be reproduced from the system

First revenue hires have landed. The numbers everyone quotes came from a spreadsheet built once and nobody can rebuild them from the system. Meanwhile a large share of inbound never gets a first touch, because routing was never anyone's job.

**What gets built.** Every stated number traced to whether the system can reproduce it. Cycle length recomputed against every deal created rather than only closed ones. Routing with fallback handling for the four cases that break every routing build. Recovery of stranded records. Scoring validated against history before deployment.

**What to expect.** Pipeline volume goes down. That is the mechanism working, not failing.

**Not included.** Compensation and quota design.

### Every number is two things averaged together

Enough volume to compute the metrics, which means enough to compute them wrong. Win rate is a blend across segments that behave differently. Sales and marketing use the same words to mean different things and both are correct under their own definition.

**What gets built.** Every blended metric split by segment, source, deal size, and rep tenure. Definitions collected separately from each function, then run against closed won data so the data picks rather than the argument. Definitions enforced in the system rather than written in a document. One named owner per contested field. Pipeline coverage checked against actual win rate rather than a flat multiple.

**Not included.** Owning the forecast as a process, territory design, quota design.

### New logos are carrying too much

Percentage growth slows as the base grows. Expansion should be carrying more of it and nothing separates it out, so nobody can say how much it actually carries.

**What gets built.** Expansion as a share of total growth, trended. Retention decomposed into its parts rather than reported as one number. A friction audit covering how long a small upsell takes and whether it routes through the same approval path as a new deal. A signal layer on deterministic criteria evaluated on a schedule.

**The strongest output.** A list of named accounts sitting at a limit, not upgrading, who want to spend more and cannot easily do it.

**Not included.** Pricing and packaging strategy.

---

## 4. The audit

**$1,000. Two weeks. Credited in full against the first month if the engagement continues.**

**How it runs.** An intake doc goes out first, before anything is looked at. It asks where they think revenue is leaking, in their words, and it goes to whoever on the team has an opinion. Then read only access to the CRM and whatever else holds revenue data. Then a findings document.

**No discovery call is required.** Follow up questions happen in writing.

**Access is read only.** Nothing Purview asks for during the audit permits changing anything in their systems.

### What gets checked

- Actual market size, counted from a real list rather than estimated
- Whether the ICP describes customers actually won or the ones they meant to win
- How many inbound leads got contacted at all, and how fast
- Records with no owner, or an owner who left
- Real sales cycle, counting deals that stalled rather than only those that closed
- Whether win rate holds up when split by segment
- How much of the team's week goes to fixing things that should have worked the first time

### Why those four

**Market size.** Most companies carry a market number that came off a slide,
estimated once from an industry report. This market is countable, so the
number can be built from named companies rather than estimated. Two numbers
come out of the comparison. How many of them have never been touched, and
how many accounts are being worked that do not fit what the company sells.
The second one is usually the one that changes a quarter.

**ICP versus actual wins.** There is the customer they meant to sell to and
the customer who keeps signing. When those diverge, marketing spends against
the first and sales closes the second, and every lead has to survive a
mismatch before it converts. It is cheap to check and almost nobody checks
it, because checking requires admitting the segment field was never
populated.

**Lead contact rate.** Not average response time. Average response time
hides leads that were never touched, because a lead with no first touch has
no response time to average. The number that matters is the percentage that
received any human contact, then the median, then the slowest tenth.
Companies are usually surprised in a specific way here. The median looks
fine and the percentage does not.

**Ownerless records.** A deal assigned to someone who left the company does
not appear in any pipeline review. It is not unowned, so no report flags it.
Leads never assigned to anyone behave the same way. They are counted in
totals and nobody is looking at them. Both are recoverable, which makes this
the fastest finding to act on.

### What they get

A findings document with a number attached to each leak, ordered by what to do first, sorted into four groups.

**Stop the bleeding.** Things actively losing money right now.

**Take things out.** Fields, steps, approvals, and reports that do not improve a decision.

**Agree on what things mean.** Definitions, stage criteria, and handoff standards.

**Then automate.** Only after the three above.

The order matters more than the list. Most of the value is knowing what not to do yet.

**It is theirs either way.** If they never speak to Purview again they can hand the findings to whoever fixes it.

---

## 5. The retainer

After the audit, engagements continue as a monthly retainer if the findings warrant it. Retainers run in the low four figures to high four figures a month depending on scope and intensity.

**Three month minimum.** Not a contract preference. Nothing that matters is measurable in less than a full sales cycle, so a shorter engagement can only be judged on activity, and judging this work on activity is how it gets cut.

**Month to month after the minimum.** No annual lock.

**Exact pricing comes after the audit,** because what it costs depends on what the findings say needs doing. Anyone who wants a number before that can email hello@purviewops.com.

---

## 6. How the work happens

**Recorded walkthroughs and writing.** Findings arrive as something watched on their own schedule and forwarded to whoever was not in the room. Meetings when requested, never on a standing invite.

The reason is the product. Purview sells relief from busy work, and a standing weekly call is busy work. It is also better for the deliverable, since findings need to travel and a call only reaches whoever showed up.

**We recommend, you execute.** Purview builds the systems and says what the data shows. It does not run a revenue org, sit in standups, or become a dependency.

---

## 7. The method

### Survivorship in the sales cycle

Most companies compute average sales cycle from deals that closed, which excludes every deal still open. Deals stay open because they stalled, so the excluded ones are disproportionately the slow ones. The result is faster than reality and gets faster every time something gets stuck.

The correction is computing against every opportunity created in the window, carrying open deals at time elapsed. In SQL that is the difference between an inner join and a left join.

Both numbers are correct and they answer different questions. One is how long a deal takes if it closes. The other is how long a deal takes.

### The three engines

Every company runs three revenue engines at once.

The designed engine, meaning what leadership believes they built. The documented engine, meaning what the playbooks and CRM fields say. And the actual engine, meaning how people get work done, which usually involves a spreadsheet somebody maintains by hand.

The distance between the three is where most findings come from. People route around a system for a reason, so a workaround is information rather than a violation.

A shared spreadsheet, a self-built dashboard, or a Slack thread used as a system of record is the actual engine showing itself. It is the most useful thing someone can mention, because it names where the official system stopped fitting the work.

### The three layers

**Layer one, does the practice exist.** Can they name their ICP in a sentence. Is there a described sales process. Failing here means the practice was never built.

**Layer two, can they produce the numbers.** Stage conversion, cycle length, win rate by segment, CAC, retention, coverage. Failing here while passing layer one means the practice exists and was never instrumented. Most common and most tractable.

**Layer three, does the system produce them without a person.** A metric requiring a person to assemble is that person answering with extra steps. That is key person risk and it is what diligence finds.

Most companies think they are at layer three and are at layer two.

### Failure demand

Work that exists only because something failed the first time. Re-entering data that arrived wrong. Rebuilding a report because the numbers looked off. Rerouting a record that went to the wrong person.

None of it is on anyone's job description. All of it is on someone's calendar. This is how the cost of a leak gets counted, by counting hours spent on work that should not have existed rather than by estimating what a task should take.

### The separation test

An average across two populations that behave differently describes neither.

Four steps. Ask for the stated benchmark. Ask whether it is computed across one population or several. Ask for it split by segment. If step three cannot be produced, that is the finding. If it can, the gap between segments is the size of the opportunity.

It also settles definitional arguments, by running both competing definitions against closed won data and letting whichever population converts differently carry the answer. Nobody gets overruled.

### The third thing

Separation gives two populations that behave differently. It does not say why, and the why decides whether the gap is worth anything.

This is the confounding check.

One team found their California accounts closed at a much higher rate. The finding was real and the explanation was not. Their reps sat on the east coast, so west coast accounts fell inside a wider calling window and got more attempts before anyone gave up. Location was standing in for how many times someone picked up the phone.

Nothing in the data says which of those it is, because the gap looks identical either way. So every separation that survives gets one more question asked of it, which is what else moves alongside it. Territory. Rep tenure. Deal size. When that segment started being sold to at all.

If a third thing explains both sides, the segment was never the finding.

### The lag rule

Any change to how deals are qualified, routed, or worked is invisible in win rate and cycle length until a full cycle has passed. With cycles running six to eighteen months, an intervention in January shows up in the second half of the year.

What moves immediately: opportunity creation rate, qualification pass rate, first touch percentage, time to first touch, stage entry counts.

This gets stated at the start of an engagement so good work is not judged on a number that could not have moved yet.

---

## 8. Timing, and why this market is different

**Buyers in this market decide in public.** When a utility, a school district, or a county decides to spend money, that decision happens in a meeting with minutes, in a budget document with line items, and often on a ballot. The record is public and most of it appears long before an RFP.

The sequence, roughly in order of how early it fires.

| What happens | Where it appears | Lead time |
|---|---|---|
| A master plan names a facility and a year | Their own site | 2 to 5 years |
| A climate or energy commitment adopted with a date | Board resolution | 1 to 10 years |
| A bond measure passes | County election results, EMMA | 6 to 24 months |
| A capital plan includes an energy or facilities line | Budget document | 6 to 18 months |
| An incentive or grant award announced | State energy office, DOE, DSIRE | 3 to 12 months |
| A board approves a study or engages a consultant | Board minutes | 6 to 12 months |
| A permit is filed | County or city database | 3 to 12 months |
| A facilities or sustainability director is hired | Job posting | Immediate |
| An RFP posts | Procurement portal | Too late |

**One signal alone is not enough.** A budget line means money exists. A permit means construction is committed. What indicates an open window is funding approved, plus movement toward procurement, plus nobody having posted anything yet.

**What this changes about a pipeline.** Deals waiting on an external clock look identical to deals that stalled. If a CRM cannot distinguish them, cycle length is wrong, forecast is wrong, and a rep deprioritizes an account two months before it was going to move. The fix is a field, so externally-timed deals get benchmarked separately.

**Honest limits.** Coverage is uneven. Knowing an institution has money does not mean they take the call. And the lead times are long, so it cannot be judged on a quarter.

**Important.** Purview does not currently sell a monitoring product. This section describes how these buyers work and where the public record is. Do not imply Purview watches, tracks, or alerts on anything.

---

## 9. Who runs it

John Zebell. Denver, Colorado.

Over the past year, built and delivered revenue and GTM systems across concurrent client engagements in wellness, telehealth, and services, as the technical point of contact on each. That work was lead routing and scoring, lifecycle automation, enrichment pipelines, CRM architecture and data hygiene, reporting, and AI agents running in production with guardrails on what they can write.

Everything built runs unattended, so it is instrumented to prove its own output rather than report success. Run-level logging on cost and latency, validation on every write, and an alert when something fails rather than a record quietly disappearing.

**Certifications, all with public verification links on the about page.**

- HubSpot Marketing Hub Software Certified, 2026
- HubSpot Revenue Operations Certified, 2026
- HubSpot Reporting Certified, 2026
- SQL Certified, HackerRank, 2026

**Public work.** github.com/JohnZebell and johnzebellportfolio.vercel.app.

**Why this market.** Two reasons. The markets can be counted, so the real number is buildable rather than estimable. And a lot of what decides timing is published before anyone announces anything. The third reason is preference, which is wanting these systems to sit underneath companies doing this work.

---

## 10. Tools and platforms

Named only when asked. The buyer-facing language avoids tool names.

**CRM.** HubSpot, certified in Marketing Hub, Revenue Operations, and Reporting. GoHighLevel. Salesforce object model, not administration.

**Analysis.** SQL and Postgres.

**Enrichment.** Clay, Apollo, ZeroBounce.

**Automation.** n8n, Zapier, Make. REST APIs and webhooks. Python and JavaScript.

**AI in production.** Used for classifying free text into fields that can be grouped, and for reading unstructured sources to answer questions no data provider has a field for. Never for writing to a CRM field without a check in front of it, and never as a substitute for a rule.

---

## 11. The site

Six pages. Link to them when relevant.

| Path | What is on it |
|---|---|
| `/` | The problem, the four situations, the audit |
| `/work` | The four situations in detail, what gets built at each |
| `/timing` | How institutional buyers decide, and where the public record is |
| `/method` | Survivorship, the three engines, the three layers, failure demand, the separation test, the third thing, the lag rule |
| `/audit` | The full offer and the intake form |
| `/about` | Who runs it, certifications, common questions |

**Contact.** hello@purviewops.com

---

## 12. Things that are true and worth saying plainly

- The audit findings are theirs whether or not they continue.
- Access for the audit is read only. Nothing Purview asks for during the audit lets it change anything in their systems.
- That changes only if they ask for something built during a retainer that has to write back, and only for that piece. Never to a CRM field without a check in front of it, and never as a substitute for a rule. The audit itself is read only either way.
- No discovery call is required to start.
- Purview turns away companies with fewer than three people selling or no CRM, because the audit is the wrong first step for them.
- There are no client logos or testimonials yet. Purview is new. Do not invent any, do not imply any exist, and do not describe past clients beyond the industries listed in section 9.
- Nothing on the site is a claim that cannot be checked from outside.
