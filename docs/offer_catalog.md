# Offer Catalog

Ten productized go-to-market offers, assessed against what Purview already sells and against the two prospect pools that exist.

The pools matter because the same offer works in one and fails in the other.

**Pool A. The 24 qualified companies.** US, 20 to 250 employees, three or more selling, selling into utilities, municipalities, developers, and EPCs. Their buyer is a procurement officer or a facilities director. That buyer is not engaging with competitor content on LinkedIn.

**Pool B. The 229 confirmed climate companies.** Venture-backed, YC and Series A through C, mostly software or hardware with a commercial buyer. That buyer is on LinkedIn and does attend events.

An offer that fails in pool A can be the right offer in pool B.

---

## Tier one, build these

### Event attendee and exhibitor targeting

**What it is.** Identify which events a client's buyers attend, source the attendee and exhibitor list, enrich and qualify against their ICP, and run follow-up referencing the event.

**Why it is first for this market.** In energy and environmental infrastructure, a trade show is how the market meets. The buyers are not reachable through normal digital channels, so a booth is not a marketing line item, it is the pipeline. A company spending thirty thousand dollars on a booth knows this.

**Fit.** Strong in both pools, and stronger in pool A than the general advice suggests, because there is no substitute channel there.

**What has to be built.** Attendee sourcing is solved. Exhibitor pages, asking the event sales team for a sample list under an exhibitor inquiry, or a paid list service at roughly $300 per event.

The real build is event discovery. Which events matter for a given client and region. Three sources, in order of value.

1. Ask the client. They already know their five events. This is an intake question, not a system.
2. Watch their people. Four employees posting about attending the same thing names the event.
3. Association calendars, which map cleanly to buyer type.

**The reusable asset.** Events map to buyer type, not to client. WEFTEC is water utilities and municipalities. DistribuTECH is electric utilities. RE+ is developers and IPPs. Build one event-to-buyer-type table by hand and every client inherits it from their classification.

**Pricing signal from the market.** Around $2,500 for three or four events.

---

### Job change monitoring across CRM contacts

**What it is.** Back up the client's CRM contacts, enrich to detect who has left, and trigger outreach to the mover at their new company while flagging the vacancy at the old one.

**Why it fits Purview specifically.** This is revenue operations, not lead generation. A CRM full of people who left is stale data, which is the same class of problem as audit check 4. It also produces a second finding for free, which is how much of their database has decayed.

**Why it matters more in this market.** A utility relationship built over four years dies when the person moves. Long cycles mean contact decay does more damage here than in a market with a ninety day cycle.

**Fit.** Strong in both pools. Requires a CRM, which is already the qualifier.

**What has to be built.** Contact export, enrichment against current employer, diff against stored employer, and a write path back. The write path is where care is needed, because writing to a CRM field without a check in front of it is the thing the stack section explicitly says never to do.

---

### CRM hygiene as an entry offer

**What it is.** Validate email addresses, find missing LinkedIn profiles, flag contacts whose role has changed. Cheap, fast, requires CRM access.

**Why it is here.** Purview already has the stronger version of this, which is the audit. Worth noting only because the mechanic is instructive. A small diagnostic that requires access creates the conversation for the larger engagement.

**Fit.** Redundant with the audit. Do not sell separately. The one piece worth taking is email validation as a line item inside the audit when the client's list quality is the visible problem.

---

## Tier two, pool B only

### Competitor engagement monitoring

**What it is.** Monitor engagement on competitors' LinkedIn content. Capture people who comment or reply with a stated need. Qualify against ICP and reach out.

**The framing that matters.** This is intent monitoring, not follower scraping. The distinction is real. Someone commenting "we have exactly this problem" on a competitor's post has stated a need in public. Someone who merely follows a company page has not.

Sell the first. The second is a list.

**Fit.** Pool B only. Pool A buyers are not in these threads.

**What has to be built.** A social listening source, ongoing rather than one-time, plus a qualification pass and a do-not-contact check.

---

### Website visitor identification

**What it is.** A pixel identifies anonymous visitors. Enrich, qualify, and either notify the sales team or run automated follow-up.

**The two hard constraints.** It needs roughly a thousand monthly visitors to be worth anything, and it is US-only for legal reasons.

