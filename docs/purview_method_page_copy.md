# Purview Ops — /method

The credibility page. This is the one a technical reader actually reads.

Written flatter than the other pages on purpose. Fewer turns of phrase, more statements.

---

## Opening

**Label:** Method

**Headline:** How the diagnosis works

Six things we check for and why each one matters. If you want to run any of this yourself, the descriptions here are enough to do it.

---

## 1. Your sales cycle is probably wrong

**Label:** Survivorship

Most companies compute average sales cycle from deals that closed.

That excludes every deal still open. Deals stay open because they stalled, so the ones you drop are disproportionately the slow ones. The number that comes back is faster than reality, and it gets faster every time something gets stuck.

**Diagram panel, same treatment as the hero panel on the home page:**

```
AVERAGE SALES CYCLE

Closed deals only                          64d   (struck through, muted)
Every deal created in the window          171d   (green)

Same data. The second number includes the deals that never came out.
```

The fix is to compute against every opportunity created in the window, carrying open deals at time elapsed rather than dropping them. In SQL that is the difference between an inner join and a left join. One line.

Both numbers are correct. They answer different questions. The one on your slide answers how long a deal takes if it closes. The one you need answers how long a deal takes.

This matters more here than in most industries because the cycles are long. A six month gap between the two numbers changes hiring plans, cash forecasts, and what you tell a board.

---

## 2. Three versions of the same engine

**Label:** The three engines

Every company is running three revenue engines at once.

**The designed engine.** What leadership believes they built.

**The documented engine.** What the playbooks, CRM fields, and dashboards say.

**The actual engine.** How people get work done. This one usually involves a spreadsheet somebody maintains by hand and a few steps that only happen because a specific person remembers them.

The distance between the three is where most findings come from.

The evidence for the third one is not hidden. It is personal spreadsheets, self-built dashboards, Slack threads used as a system of record, and manual reconciliation before every report.

People route around a system for a reason. Usually the official version does not fit the work. So the workaround is information, not a violation.

---

## 3. Three layers of maturity

**Label:** The layers

Every company fails at one of three layers. Which one tells you what to fix.

**Layer one. Does the practice exist.**
Can you name your ICP in a sentence. Is there a described sales process. Do you know your pilot conversion rate. Failing here means the practice was never built.

**Layer two. Can you produce the numbers.**
Stage conversion, cycle length, win rate by segment, CAC, retention, pipeline coverage. Failing here while passing layer one means the practice exists and was never instrumented. This is the most common failure and the easiest to fix.

**Layer three. Does the system produce them without a person.**
Can the numbers be pulled, or does someone assemble them. A metric that requires a person to assemble is that person answering with extra steps. That is key person risk, and it is what diligence finds.

Most companies think they are at layer three and are at layer two.

---

## 4. Failure demand

**Label:** Failure demand

Failure demand is work that exists only because something failed the first time.

Re-entering data that arrived wrong. Rebuilding a report because the numbers looked off. Rerouting a record that went to the wrong person. Rescuing a deal that went quiet because nobody was watching. Calming a customer who should not have been surprised.

None of it appears on anyone's job description. All of it is on someone's calendar.

This is how we count what a leak costs. Not by estimating what a task should take, but by counting hours spent on work that should not have existed. That number is defensible because the work is observable and the cause is nameable.

A busy team is not necessarily a productive one. Sometimes it is a team processing the consequences of a broken system.

---

## 5. The separation test

**Label:** Separation

An average across two populations that behave differently describes neither of them.

Your win rate is a blend of a utility deal and a corporate deal. Your cycle length is a blend of a repeat customer and a first-time buyer. When the blend moves, nobody can say whether performance changed or the mix did.

The test has four steps.

1. Ask for the stated benchmark.
2. Ask whether it is computed across one population or several.
3. Ask for the same number split by segment.
4. If step three cannot be produced, that is the finding. If it can, the gap between segments is the size of the opportunity.

This works on win rate, cycle length, CAC, and retention. Split by segment, by source, by deal size, and by rep tenure.

It also settles definitional arguments. When sales and marketing disagree about what qualified means, both are correct under their own definition, which is why the meeting never resolves. Run both definitions against closed won data instead. Whichever population converts differently is the one carrying information. Nobody gets overruled.

---

## 6. The lag rule

**Label:** Lag

Any change to how deals are qualified, routed, or worked is invisible in win rate and cycle length until a full cycle has passed.

With cycles running six to eighteen months, that means an intervention made in January shows up in win rate somewhere in the second half of the year. Anything you measure before then is noise.

What does move immediately: opportunity creation rate, qualification pass rate, first touch percentage, time to first touch, stage entry counts.

We state this at the start of an engagement, not at the end. Otherwise good work gets judged on a number that could not have moved yet, and the intervention gets reversed for the wrong reason.

**One thing that follows from it.** Tightening qualification lowers pipeline volume. That is the mechanism working, not failing. Volume down and revenue up is the success case, and it reads as failure to anyone who was not told in advance.

---

## Technical appendix

**Label:** Stack

*Present as a compact list, muted, visually secondary. This is the only place on the site where tools are named.*

**Analysis.** SQL and Postgres. Data quality checks run as their own stage rather than inline. Public examples at `github.com/JohnZebell`.

**CRM.** HubSpot, certified in Marketing Hub, Revenue Operations, and Reporting. GoHighLevel. Salesforce object model, not administration.

**Enrichment and data.** Clay, including multi-stage pipelines with waterfall provider ordering, run conditions, and staged tables so cheap qualification happens before expensive lookups. Apollo, ZeroBounce.

**Automation.** n8n, Zapier, Make. REST APIs and webhooks. Python and JavaScript where the logic needs it.

**AI, where it earns its place.** Classification of free text into fields you can group by. Reading unstructured sources to answer questions no data provider has a field for. Never writing to a CRM field without a check in front of it, and never as a substitute for a rule.

---

## Close

**Label:** Next

**Headline:** All of it runs in two weeks

The audit applies every check on this page to your data. $1,000, credited against your first month if you keep going. The findings are yours either way.

[Start with the audit]

---

## Build notes

**The survivorship diagram uses the hero panel treatment**, not a code block. The point is that two correct-looking numbers come from the same data. A code block would make it about the SQL.

**No code blocks anywhere on this page.** The one SQL reference is a sentence, not a snippet.

**The technical appendix is visually secondary.** Muted, tighter, smaller. It is there for the reader who wants it and should not compete with the six sections above it.

**Section 1 goes first deliberately.** It is the strongest item on the page and burying it wastes it.
