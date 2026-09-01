# Capabilities

The full list, with the mechanism under each line. A capability without a mechanism is a claim, and every agency page has those.

**Internal markers, strip before publishing.** `[P]` means built in production. `[C]` means certified or worked out from principle but not built for a client. `[F]` means fresh knowledge, would need a pass before fielding hard questions on it.

**Two things to know about the site before any of this is published.**

Six of these groups are absent from the site entirely, and all six are marketing operations. Attribution and UTM integrity, competitor monitoring, deliverability and sending, campaign operations, form and conversion path instrumentation, and list hygiene in the marketing sense. The published site is sales-side throughout. That is the gap this document exists to close.

The current site distinguishes audit access from retainer access. The audit is read only. A retainer build may write, and only where a build requires it, never to a CRM field without a check in front of it. Anything here that needs a write path is publishable on that basis. Anything needing an installed pixel is a client-installed thing rather than a promise change.

---

## CRM architecture and data

**Object model and association structure** `[P]`
Deciding how companies, contacts, deals, and custom objects tie together, and building the model the org already has in its head rather than the one the platform ships with.

**Field architecture and required properties** `[P]`
Which fields have to exist for a question to be answerable later, and which stage transitions require them. Requiring a couple per stage rather than a dozen, because reps stop updating deals that fight them.

**Closed lost as an enum** `[P]`
Free-text loss reasons cannot be grouped, so they cannot be counted. A required list turns loss into a number.

**Normalization on write** `[P]`
Casing, domain formatting, and identity resolution applied on create and on relevant field update, not on every interaction, which just reprocesses clean data.

**Deduplication and identity resolution** `[P]`
Case-sensitive email matching, name casing, and the ladder of near-matches that a straight equality join misses.

**Scheduled data-quality audits** `[P]`
Duplicates, orphaned records, contradictory reporting, and stuck deals surfaced on a schedule rather than found when someone questions a number.

---

## Lifecycle, routing, and scoring

**Lifecycle stage design and definition alignment** `[P]`
Marketing, sales, and CS use the same words for different things, which is why the numbers never agree. Definitions get collected separately from each function, then run against closed-won data so the data arbitrates instead of the meeting.

**Lead routing with fallback handling** `[P]`
Routing is a rule, so it is code rather than a model. The build is in the four cases that break every routing system. No rep matches, the rep is unavailable, the record is a duplicate, and ownership already exists. Every one gets a fallback and an alert.

**Lead and account scoring from closed-won data** `[P]`
Weights derived from each signal's actual separating power, validated on a train and test split so they hold on records the model has not seen.

**MQL, SQL, and PQL definition** `[C]`
MQL and SQL are guesses about intent. PQL is behavioral and only exists where there is usage signal. Qualification as a tier rather than a wall, so borderline records pass flagged instead of disappearing.

**Handoff standards and SLAs** `[P]`
The handoff breaks on trust, not on process. It gets fixed by defining the threshold from closed-won data so neither side is overruled by the other.

---

## Marketing operations

**Campaign operations and UTM governance** `[P]`
Naming standardization is the actual work, and it is a governance task before it is a tracking one. Every attribution problem downstream starts with two campaigns spelled differently.

**Form and conversion-path instrumentation** `[P]`
Hidden fields carrying source data, capture before any external call runs, and a real failure rather than a silent success when a write fails.

**Segmentation and list hygiene** `[P]`
Active segments versus ones nobody has touched, engagement weighting, and sunsetting so a list stops being a liability.

**Nurture and lifecycle automation** `[P]`
Multi-step sequences with branching, consent gating, and re-entry rules that stop a record cycling through the same track twice.

**Consent and tracking standards** `[F]`
Consent state is data that gates both tracking and outreach, which makes it a compliance requirement and an attribution input at the same time.

---

## Reporting and attribution

**Custom report building** `[C]`
Datasets, joins where the primary source sets the population, measures against dimensions, and the difference between a count and a distinct count that quietly changes an answer.

**Attribution models and when each applies** `[C]`
First touch, last touch, linear, position-based, time decay, and full path. Each is a lens rather than a truth, and last touch is the dangerous default because it over-credits whatever happened closest to the close. Holding one model consistent quarter over quarter matters more than picking the right one.

**The tracking chain, end to end** `[P]`
A UTM has to survive the click, get captured in a hidden field, write to the lead record, and still be attached when the deal closes. When a company says it cannot tie revenue to campaigns, that chain broke somewhere specific and it is findable.

**Funnel metrics** `[P]`
Stage conversion, cycle length, win rate by segment, CAC, retention, and pipeline coverage checked against actual win rate rather than a flat multiple.

**Dashboard design** `[C]`
Purpose before layout, designed for whoever reads it, and the chain from data to information to insight to action. A dashboard that produces no decision is a report.

---

## Automation and integration