**Fit.** Unknown until tested. Intent quality is high, because a procurement officer researching vendors does visit the site. Volume is the question. Check monthly traffic per company before pitching it, because most 50 to 235 person companies will not clear the threshold.

**What has to be built.** Nothing complex. Pixel, webhook, enrichment, routing. The work is qualifying which clients it can work for.

---

### Cold outbound to a counted TAM

**What it is.** Build the list, enrich, personalize, send.

**Why it is low on this list.** It is the most saturated offer in the category and everyone entering the space sells it. It also positions Purview as a lead generation agency, which is not what the site describes. The closest published statement is that Purview does not run a revenue org, which is adjacent rather than the same argument.

**Where it becomes interesting.** Building outbound for a client means building it against their buyer, which means interconnection queues, PUC filings, or bond records. That is the signal engine, funded by a client, aimed at a real market. Very different from generic outbound.

**Fit.** Take it if a client asks. Do not go find people to sell it to.

---

## Tier three, skip

**Poaching competitor followers.** A follower is not a buyer. Pool A buyers are not following anyone. In pool B it produces volume with weak intent, and the intent version is competitor engagement monitoring above.

**Multi-channel outbound with AI voice and video.** Every freelancer entering the space sells this. High volume required to produce meetings, and it is a tooling setup rather than a system.

**Brick and mortar lead scraping.** Google Maps scraping for local business lists. Genuinely underserved, and completely disconnected from energy and environmental infrastructure. A different business.

---

## What the market's own pricing advice gets wrong for us

The common recommendation is cost-plus. Add up the tool subscriptions and mark up fifty percent.

Run the audit through that and it prices at under a hundred dollars, because the cost is a Postgres query. The audit is priced on the finding, not on the tools.

Cost-plus is a reasonable floor for a first buildout with no track record. It is the wrong model for anything where the value is the analysis.

---

## The one thing to carry across every offer

Any pilot with an agreed success metric has to use leading indicators, not win rate or cycle length.

The standard advice is to agree a success metric for a thirty day pilot, three to five leads or positive replies. In a market with six to eighteen month cycles that is a metric that cannot move in the window.

Use the list already written into the method page. Opportunity creation rate, qualification pass rate, first touch percentage, time to first touch, stage entry counts.

Agreeing to anything else means being judged on a number that could not have moved, which is exactly the failure the lag rule exists to prevent.

---

## Site implications

None of these belong on the site as a menu. The site sells one thing, an audit that leads to a retainer, and the four situations describe what gets built.

Where they fit is inside `/work`, as things that get built during an engagement when the audit says so. Event targeting and job change monitoring both fit under the existing situations without adding a new page.

The one that would need new language is event targeting, because nothing currently on the site says Purview does anything with events. Worth adding one line rather than a section.

---

## Tier one, continued. The monitoring layer

Six ideas that are the same idea. Something changes state, a check catches it, a human is told before it costs anything.

This is what a retainer actually contains. The site does not currently describe monthly deliverables at all, so if these ship, that language has to be written rather than edited.

**Every one of them requires history.** Situation one says explicitly that win rate analysis, forecasting, and scoring models are not included, because twenty closed deals cannot support any of them. That holds here.

What it does not mean is that monitoring belongs only to situations three and four. The site already places a signal layer in situation four and a contact-decay check in situation two. The real rule is that a monitor needs enough history to measure against, which rules out situation one and nothing else.

---

### Lead scoring validator

**What it is.** A scheduled check that compares the score distribution against what actually converted, tracked over time, and alerts when the separation between high and low scores narrows past a threshold.

**Why it is the strongest of the six.** Scoring models are built once from closed-won data and then decay silently. The weights came from deals that closed eighteen months ago, the market moved, and the model keeps producing scores that look completely normal and no longer separate anything. Nobody is watching for it because there is no error to watch for.

This is the same class of problem as a survivorship-biased velocity query. The number is not missing, it is wrong and confident.

**Fit.** Requires a scoring model that already exists and enough closed volume to measure separation. Situation three and four.

**Why nobody can wave it off.** A company can say they already have scoring. Almost none can say they know whether it still works.

---

### Non-qualified to qualified watchdog

