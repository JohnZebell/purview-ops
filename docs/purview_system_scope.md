# Purview Ops — System Scope

The intake form, the HubSpot instance behind it, and the n8n pipeline that connects them.

This is one build serving three purposes. It is Purview's real lead capture. It is a working demonstration of exactly what Purview sells. And it is production HubSpot and n8n work that can be referenced in an interview.

---

## 1. What this is

The site CTA goes to an intake form. That form is also the audit intake doc, which replaced the ninety minute kickoff session. So a submission both creates a lead and starts the engagement.

### The constraint that shapes everything

HubSpot free tier includes forms, contacts, deals, and custom properties. It does not include workflows, which are Marketing Hub Professional.

So HubSpot is the system of record and n8n is the orchestration layer.

That is the better demo anyway. It shows the ability to build an automation layer rather than click through a workflow builder, which is what the job postings are actually asking about.

### What is out of scope

No Clay dependency. The form does not call Clay, and nothing here needs a Clay seat. Clay is for building the outbound market tables, which is a separate track.

No paid HubSpot tier. If something requires Pro, it goes in n8n instead.

No CMS, no auth, no user accounts.

---

## 2. The form

Three required fields, six optional. Requiring more than a name and an email costs submissions, and everything else here is something the audit establishes anyway.

| Field | Type | Required | Why it exists |
|---|---|---|---|
| First name | text | Yes | So a reply addresses a person rather than a domain |
| Last name | text | Yes | Same, and it maps to a standard HubSpot property |
| Work email | email | Yes | The domain is the key to everything downstream |
| Company website | url | No | Enrichment anchor. Prefill from the email domain |
| What you sell, one line | text | No | Feeds segment classification |
| Who buys it | select | No | Routes to the right diagnostic. Options below |
| Roughly how many customers | select | No | The stage router. Easier to answer than ARR |
| What CRM are you on | select | No | Determines whether the instrumentation findings are even possible |
| One number about your revenue you wish you could trust | textarea | No | The most valuable field on the form. Their words, their problem |

An optional field left blank is omitted from the payload rather than sent as an empty string. Section 1 of `purview_hubspot_setup.md` carries the shape.

### Select options

**Who buys it**
`Developers and IPPs` · `Utilities and public power` · `Municipalities and government` · `Corporate sustainability or facilities teams` · `EPCs and installers` · `Other businesses` · `Not sure`

**Roughly how many customers**
`Under 10` · `10 to 40` · `40 to 150` · `150+`

**What CRM are you on**
`HubSpot` · `Salesforce` · `Spreadsheets` · `Something else` · `Not sure`

Note that `Not sure` on CRM is itself a finding, not a missing value. Do not treat it as null.

### Form behavior

- Client side validation on email format and required fields only. No blocking on anything else.
- Optional fields left blank are omitted from the payload, never sent as empty strings.
- POST to the n8n webhook. Do not post directly to HubSpot.
- On success, show a promise with a clock on it rather than a result. Something like "You will have the findings within two weeks. First thing we send is the access request."
- Do not render anything computed back to the screen. The value goes in the deliverable.
- On failure, tell them plainly and give an email address. Never a silent failure on the user side either.

---

## 3. HubSpot schema

### Standard contact properties used

`email`, `firstname`, `lastname`, `company`, `website`, `jobtitle`, `lifecyclestage`

`company` and `jobtitle` are listed but never written. The form collects neither, and enrichment — which would have supplied `company` — is deferred. See section 4.

`lifecyclestage` does not keep the value we write. The pipeline sets it to `lead` on the contact, and HubSpot then advances it to `opportunity` on its own, asynchronously, once the deal association registers. Both were observed in one run: the write returned `lead`, and a read moments later returned `opportunity`.

This is HubSpot's own lifecycle automation, not something the pipeline does, and it cannot be prevented from the API side. Anything that reads `lifecyclestage` has to know the written value does not survive deal creation — so it is not a field to branch on, filter a list by, or reconcile against. `pv_intake_status` is the field that means what it says.

### Custom contact properties to create

