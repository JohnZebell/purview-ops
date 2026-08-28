# Purview Ops — /audit

The full offer page. This is where someone arriving from a recorded walkthrough lands, so it carries the whole thing without assuming they saw the home page.

Same left anchored layout. Form sits at the bottom of this page rather than on a separate route.

---

## Hero

**Headline:** The RevOps Audit

**Sub:** Two weeks. We tell you where your revenue is leaking and what each leak is worth.

**Price bar (mono, rules above and below):**
`Two weeks` · `$1,000` · `Credited against your first month`

---

## What happens

**Label:** How it runs

**Three step strip, mono numerals:**

**01** You fill in a short intake doc. Where you think it is leaking, in your words. Send it to whoever on your team has an opinion, because the places they disagree are usually the interesting part.

**02** Read only access to your CRM and whatever else holds revenue data. We run the checks against your real numbers, not a benchmark.

**03** A findings document. Every leak with a number on it, ordered by what to fix first.

---

## Why we start here

**Label:** The premise

Most companies are running three versions of the same revenue engine.

The one leadership thinks they built. The one written down in playbooks and CRM fields. And the one your team actually uses to get work done, which usually involves a spreadsheet somebody maintains by hand and a few things that only work because a specific person remembers to do them.

Nobody is hiding anything. The three drifted apart one small decision at a time, and no single decision was wrong.

The gap between those three is where most of what we find lives.

---

## What we check

**Label:** The checks

Each of these produces a number. If you can already answer one, that is good news and we move on.

**Your actual market size, counted rather than estimated.**
Most companies have a market number that came off a slide someone made two years ago. Your market is countable. There are a specific number of companies that fit what you sell and they can be named. We build the list and give you the count, plus the accounts in it.

**Whether your ICP describes who you have actually won.**
There is the customer you meant to sell to and the customer who keeps signing. When those diverge, marketing is spending against the first one while sales is closing the second. That gap is expensive and almost nobody checks it.

**How many inbound leads got contacted at all, and how fast.**
Not average response time. The percentage that received any first touch, plus the median and the slowest tenth. You paid to generate every one of those records.

**Records sitting with no owner, or an owner who left.**
Deals assigned to someone who is no longer at the company do not surface in anyone's pipeline review. Neither do leads that never got assigned to anyone. Both are quietly sitting there.

**Your real sales cycle, counting deals that stalled.**
The number most companies quote counts only deals that finished. Anything stuck gets excluded, so the number gets faster every time something stalls. We compute it against every deal you opened, carrying open ones at time elapsed. The two numbers are usually not close.

**Whether your win rate holds up when you split it by segment.**
A blended win rate across a utility deal and a corporate deal describes neither of them. Sometimes the blend moves the right way for the wrong reason, which is why nobody quite trusts it. Being unable to produce the split is itself a finding.

**How much of your team's week goes to fixing things that should have worked.**
Re-entering data that arrived wrong. Rebuilding a report because the numbers looked off. Rescuing a deal that went quiet because nobody was watching. This is work that exists only because something upstream failed, and it is the most expensive thing on this list because nobody has ever counted it.

---

## What you get

**Label:** The deliverable

A findings document. Each leak stated plainly, with a count and a dollar figure, sorted into four groups.

**Stop the bleeding.** Things actively losing money right now. Broken routing, missing ownership, alerts nobody set up.

**Take things out.** Fields, steps, approvals, and reports that do not improve any decision. Complexity compounds and every one of these is something your team maintains forever.

**Agree on what things mean.** The definitions, stage criteria, and handoff standards that make good work repeatable instead of dependent on who did it.

**Then automate.** Only after the three above. Automating a process nobody understands produces a faster version of the same problem.

The order matters more than the list. Most of the value is knowing what not to do yet.

**It is yours either way.** If you never talk to us again, hand it to whoever fixes it. No part of it is written to be unusable without us.

---

## What this is not

**Label:** Boundaries

We do not need a discovery call before the intake doc. You fill in the doc, we ask follow ups in writing if we have any.

We do not need access to anything we cannot read only.

We are not going to tell you your team is bad at their jobs. The things we find are almost always work that belonged to nobody, not work somebody did wrong.

And we do not stay after unless you want us to. The audit is a fixed piece of work with a fixed price and an end.

---

## The form

**Label:** Start

**Headline:** Tell us where you think it is leaking

**Sub:** Six questions. Two minutes. We will come back with what access we need.

### Fields

| Field | Type | Required | Placeholder or help |
|---|---|---|---|
| Work email | email | Yes | |
| Company website | url | Yes | Prefill from the email domain |
| What you sell, in one line | text | Yes | "Grid monitoring software for utilities" |
| Who buys it | select | Yes | See options below |
| Roughly how many customers | select | Yes | An estimate is fine |
| What CRM are you on | select | Yes | |
| One number about your revenue you wish you could trust | textarea | No | Optional, and the most useful thing on this form |

**Who buys it:**
Developers and IPPs · Utilities and public power · Municipalities and government · Corporate sustainability or facilities teams · EPCs and installers · Other businesses · Not sure

**Roughly how many customers:**
Under 10 · 10 to 40 · 40 to 150 · 150+

**What CRM are you on:**
HubSpot · Salesforce · Spreadsheets · Something else · Not sure

### Success state

Do not render anything computed back to the screen.

> **Got it.**
> We will come back within two business days with the access we need and a start date. Nothing else is required from you until then.

### Failure state

> Something went wrong on our end and your answers did not save. Email hello@purviewops.com and we will pick it up from there.

Never fail silently on the visitor's side either.

---

## Build notes for Claude Code

**Form posts to a webhook.** Point it at a local stub and keep the real URL as one exported constant, same pattern as `cta.ts`. Swapping it later should be one line.

**Field names must match the HubSpot schema** in `purview_system_scope.md` section 3, so the mapping is one to one when the pipeline gets wired. Use these exact keys:

```
email
website
what_they_sell
buyer_type
customer_band
crm
untrusted_number
source_page
```

Select values are the snake_case forms from the scope doc, not the display labels.

**Client side validation on email format and required fields only.** Nothing else blocks submission.

**No captcha, no honeypot, no reCAPTCHA script.** Volume does not justify it and it costs page weight.

**The header CTA and every "Start with the audit" button now points at `/audit`** rather than `/#audit`. The home page audit section keeps its anchor but its button should go to this page.