**What it is.** Re-evaluation of records that failed qualification at entry, on a schedule, against current criteria.

**The gap it fills.** Most scoring runs once when the record is created and never again. A lead that was a student in March and a buyer in November keeps its March score forever. Nothing surfaces the change because nothing looks back.

**Why it belongs next to check 4.** Stranded records with a different cause. Check 4 finds records with no owner or a departed one. This finds records whose qualification is stale. Both are recoverable inventory the company already paid to acquire.

---

### Account activity monitoring

**What it is.** Deterministic criteria evaluated on a schedule against account behavior, surfacing accounts that crossed a line rather than scoring everything continuously.

**Where it already appears.** Situation four names a signal layer on deterministic criteria evaluated on a schedule. This is that, described as a thing rather than a phase.

**The design constraint.** Criteria are rules, so they are code. The moment this becomes a model deciding what counts as activity, it stops being auditable and starts being another number nobody trusts.

---

### Attribution chain integrity check

**What it is.** A check that the tracking chain survives end to end. A UTM has to survive the click, land in a hidden field, write to the lead record, and still be attached when the deal closes.

**Why it is a monitor and not a one-time fix.** The chain breaks on a form redesign, a new landing page, a campaign someone built without the hidden fields. It breaks quietly and the first symptom is a quarter of reporting that cannot be tied to spend.

**What it produces.** The share of closed deals with an intact chain back to first touch. That number is checkable, it moves, and it is the honest answer to why revenue cannot be attributed.

---

### Competitor and market monitoring

**What it is.** Monitoring competitor content and newsletter output, distilled into a searchable library, matched to accounts.

**Status.** Already built. n8n, Apollo, Claude, and vector search across 200-plus sources, deduplicated into a strategy library. This is packaging existing work rather than new capability.

**The caution.** This is the one on the list most likely to become a report nobody reads. It earns its place only when the output changes what someone says to a specific account, not when it produces a weekly digest.

---

### Website visitor identification

Covered in tier two above. Needs roughly a thousand monthly visitors and it is US-only, so the eligibility check comes before the pitch. Two hundred dollars a month minimum and it goes on the client's card.

---

## What the monitoring layer changes about the retainer

The site says almost nothing about what a retainer produces month to month. It says the audit continues as a monthly retainer if the findings warrant it, and stops there.

Monitoring is the answer to that gap. It is the thing that recurs, which is what makes a recurring fee make sense.

It could also give the tiers a real difference, since the tier names and day counts live in positioning notes and are not published. Foundation as diagnosis and repair, Operator and Embedded as diagnosis, repair, and the checks that keep it from happening again, is a cleaner line than days per month. That is a decision to make, not something the site already says.

**The access question is resolved.** The site scopes read-only to the audit and describes write access during a retainer as something the client asks for, bounded by the check-in-front-of-it rule. Job change monitoring is sellable on that basis. Website visitor identification needs a pixel the client installs, which is consistent with we recommend and you execute rather than requiring a promise change.

**The thing to hold to.** Every monitor has to produce a number and an action. A monitor that produces an observation is a newsletter, and the site already argues that a busy team is not necessarily a productive one. The same applies to a report nobody acts on.

---

## Pilot to commercial

The most market-specific offer in this catalog, and the one nothing else here overlaps.

Every company selling into utilities, municipalities, and districts runs pilots. Almost none of them structure the exit. The pilot goes fine, everyone agrees it went fine, and then nothing happens. Or it converts into a second pilot. Or the champion moves and the whole thing restarts with someone who was not in the room.

The site already names the first half of this. Situation one says pilot success criteria named by the customer before the pilot starts. This is the rest of it.

### Why pilots stall

Six causes, and only the last one is about the product.

**No criteria, so success is a matter of opinion.** Both sides agree it went well and disagree about what that obligates.

**Criteria written by the vendor.** The customer never agreed those were the things that mattered, so hitting them proves nothing to the person holding the budget.

**No instrumentation.** Criteria exist and nobody captured the data to prove they were met. Six months later the argument is about whose numbers to believe.

**No named consequence.** Criteria are met, and what happens next is a meeting.

**No budget path started.** The pilot came out of a discretionary line. The deployment needs a capital line, a different approval, and often a different fiscal year. Nobody started that process during the pilot, so the clock restarts at the end.