| Internal name | Label | Type | Options |
|---|---|---|---|
| `pv_what_they_sell` | What they sell | Single-line text | |
| `pv_buyer_type` | Buyer type | Dropdown | The seven options above |
| `pv_customer_band` | Customer count band | Dropdown | `under_10`, `10_40`, `40_150`, `150_plus` |
| `pv_crm` | Current CRM | Dropdown | `hubspot`, `salesforce`, `spreadsheets`, `other`, `not_sure` |
| `pv_untrusted_number` | Number they do not trust | Multi-line text | |
| `pv_stage_layer` | Stage assessment | Dropdown | `seed`, `series_a`, `series_b`, `series_c` |
| `pv_intake_status` | Intake status | Dropdown | `received`, `enriched`, `failed_enrich`, `invalid_email`, `duplicate` |
| `pv_source_page` | Source page | Single-line text | |
| `pv_submitted_at` | Submitted at | Date and time | |

`pv_submitted_at` is HubSpot type `datetime`, not `date`. "Date picker" is HubSpot's UI name for `date`, which stores a day with no time; a submission timestamp without time of day loses information that cannot be recovered afterward. The field type is still the date picker widget either way, which is why the two are easy to confuse.

### Custom deal properties

| Internal name | Label | Type |
|---|---|---|
| `pv_audit_stage_layer` | Stage assessment | Dropdown, same options as above |
| `pv_intake_complete` | Intake complete | Single checkbox |
| `pv_access_granted` | CRM access granted | Single checkbox |
| `pv_findings_sent` | Findings sent | Single checkbox |
| `pv_closed_lost_reason` | Closed lost reason | Dropdown, options below |

`pv_closed_lost_reason` is a custom property, deliberately not the standard `closed_lost_reason`. The standard one exists on deals already but is free text, and converting a standard property changes a field other HubSpot tooling and reporting may already read. A custom property leaves it untouched.

### Pipeline

One pipeline, `Audit`, with these stages. Every stage entry must be driven by a defined event, never by dragging a card. This is the instrumentation principle applied to Purview's own instance.

It is the portal's original pipeline, renamed. Free tier allows one deal pipeline and one already existed, so `Audit` is HubSpot's `default` pipeline relabelled with its seven stock stages replaced. The pipeline id is still the literal string `default` — n8n writes that, not `audit`.

| Stage | Entry criteria, checkable |
|---|---|
| Intake received | Form submitted |
| Access requested | Access request sent |
| Access granted | `pv_access_granted` is true |
| Analysis running | Checks started |
| Findings delivered | `pv_findings_sent` is true |
| Retainer started | Closed won |
| No decision | Closed lost, reason required — enforced in n8n, see below |

Stage ids are HubSpot-generated numerics, not slugs: the stages above are `4310639299` through `4310639305` in listed order. n8n sets `dealstage` to those ids. A label will not work, and the ids are portal-specific, so re-read them rather than copying these if the pipeline is ever rebuilt.

### Deal name

The website's hostname, then ` Audit`. A bare domain and a full URL both reduce to the same thing: scheme, path, query and `www.` are stripped and the result is lowercased. `https://Example.com/Solar` and `example.com` both give `example.com Audit`. Falls back to the email domain, then the email itself.

The agreed rule was `{company or domain} Audit` and it did not survive contact with real submissions. `company` is never written — the form does not collect it and enrichment is deferred — so every name fell through to the email domain, and the first three real deals came out as `gmail.com Audit`, `gmail.com Audit` and `gmail.com Audit`. Identical, and identifying nobody.

The website is the closest thing to a company identifier the form actually collects, so it goes first. Two submissions from the same company will now agree, which is the point.

It is not validated or corrected. One of those first three submissions carried `purrviewops.com`, a typo of the person's own domain, and the deal is named after the typo. That is deliberate: the pipeline stores what people typed, and a name that quietly disagrees with the raw payload is worse than an ugly one.

Stage probabilities are placeholders, ascending 0.1 through 0.8 across the five open stages, with the two closed stages fixed by HubSpot at 1.0 and 0.0. HubSpot requires a probability on every deal stage; nothing here reads it. Stages gate on defined events, not on a forecast weight.

Closed lost reason is an enum, not free text. Options: `no_access`, `no_budget`, `timing`, `did_it_themselves`, `hired_internally`, `no_response`, `not_a_fit`.

### Required is not enforced in HubSpot

It cannot be, on this tier. HubSpot has two mechanisms for requiring a property and both are paid: marking it required on the create form needs Starter or above, and conditional stage logic — requiring it on entry to a stage, which is what this pipeline actually wants — needs Professional or above. This instance is free.

