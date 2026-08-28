# Purview Ops — Copy Pass

Two things. CTA changes on the home page, then every place the copy assumes a venture backed SaaS reader.

All edits are find and replace on existing text. Nothing new gets written.

---

# Part 1. Home page CTAs

Four "Start with the audit" buttons on one page, now that four other pages exist.

**Keep as audit CTA:**
- Header
- Hero
- Close

**Change these two:**

| Section | Current | Becomes | Points at |
|---|---|---|---|
| Audit section button | Start with the audit | See what we check | `/audit` |
| Boundary section | *(no button)* | How the diagnosis works | `/method` |

The boundary section currently has no button at all. Add one. "How the diagnosis works" is the natural next question after reading how you work, and it gives that section somewhere to go.

Result is three audit CTAs down from four, plus one link to `/method`. The stage cards already point at `/work`.

**Note for `cta.ts`.** `CTA_LABEL` and `CTA_HREF` still govern the three audit buttons. The two new links are their own labels and destinations, not overrides of the constant.

---

# Part 2. Venture assuming language

The second stage assumes the reader raised money. A climate hardware company that grew on revenue or project financing reads it and concludes the page is not about them.

The underlying failure is the same either way. Numbers everyone repeats cannot be reproduced from the system. Only the framing needs to change.

## Home page

**Stage card heading:**
> ~~You raised on numbers you can't reproduce~~
> **Your funnel math lives in a spreadsheet**

**Stage card body:**
> ~~The funnel math in the deck came from a spreadsheet someone built once. You have a real team now and nobody can rebuild it from the system. Meanwhile a lot of inbound never gets a first touch, because routing was never anyone's job.~~
> **The numbers everyone quotes came from a spreadsheet someone built once. You have a real team now and nobody can rebuild them from the system. Meanwhile a lot of inbound never gets a first touch, because routing was never anyone's job.**

## /work

**Anchor:** `#post-raise` becomes `#unreproducible`

Update in three places. The anchor on the section, the jump nav, and the four home page stage card links.

**Section 2 heading:**
> ~~You raised on numbers you cannot reproduce~~
> **Your funnel math lives in a spreadsheet**

**Section 2, what it is costing you, second paragraph:**
> ~~Then there is the second number. The funnel math you raised on came from a spreadsheet built once. Your next round gets measured against it, at a volume where it should now be computable from the system. Right now it is not.~~
> **Then there is the second number. The funnel math everyone quotes came from a spreadsheet built once. Every plan you make gets measured against it, at a volume where it should now be computable from the system. Right now it is not.**

**Section 2, why it happens, second paragraph:**
> ~~The funnel math is the same shape. At the raise those numbers were assertions supported by anecdote, which was correct at the time. Nothing about raising required them to be measurable, only credible. So the instrumentation that would make them checkable never got built.~~
> **The funnel math is the same shape. Early on those numbers were assertions supported by anecdote, which was correct at the time. Nothing required them to be measurable, only credible. So the instrumentation that would make them checkable never got built.**

**Section 2, what changes, third paragraph:**
> ~~A funnel that reconciles. Which is the thing your next raise depends on and cannot be assembled retroactively, because stage timestamps only exist if the system was recording at the time.~~
> **A funnel that reconciles. That one cannot be assembled retroactively, because stage timestamps only exist if the system was recording at the time.**

**Section 1, what changes, first paragraph:**
> ~~The market number stops being a guess. You get a count you can put in front of an investor and defend.~~
> **The market number stops being a guess. You get a count you can defend to anyone who asks.**

**Section 3, what it is costing you, second paragraph:**
> ~~...and everybody quotes it anyway, including in the board update.~~
> **...and everybody quotes it anyway, including in the numbers that go upstairs.**

**Section 3, what changes, third paragraph:**
> ~~And a number in the board deck that traces to something.~~
> **And a headline number that traces back to something.**

**Section 4, why it happens, second paragraph:**
> ~~If expansion ARR and new ARR are not separated in the system, then expansion share of growth, decomposed NRR, and expansion velocity are all uncomputable.~~
> **If expansion revenue and new business revenue are not separated in the system, then expansion share of growth, retention decomposed by its parts, and expansion velocity are all uncomputable.**

ARR and NRR are recurring revenue terms. A company selling equipment or projects does not use them, and a page that does reads as written for somebody else.

## /about

**Who this is for, second item:**
> ~~**First revenue hires landed, and the numbers behind the raise cannot be reproduced.** The funnel math came from a spreadsheet built once.~~
> **First revenue hires landed, and nobody can reproduce the numbers everyone quotes.** The funnel math came from a spreadsheet built once.

## /method

**Section 1, last paragraph:**
> ~~A six month gap between the two numbers changes hiring plans, cash forecasts, and what you tell a board.~~
> **A six month gap between the two numbers changes hiring plans, cash forecasts, and what you tell anyone who asks how the business is doing.**

## /audit

No changes. That page has no venture assuming language.

---

# Part 3. What is not being changed, and why

**"Deals" and "pipeline"** stay. Both are used across hardware, project, and software sales.

**"Win rate," "cycle length," "coverage"** stay. Same reason.

**"Segment" and "ICP"** stay. Both are general.

**"Retention" and "expansion"** stay, but "NRR" and "ARR" are out per the /work edit above. The concepts translate, the acronyms do not.

**Named funding stages** do not appear in any buyer facing copy and should stay out. They are internal routing logic only.

---

# Part 4. Still open, for a later pass

Not part of this change. Recording so it does not get lost.

**The whole voice needs work.** Every page reads more like an essay than like someone who does the work. `/method` was written flatter on purpose as a test. If it reads better than `/audit`, the rest gets rewritten to match it.

**Nothing has been checked against a real buyer.** All of this copy is written from a read of what climate companies need, not from talking to one. That is the gap that closes it.