**The pilot has no end date.** It continues because nothing forces a decision.

### What gets built

**Criteria named by the customer, in their words, before anything starts.** Ask what would have to be true at the end for them to expand this. Write it down as they said it.

**A measurable definition and a data source for each one.** "Reliable" is not a criterion. Uptime above a stated number, measured from a named system, is.

**Instrumentation that captures it during the pilot rather than after.** This is the part that requires actual building, and it is why this is an operations engagement rather than a sales process.

**Pilot as a real stage in the CRM,** with entry criteria, exit criteria, a defined end date, and a benchmark computed separately from every other deal. A pilot sitting in a generic stage is invisible to the forecast and reads as a stalled deal.

**The budget path opened in parallel.** Who approves a deployment, out of which line, on what cycle, and what has to happen before that cycle to be in it. That is `/timing` applied to an account already inside the building.

**A named commercial consequence.** What the customer commits to if the criteria are met. This is where a client's counsel writes the obligation. Purview builds the criteria, the measurement, and the trigger. Nobody here drafts contract language and saying otherwise would be selling something that cannot be delivered.

### What it produces

Pilot to deployment conversion rate, which most of these companies cannot compute.

Median time in pilot, benchmarked separately from the rest of the pipeline.

The share of active pilots with documented criteria, which is usually the first uncomfortable number.

### Fit

Requires enough pilot volume to have a rate at all, so situations two, three, and four. Not situation one, where the whole point is that history has not been recorded yet.

Strongest where the buyer is institutional. A pilot with a utility or a district is a formal thing with a budget cycle behind it. A commercial pilot is often just a trial and the structure matters less.

---

## The message matrix

A testing structure for outbound, built so the winner is traceable to closed revenue rather than to a reply rate.

### The problem it solves

Most companies send one message to everyone. Not because nobody knows better, but because building a testing structure is somebody's job and at 45 sellers per ops person that somebody does not exist.

So a message either works or it does not, and nobody can say why. When it stops working nobody knows which part stopped.

### The structure

Three ICPs. Three value propositions each. Nine cells.

An ICP is a population that buys for a different reason, not a firmographic slice. A utility and a corporate facilities team are two ICPs. Two utilities of different sizes are one.

A value proposition is one claim about what changes for them. Not a feature and not a tone. Three per ICP, each testing a different reason to care.

**Only one variable moves per cell.** Same structure, same length, same call to action. If the subject line and the claim and the length all change, a difference in reply rate says nothing about which one caused it.

### What makes this an operations build rather than a campaign

The standard version of this tests reply rate inside a sending tool and stops there. Reply rate tells you what gets read. It does not tell you what closes, and those are frequently different cells.

The operations version instruments it end to end.

**An ICP field on the account record,** populated and maintained, so pipeline can be split by it later.

**The cell written onto the record at first touch,** meaning which ICP and which value proposition, and carried through conversion so it survives to the deal.

**Reply, meeting, opportunity, and closed won tracked per cell,** not just reply.

**Minimum volume before reading the result.** A cell with twelve sends and one reply is noise. State the threshold before the test starts, because a threshold set after the fact is chosen to make the answer come out.

Without those four, this is a campaign. With them it is a repeatable test that answers a question the company can act on.

### What it produces

The cell that converts differently, and the size of the difference.

Reply rate by cell, and close rate by cell, which usually disagree. That disagreement is the finding. A message that gets a lot of replies from people who never buy is worse than a quiet one that closes, and only the instrumented version can see that.

An ICP field that did not exist before, which every other analysis then gets to use.

### Fit

Requires enough volume to fill nine cells at whatever threshold gets set. Below that, run three cells rather than nine, testing value proposition on one ICP.

Situation two and three. Not situation one, where there is not enough history to know what the ICPs are, and where the countable-market work comes first.

### The boundary

Purview builds the structure, the instrumentation, and the read. The client writes the messages and runs the sending.

That line matters. Writing the copy makes this a lead generation service, which is the thing the offer catalog already says not to become. Building the structure that tells them which copy works is operations.

### Currency

Close rate by cell, and the gap between the best and worst cell. Reply rate is reported alongside it and never on its own.