So the requirement moves, rather than being dropped. n8n enforces it at write time and refuses to set the No decision stage without a reason. The daily verification job in section 8 of `purview_hubspot_setup.md` flags any closed lost deal carrying a blank `pv_closed_lost_reason`.

That is the same pattern as the rest of the system: the check catches what the platform will not. Worth stating plainly because it is also the thing being sold — an unenforceable field with a check behind it is honest instrumentation, an unenforceable field with nothing behind it is the gap the audit looks for.

### Stage layer derivation

Computed in n8n from `pv_customer_band`, not entered by the person.

| Customer band | Stage layer |
|---|---|
| `under_10` | `seed` |
| `10_40` | `series_a` |
| `40_150` | `series_b` |
| `150_plus` | `series_c` |

---

## 4. The n8n pipeline

### Design rules, non negotiable

**Capture first.** The raw payload is written to storage before any external call runs. If enrichment times out, if HubSpot is down, if the model errors, the submission still exists. This is the pattern from the lead generation engine and it is the thing that makes the build worth showing.

**Status, not deletion.** Nothing gets dropped. A record that fails validation gets a status and an alert. A record with no matching path gets a status and an alert.

**Normalize deliberately, not globally.** Lowercase the email. Trim whitespace on everything. Do not lowercase names, company names, or the free text field. A global lowercase turns John Zebell into john zebell in the CRM.

**Every external call has an error path.** Not a global error workflow, an explicit path per call, because the recovery differs. A failed enrich is recoverable. A failed HubSpot upsert is not.

### Where capture lives

Capture is the Next.js route, `app/api/intake/route.ts`, not n8n. The route writes the raw payload to Supabase and returns a real 500 to the visitor if that write fails, then fires the n8n webhook. n8n never receives a submission that was not already saved.

An earlier draft of this section put the webhook and the raw write both inside n8n. That was written before the route existed, and the route is right: capture is the only step with no second copy, so the person who typed the answers is the last remaining record of them and has to be told when it fails. A webhook that accepts and then fails cannot tell them. Every later step can fail quietly precisely because capture already holds the payload.

So the sequence below starts after the raw write, and step numbers no longer match the node list one for one.

### Node sequence

n8n workflow `Purview Intake — HubSpot`, id `773lJFwVvwVPQhuX`. 21 nodes.

```
    Webhook                  POST /purview-intake, responds immediately
                             body { row_id, payload }, already saved
 1  Normalize                email lowercased and trimmed, everything else
                             trimmed only. Names, company names, the free text
                             and the website keep their casing
 2  Idempotency check        same email in pv_intake_raw inside two minutes,
                             excluding this row
      ├─ none     →  continue
      └─ found    →  set status duplicate_submit, stop. No HubSpot call, no
                     alert. A double click is noise, not a lead event
 3  Validate email format    regex, server side
      ├─ pass     →  continue
      └─ fail     →  set status invalid_email, alert, stop. Record stays
 4  Derive stage layer       map customer band per the table above
 5  Check duplicate          query HubSpot by email
      ├─ new      →  continue
      └─ existing →  update the contact rather than create, set status
                     duplicate, alert, stop. No second deal
 6  Create HubSpot contact   all standard and custom properties
      └─ fail     →  record error_detail, alert, retry with backoff
 7  Create HubSpot deal      pipeline `default`, stage `4310639299`, associated
                             to the contact
      └─ fail     →  record error_detail, alert, retry with backoff
 8  Notify                   company, stage layer, the untrusted-number answer,
                             and the deal url
 9  Write back               hs_contact_id, hs_deal_id, status complete
10  Mark contact complete    pv_intake_status complete, so the row and the
                             contact stay reconcilable
```

Step 4 runs before step 5, where an earlier draft had it after. The duplicate branch at step 5 updates the contact with the full property set, and that set includes `pv_stage_layer`, so the layer has to exist by then. It is pure computation with no external call, so moving it earlier costs nothing.

### Enrichment is deferred, not dropped

Company enrichment from the domain was step 7 of the original sequence. It is not built. It is optional in this section, nothing downstream depends on it, and skipping it kept the first working pipeline smaller.

Two consequences worth holding on to. `company` is left blank on the contact rather than defaulted to the domain: the website field already carries the domain, so filling `company` in would destroy the ability to tell later whether a value was enriched or invented. Blank is honest and stays a usable signal for when enrichment lands. And `failed_enrich` is a live value in `pv_intake_status` that nothing currently writes.

