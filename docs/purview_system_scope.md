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

Six required fields, one optional. Every field past six costs submissions, and the first two do most of the work.

| Field | Type | Required | Why it exists |
|---|---|---|---|
| Work email | email | Yes | The domain is the key to everything downstream |
| Company website | url | Yes | Enrichment anchor. Prefill from the email domain |
| What you sell, one line | text | Yes | Feeds segment classification |
| Who buys it | select | Yes | Routes to the right diagnostic. Options below |
| Roughly how many customers | select | Yes | The stage router. Easier to answer than ARR |
| What CRM are you on | select | Yes | Determines whether the instrumentation findings are even possible |
| One number about your revenue you wish you could trust | textarea | No | The most valuable field on the form. Their words, their problem |

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
- POST to the n8n webhook. Do not post directly to HubSpot.
- On success, show a promise with a clock on it rather than a result. Something like "You will have the findings within two weeks. First thing we send is the access request."
- Do not render anything computed back to the screen. The value goes in the deliverable.
- On failure, tell them plainly and give an email address. Never a silent failure on the user side either.

---

## 3. HubSpot schema

### Standard contact properties used

`email`, `firstname`, `lastname`, `company`, `website`, `jobtitle`, `lifecyclestage`

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
| `pv_submitted_at` | Submitted at | Date picker | |

### Custom deal properties

| Internal name | Label | Type |
|---|---|---|
| `pv_audit_stage_layer` | Stage assessment | Dropdown, same options as above |
| `pv_intake_complete` | Intake complete | Single checkbox |
| `pv_access_granted` | CRM access granted | Single checkbox |
| `pv_findings_sent` | Findings sent | Single checkbox |

### Pipeline

One pipeline, `Audit`, with these stages. Every stage entry must be driven by a defined event, never by dragging a card. This is the instrumentation principle applied to Purview's own instance.

| Stage | Entry criteria, checkable |
|---|---|
| Intake received | Form submitted |
| Access requested | Access request sent |
| Access granted | `pv_access_granted` is true |
| Analysis running | Checks started |
| Findings delivered | `pv_findings_sent` is true |
| Retainer started | Closed won |
| No decision | Closed lost, reason required |

Closed lost reason is a required enum, not free text. Options: `no_access`, `no_budget`, `timing`, `did_it_themselves`, `hired_internally`, `no_response`, `not_a_fit`.

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

### Node sequence

```
 1  Webhook                  POST /purview-intake
 2  Write raw payload        Supabase table pv_intake_raw, before anything else
 3  Normalize                email lowercased, all fields trimmed, nothing else changed
 4  Validate email format    regex
      ├─ pass  →  continue
      └─ fail  →  set status invalid_email, alert, stop. Record stays.
 5  Check duplicate          query HubSpot by email
      ├─ new       →  continue
      └─ existing  →  set status duplicate, update rather than create, alert
 6  Derive stage layer       map customer band per the table above
 7  Enrich company           optional, cheap, from the domain
      ├─ success  →  continue
      └─ fail     →  set status failed_enrich, continue anyway
 8  Upsert HubSpot contact   all standard and custom properties
      ├─ success  →  continue
      └─ fail     →  alert, retry with backoff, record already saved at step 2
 9  Create HubSpot deal      in the Audit pipeline, stage Intake received
10  Notify                   with company, stage layer, and the untrusted-number
                             answer in the body
11  Update raw record        write back the HubSpot contact and deal IDs
```

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

`status` values match `pv_intake_status` in HubSpot so the two stay reconcilable.

### The notification

This is the trigger to act, so it carries what is needed to act.

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
- Count of HubSpot contacts created in the last 24 hours against count of raw rows. A mismatch is a silent failure.
- Any row with `hs_contact_id` null and status not in the failure set.

Alert on any of the three. This is the piece almost nobody builds and it is the reason the whole thing is worth pointing at.

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
