# Marketing ops sequence, site copy

Written for `/work`, as a section after the four situations and before the close. Not a new page and not a new package.

The site currently reads sales-side throughout. Six marketing operations groups in `capabilities.md` appear nowhere on it. This closes that, and it does it by making the three month minimum concrete rather than by adding a product.

---

## The copy

**Label:** Sequence

**Headline:** Why the order matters

The first month is the record. Whether a deal has an owner, whether a stage means the same thing to two people, whether a lost reason can be grouped, whether the fields that answer next quarter's question exist yet.

None of that is interesting on its own. It is the thing everything else sits on.

The second month is the reporting, once there is enough closed history to report on. Cycle length computed against every opportunity created rather than only the ones that closed. Win rate split by whichever populations actually behave differently. Stage conversion and time in stage. Pipeline coverage checked against a real win rate instead of a flat multiple.

That work is only possible after the first month. A report built on a record that does not hold the right fields is a reliable wrong number, which is worse than no number, because people act on it.

The third month is what feeds the pipeline. Whether a campaign parameter survives the click, lands in a hidden field, writes to the record, and is still attached when the deal closes. Whether every form on the site completes its path or quietly fails after showing the visitor a confirmation. Whether there is one way to name a campaign or four. Which audiences are still being sent to and which have not been touched in a year.

This is where most companies want to start, because it is the part that feels like growth. Started here, it produces attribution for a pipeline nobody can measure and campaigns feeding a record nobody trusts.

**That sequence is the whole reason for a three month minimum.** Not a contract preference. Each month is built on the one before it, so a shorter engagement does not produce a partial result. It produces the first layer and nothing standing on it.

---

## Where each capability actually lands

Not on the page. This is the internal mapping so the copy above is backed by something.

**Month one, the record.** CRM architecture and field structure. Lead routing with fallback handling. Lifecycle stage design and the definitions behind it. Stranded record recovery. Removal of fields, steps, and reports that improve no decision.

**Month two, the reporting.** Report building and datasets. Dashboard design by audience. Funnel metrics. Separate benchmarks for externally timed deals.

**Month three, the inputs.** Attribution and the tracking chain. Campaign operations and UTM governance. Form and conversion path instrumentation. Audience and list hygiene.

**Not in the sequence.** Deliverability and sending infrastructure stays off the site. It is five `[F]` lines in the capability doc, meaning fresh knowledge rather than built work, and it pulls the positioning toward cold email agency. It stays as something to debug when it comes up.

Competitor monitoring also stays off. It is the offer most likely to become a report nobody reads, and it belongs in a retainer conversation rather than on a page.

---

## What this fixes

**The site stops reading sales-only.** A marketing operations reader currently lands on four situations about pipeline and sees nothing about attribution, forms, or campaign structure. Four of the six missing groups now appear.

**The three month minimum gets a concrete reason.** The lag rule is true and abstract. This is a sequence a reader can follow, and it makes the minimum obviously necessary rather than a policy with a rationale attached.

**No tier language required.** The site does not publish tiers and the retainer prices came out of the assistant. This says nothing about what is included at what price. It says what order the work happens in, which is true at every tier.

---

## As shipped

**Placement.** A standalone section on `/work`, after the four situations and before the close. It sits outside the `stages` array, because it has none of the five-part spine every situation runs and a fifth entry would contradict both the headline and the jump nav, which promise four. It is written as inline JSX rather than through the shared part component, whose paragraphs are plain strings and would have dropped the bold on the closing line. It carries an id so it can be linked and is deliberately absent from the nav.

**The win rate contradiction, resolved.** Situation one rules out win rate analysis at twenty closed deals, and the month two paragraph described that work. The fix was a history clause on the month two opener, which scopes the whole paragraph rather than the one sentence that collided. The alternative considered was a line acknowledging that a situation one company stops after month one. That was rejected because it argues against the three month minimum inside the section that exists to justify it.

**The segment collision, resolved.** "Which segments are live" used a word the site had already committed to a different meaning. Segment appears in six places and always means an analysis dimension or a CRM field, never a marketing audience. Renaming to audiences leaves that single existing meaning intact across all six. It also stops the sentence from restating the contact decay check already published in situation two.

**Word count.** The section runs 312 words. `/work` now renders 2,815 against 2,503 before, both measured from rendered output rather than counted from source.