### Failure paths

Every external call has its own error output rather than one global handler, because the recovery differs.

Three failures have distinct recoveries and distinct paths: a double submit sets `duplicate_submit` and stops silently, an invalid email sets `invalid_email` and alerts, a genuine repeat sets `duplicate` and alerts. None of them reach the shared path.

The HubSpot and Supabase write failures share one recorder and one alert, because their recovery is genuinely identical: retries are exhausted, the raw row already exists, a human picks it up. That path writes `error_detail` and deliberately does **not** change `status`, so the row stays visible to the verification job as stalled rather than being quietly marked resolved.

Retries are n8n's `retryOnFail`, three tries at five second intervals. Fixed interval, not exponential — enough for a transient 429 or 503, which is what these actually fail with.

### Zero items ends a branch, silently

This is the failure mode to design against in n8n, and it is worth stating as a rule rather than as a bug that was fixed.

A node that returns no items does not error. The branch simply stops, the execution is still reported as a success, and nothing downstream runs. There is no failed node to look at and no alert, because the alert was downstream too.

It bit this workflow twice in the same build:

- The idempotency check queries Supabase for a recent row with the same email. When there is none — the normal case — PostgREST returns `[]`, which is zero items, so the entire happy path ended at node 2 and reported success. No contact, no deal, no notification, no error.
- Every `PATCH` returned an empty body, so each alert sitting downstream of one would never have fired. The invalid-email alert, the duplicate alert and the write-failure alert were all unreachable.

So: **any node that can legitimately return nothing needs `alwaysOutputData`**, and any `PATCH` that something depends on downstream should also send `Prefer: return=representation` so the response proves the row matched.

Worth recording how this survived. `n8n_validate_workflow` flagged it — *"Consider enabling alwaysOutputData on Recent submit? to capture error responses for debugging"* — on the first validation pass, and it was dismissed as generic advice because it was phrased as a debugging convenience and arrived alongside a dozen other boilerplate suggestions. It was not a debugging convenience. It was the bug, named correctly, and ignored. The validator was right and the reviewer was wrong, which is the more useful half of the lesson.

It was caught only because the test read the result back from Supabase and HubSpot rather than trusting the execution status. The execution said success.

### A node runs once per input item

The other half of the same lesson, and it fails in the opposite direction: instead of a branch going quiet, work silently happens N times.

An n8n node executes once for every item it receives. So in a chain of queries, when one returns four rows, every node below it runs four times and returns its own rows four times over. Nothing errors. The execution is a success. The numbers are just wrong, and wrong in a way that scales with traffic — so it looks fine on a quiet day and worst on a busy one.

The verification job was built as a chain of four queries and hit exactly this. A single stalled row was reported as **four** stalled rows, because the window query above it had returned four, and each of those four drove another pass. It was also firing four HubSpot searches per run instead of one. On a fifty-submission day that is fifty searches and a fifty-times-inflated count.

The fix is `executeOnce` on any node whose result does not depend on its input. All four query nodes take nothing from the item flowing in — they compute their own time windows — so running once is both the correct answer and N-1 fewer API calls.

Worth noting what caught it. The all-clear run passed cleanly and proved nothing, because with zero findings there was nothing to multiply. The bug only appeared once a row was deliberately planted to force the warning path. A checker whose failure branch has never run is not a checker, and that applies to this one as much as to the pipeline it watches.

### Webhook authentication

The webhook uses header auth, `X-Purview-Intake`, against a credential. The route sends the same header from `N8N_INTAKE_SECRET`.

It is not optional. The endpoint creates HubSpot contacts and deals from an unauthenticated POST, so without it anyone holding the URL can write to the CRM. The secret goes in a credential and never in node parameters, because parameters are stored unencrypted in the workflow JSON while credentials are encrypted at rest.

### Storage

Supabase, one table.

```sql
create table pv_intake_raw (
  id            uuid primary key default gen_random_uuid(),
  received_at   timestamptz not null default now(),
  raw_payload   jsonb not null,
  email         text,
  domain        text,
  status        text not null default 'received',
  hs_contact_id text,
  hs_deal_id    text,
  error_detail  text
);

create index on pv_intake_raw (status);
create index on pv_intake_raw (email);
```