**Multi-step workflow building** `[P]`
n8n as primary, plus Zapier, Make, and native platform workflows. Branching, transformation between systems, and idempotency so a retry cannot duplicate a record.

**API and webhook integration** `[P]`
Auth, pagination, batching, rate limiting, and retries. Payloads inspected against real data before any node is trusted.

**Capture-first staging** `[P]`
The record is written before any external service runs, so a provider timeout pauses the record rather than losing it.

**State-machine gating** `[P]`
Each stage writes completion status and the next stage gates on the prior one, so a failure holds at that stage instead of corrupting everything downstream.

**Failure instrumentation** `[P]`
Run-level logging on cost, latency, and validation status. Hard failures throw and get caught on error output. Soft failures return a 200 with garbage and get caught by validating the response against what a correct one looks like.

---

## Enrichment and list building

**Counted market building** `[P]`
Named companies rather than an estimate off a slide, then compared against the CRM to produce two numbers. How much of the market has never been touched, and how many worked accounts fall outside it.

**Multi-stage enrichment pipelines** `[P]`
Staged tables so cheap qualification runs before expensive lookups, run conditions gating each stage, and waterfall provider ordering by real coverage data rather than by vendor preference.

**Cost discipline in enrichment** `[P]`
Providers charge on the attempt rather than the hit, so a stale list costs more than the row count suggests. Filtering before enrichment is a budget line.

**Email verification** `[P]`
Three states rather than two. Valid, catch-all, and bounced, because uncertainty needs its own handling rather than being rounded to one side.

**Technographic and signal detection** `[P]`
CRM presence, hiring signals, job-change tracking, and ATS endpoint reading across Greenhouse, Lever, and Ashby.

---

## Sending infrastructure and deliverability

Not sold as a service. Listed because a company with twelve sellers considering outbound is usually afraid of burning their domain, and nobody explains this to them.

**Authentication** `[F]`
SPF, DKIM, and DMARC as DNS records proving identity. Not the same thing as SSL, which is the most common confusion.

**Domain and mailbox architecture** `[F]`
Secondary domains rather than the primary, separation of transactional and marketing streams, and shared against dedicated IP tradeoffs.

**Warmup** `[F]`
Volume ramped to engaged recipients first, reputation built per provider rather than globally.

**List hygiene for sending** `[F]`
Hard against soft bounces, complaint rate thresholds, spam traps, engagement weighting, and sunsetting.

**The debugging chain** `[F]`
Authentication, then a new sending source, then reputation and volume spikes, then list and engagement, then content last. Content is where most people start and it is almost never the cause.

---

## AI in production

**Where a model earns its place** `[P]`
Classifying free text into fields that can be grouped, and reading unstructured sources to answer questions no data provider has a field for. Never writing to a CRM field without a check in front of it, and never as a substitute for a rule.

**Retrieval-augmented generation** `[P]`
Chunking strategy, because a single large chunk smears the embedding. Query-time diversification, boilerplate stripped before embedding, and a relative score floor rather than an absolute one.

**Output validation** `[P]`
Schema-constrained output, then validation against what a correct response looks like, because a malformed response usually arrives as a successful one.

**Judge-model QA** `[P]`
A different model family scoring output against source, chosen specifically to avoid a model grading its own work. Publication gated on a measured threshold with the remainder routed to a human.

**Governance in practice** `[P]`
Access controls, approved-use guidance, accuracy and compliance validation, and explicit rules on where output needs a human check.

---

## Monitoring

**Scoring model validation** `[C]`
Score distribution compared against what actually converted, tracked over time, with an alert when the separation narrows. Models decay silently because the weights came from deals that closed eighteen months ago.

**Requalification of failed records** `[C]`
Records that failed qualification at entry re-evaluated on a schedule against current criteria, because most scoring runs once and never looks back.

**Account activity signals** `[C]`
Deterministic criteria evaluated on a schedule. Criteria are rules, so they stay as code rather than becoming a model deciding what counts.

**Attribution chain integrity** `[P]`
The share of closed deals with an intact chain back to first touch, monitored rather than fixed once, because the chain breaks on every form redesign.

**Competitor and market monitoring** `[P]`
Sources monitored, deduplicated into a searchable library via vector search, and matched to accounts. Earns its place when it changes what gets said to a specific account rather than producing a weekly digest.

---

## What is deliberately not here

**Demand generation strategy and channel economics.** Media mix, blended against paid CAC, and the strategist's side of the function. Adjacent, and not what this practice does.

**CPQ.** Configure, price, quote. No exposure.

**Territory and quota design.** Pipeline velocity as a concept is here. Running a forecast as an operational discipline is not.

**Enterprise CRM administration at scale.** Validation rules, complex permission models, and governance of large instances.

Naming these matters more than it costs. A page that claims everything is the page nobody believes.