---

## The relationship graph

One table, built from data the client already owns, that answers three different questions.

### What it is

Every person on a revenue team can export their own LinkedIn connections. It is a supported download in account settings and it returns name, current company, position, and the date the connection was made. No scraping, no automation against LinkedIn, no terms problem.

Load those exports into one table keyed on company. Now the company knows, for the first time, who its people actually know.

Most companies have never assembled this. The information exists across thirty individual accounts and nowhere in the business.

### Read one, routing

A lead arrives from a company where somebody on the team already has a connection. Route it to that person rather than by territory or round robin.

This is the routing build with a better input. The rule stays deterministic, and the fallback chain still handles no match, unavailable, duplicate, and existing ownership.

**Currency.** Conversion rate on routed-with-coverage against routed-without, measured after enough volume to compare.

### Read two, coverage gaps

Take the target account list. Check which of those accounts somebody already has a connection inside. The ones with coverage that nobody is working are the finding.

That is the countable market work pointed inward. A named list of accounts where a warm path exists and is going unused.

**Currency.** Count of covered accounts with no open opportunity, and the pipeline value of the ones that convert.

### Read three, sourcing

Run it backwards. Start from the connections, look at where those people work now, and qualify those companies against the ICP.

This surfaces companies that were never on the target list. A thirty person team carries thousands of first degree connections across hundreds of companies, and some of those fit the profile and nobody knew.

**The thing to get right.** A former colleague, a college friend, or someone met at a conference eight years ago is not noise. That is the whole point. A warm path into a company that fits is worth more than a cold path into a better-scored one.

What actually filters out is recruiters, vendors selling to them, and their own current and former coworkers. Those are identifiable by title and company and they come out in one pass.

**Currency.** Qualified companies surfaced that were not on the list, and how many of those convert compared to sourced accounts.

### What has to be built

A coverage table keyed on company and rep, holding a hashed profile identifier and the connection date. No names, no titles.

Company name normalization. LinkedIn exports carry whatever the person typed, so the same company appears four ways and none of them match the CRM.

The ICP qualification pass, which is the same enrichment run on any sourced list.

A refresh cadence and a field recording when each rep last uploaded. Connection exports go stale immediately, and routing on a relationship from a year ago is worse than not routing on it.

### The data model, and why it is also the consent answer

**Names are never stored.** The upload is processed, the company is extracted, and the person is discarded. What persists is that a rep has coverage at a company, plus a hash of the profile URL so the row can be refreshed later. No name, no title, no notes.

That is a better build regardless of privacy, because company to rep is all routing needs. It also removes most of the objection before it gets raised. A rep is uploading a file that produces a company list, not handing over their contacts.

**The hash exists because employers change.** Capture the company once and discard the person, and every job change silently breaks a link. The rep still shows coverage at a company where they now know nobody, and there is no way to detect it. A stable identifier means the company can be re-derived on refresh while the identity stays unreadable.

The general rule underneath. Deriving a value at capture and discarding the input means you can never recompute it when the input changes.

**A rep can clear their own rows.** One control tied to their login that deletes everything derived from their upload. Not a policy someone has to trust, a button they can press. That also handles departure without a separate process.

**What to say when the objection comes.** The value lands on the rep before it lands on the company. A lead routed to someone who already has a path closes faster and on their number. Say that first, then say the names are never stored.

### The limit worth naming

**Connection strength is unknown.** The export carries a date and nothing else. A connection made last month by someone they work with daily looks identical to one from a conference in 2016. And with names discarded, the system cannot even show who the path runs through.

So the system says a path exists and the rep decides whether it is worth using. They still have their own connection list, so they can look it up themselves. The output is a prompt to a person rather than an automatic assignment.

### What it is not

Not second-degree or mutual-connection mapping. Those only render to a logged-in user viewing a profile, which means automating a session on every rep's account. Thirty reps hitting the same accounts on the same schedule is the exact pattern LinkedIn enforces against, and the consequence lands on the reps rather than on the vendor.

First degree is exportable. Second degree is not. The build stops at the line.

### Fit

Needs a revenue team large enough that coverage varies across people. Under five sellers everyone knows the same accounts and the table tells you nothing.

Situations two, three, and four.