`status` values match `pv_intake_status` in HubSpot so the two stay reconcilable. Seven of them:

| Status | Set by | Terminal |
|---|---|---|
| `received` | the route's raw write, as the column default | no |
| `complete` | write back, after the deal exists | yes |
| `duplicate_submit` | idempotency check, same email inside two minutes | yes |
| `invalid_email` | server side validation | yes |
| `duplicate` | HubSpot already had the email | yes |
| `failed_enrich` | nothing yet, enrichment is deferred | — |
| `enriched` | nothing yet, enrichment is deferred | — |

`complete` exists because the verification job alerts on any row still at `received` after an hour, so a finished row needs somewhere else to be. `enriched` would have been a lie until enrichment is built.

`duplicate_submit` and `duplicate` are deliberately separate. The first is one person clicking twice or a retry firing, and is silent. The second is a genuine repeat weeks later, and alerts. Collapsing them would make both uncountable.

### The notification

This is the trigger to act, so it carries what is needed to act.

Owned by n8n, at node 8. It lived in `app/notify.ts` until the pipeline could carry a deal url, and that file is gone — a notification that cannot link to the deal is not the notification this section describes.

**The company line is not a company name.** It shows the website the person typed and the domain derived from their email. `company` is never written to HubSpot and stays blank until enrichment lands, so there is nothing else to show. Read that line as "where they came from", not as an identified organisation — two submissions from the same company will not agree on it, and neither value has been checked against anything.

```
New audit intake

{company}  ·  {domain}
Stage: {stage_layer}
Sells to: {buyer_type}
CRM: {crm}

Number they don't trust:
"{untrusted_number}"

HubSpot: {deal_url}
```

### Verification, which is what makes this a demo rather than a workflow

A scheduled job, daily, that checks the pipeline is actually working rather than reporting that it is.

- Any `pv_intake_raw` row with status `received` older than one hour. Means the pipeline stalled after capture.
- Rows in the last 24 hours at status `complete`, against HubSpot contacts created in the same window carrying `pv_intake_status`. A mismatch is a silent failure.
- Any row with `hs_contact_id` null, status outside the failure set, older than an hour.

The failure set is `invalid_email` and `duplicate_submit` only.

It posts every day — findings when there are any, an all clear carrying the counts when there are not — so the absence of the message is the signal. Section 8 of `purview_hubspot_setup.md` carries the full design, including why the second check is not the raw-count comparison this section originally specified.

This is the piece almost nobody builds and it is the reason the whole thing is worth pointing at.

---

## 5. Build order

Each stage works on its own, so nothing blocks anything else.

**1. Site, form posting to a webhook that only logs.** Claude Code builds this from `purview_build_instructions.md`. No HubSpot dependency.

**2. HubSpot instance.** Free tier. Create the custom properties, the Audit pipeline, and the closed lost enum. Manual, roughly an hour.

**3. Supabase table.** The SQL above.

**4. n8n pipeline, steps 1 through 4.** Capture and validate. Verify a submission lands in Supabase and a bad email produces an alert.

**5. n8n pipeline, steps 5 through 11.** HubSpot writes and notification.

**6. Verification job.**

---

## 6. What to hand each tool

**Claude Code.** `purview_build_instructions.md`, `purview_homepage_copy.md`, `purview-home-v2.html`, plus section 2 of this doc for the form.

**n8n MCP.** Section 4 of this doc. Give it the node sequence and the design rules together. The rules matter more than the sequence, because the default workflow it produces will have no error paths and will normalize globally.

**HubSpot MCP.** Section 3. Property creation and pipeline setup can be done through the MCP rather than by hand, which is both faster and a better demonstration.

**Supabase MCP.** The SQL in section 4.

---

## 7. What this demonstrates, stated plainly

Worth being able to say out loud, since the whole point is that this doubles as portfolio work.

- Capture-first architecture, where the record is written before any external call can fail
- Explicit failure handling on every external call, with status rather than deletion
- Deliberate normalization, where email is lowercased and human-entered text is not
- Duplicate detection before create
- Derived fields computed in the pipeline rather than asked of the user
- Stage entry driven by a defined event rather than by dragging a card
- Closed lost as a required enum
- A scheduled verification job that checks the pipeline produced what it claimed to produce

That last one is the differentiator. Everything above it is competent. The verification job is the thing that separates someone who builds pipelines from someone who builds pipelines that stay correct.
