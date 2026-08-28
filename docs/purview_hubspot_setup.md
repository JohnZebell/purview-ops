# Purview Ops — HubSpot Setup

Not built yet. This is the spec to execute when the pipeline gets wired, either by hand or through the HubSpot MCP.

**Do not build this until there is a reason.** At zero to five submissions a month, reading the Supabase row and responding by hand is faster than maintaining a pipeline. Build it when manual becomes annoying, or when you want it as portfolio work.

**The one thing already locked.** The form on `/audit` posts these exact field names and values. HubSpot gets built to match them, not the reverse.

---

## 1. Field contract

The form sends this payload. Everything below is built to receive it.

```json
{
  "source_page": "/audit",
  "email": "Dana.Reyes@VoltaGrid.io",
  "website": "https://voltagrid.io",
  "what_they_sell": "Grid monitoring software for utilities",
  "buyer_type": "utilities_public_power",
  "customer_band": "10_40",
  "crm": "not_sure",
  "untrusted_number": "Our win rate. It says 34% and nobody believes it."
}
```

**Email casing is preserved by the form deliberately.** n8n owns lowercasing. Normalizing in two places is how a pipeline stops being reconcilable.

---

## 2. Custom contact properties

Free tier supports custom properties. Create these.

| Internal name | Label | Type | Options |
|---|---|---|---|
| `pv_what_they_sell` | What they sell | Single-line text | |
| `pv_buyer_type` | Buyer type | Dropdown | See 2.1 |
| `pv_customer_band` | Customer count band | Dropdown | See 2.2 |
| `pv_crm` | Current CRM | Dropdown | See 2.3 |
| `pv_untrusted_number` | Number they do not trust | Multi-line text | |
| `pv_stage_layer` | Stage assessment | Dropdown | See 2.4 |
| `pv_intake_status` | Intake status | Dropdown | See 2.5 |
| `pv_source_page` | Source page | Single-line text | |
| `pv_submitted_at` | Submitted at | Date picker | |

Standard properties also used: `email`, `firstname`, `lastname`, `company`, `website`, `jobtitle`, `lifecyclestage`.

### 2.1 `pv_buyer_type` — locked, must match exactly

| Internal value | Display label |
|---|---|
| `developers_ipps` | Developers and IPPs |
| `utilities_public_power` | Utilities and public power |
| `municipalities_government` | Municipalities and government |
| `corporate_sustainability_facilities` | Corporate sustainability or facilities teams |
| `epcs_installers` | EPCs and installers |
| `other_businesses` | Other businesses |
| `not_sure` | Not sure |

**If these do not match the form exactly, the write succeeds and the property comes back empty.** Silent failure, which is the worst kind. Verify with one test submission before trusting any row.

### 2.2 `pv_customer_band`

| Internal value | Display label |
|---|---|
| `under_10` | Under 10 |
| `10_40` | 10 to 40 |
| `40_150` | 40 to 150 |
| `150_plus` | 150+ |

### 2.3 `pv_crm`

| Internal value | Display label |
|---|---|
| `hubspot` | HubSpot |
| `salesforce` | Salesforce |
| `spreadsheets` | Spreadsheets |
| `other` | Something else |
| `not_sure` | Not sure |

`not_sure` is a finding, not a missing value. Do not treat it as null anywhere downstream.

### 2.4 `pv_stage_layer`

`seed` · `series_a` · `series_b` · `series_c`

Computed in n8n from `customer_band`, never entered by the person.

| Customer band | Stage layer |
|---|---|
| `under_10` | `seed` |
| `10_40` | `series_a` |
| `40_150` | `series_b` |
| `150_plus` | `series_c` |

### 2.5 `pv_intake_status`

`received` · `enriched` · `failed_enrich` · `invalid_email` · `duplicate`

Must match the `status` column in `pv_intake_raw` so the two stay reconcilable.

---

## 3. Custom deal properties

| Internal name | Label | Type |
|---|---|---|
| `pv_audit_stage_layer` | Stage assessment | Dropdown, same options as 2.4 |
| `pv_intake_complete` | Intake complete | Single checkbox |
| `pv_access_granted` | CRM access granted | Single checkbox |
| `pv_findings_sent` | Findings sent | Single checkbox |

---

## 4. The Audit pipeline

One pipeline. Every stage entry driven by a defined event, never by dragging a card. This is the instrumentation principle applied to your own instance, which matters because you sell it.

| Stage | Entry criteria |
|---|---|
| Intake received | Form submitted |
| Access requested | Access request sent |
| Access granted | `pv_access_granted` is true |
| Analysis running | Checks started |
| Findings delivered | `pv_findings_sent` is true |
| Retainer started | Closed won |
| No decision | Closed lost, reason required |

### Closed lost reason

Required enum, not free text. This is the field you tell clients to fix, so it has to be right here.

`no_access` · `no_budget` · `timing` · `did_it_themselves` · `hired_internally` · `no_response` · `not_a_fit`

---

## 5. What HubSpot free cannot do

Workflows are Marketing Hub Professional. Not available.

So HubSpot is the system of record and n8n is the orchestration layer. That is the better arrangement anyway, since it demonstrates building an automation layer rather than clicking through a workflow builder, which is what the job postings actually ask about.

---

## 6. Supabase table

Create this before n8n. Capture-first depends on it.

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

---

## 7. The n8n pipeline

Swap `INTAKE_WEBHOOK_URL` in `app/webhook.ts` to point at this. One line.

### Design rules, non negotiable

Give these to the n8n MCP **before** the node sequence. The default workflow it produces has empty error branches and normalizes globally, both of which are wrong.

**Capture first.** Raw payload written to Supabase before any external call. If enrichment times out or HubSpot is down, the submission still exists.

**Status, not deletion.** Nothing gets dropped. A record failing validation gets a status and an alert.

**Normalize deliberately.** Lowercase the email. Trim everything. Do not lowercase `what_they_sell` or `untrusted_number`. A global lowercase turns a company name into mush.

**Every external call gets its own error path.** Not one global handler, because the recovery differs. A failed enrich is recoverable. A failed HubSpot upsert is not.

### Node sequence

```
 1  Webhook                  POST, receives the payload in section 1
 2  Write raw                Supabase pv_intake_raw, before anything else
 3  Normalize                lowercase email, trim all, nothing else
 4  Validate email format    regex
      ├─ pass  →  continue
      └─ fail  →  status invalid_email, alert, stop. Record stays.
 5  Check duplicate          query HubSpot by email
      ├─ new       →  continue
      └─ existing  →  status duplicate, update rather than create, alert
 6  Derive stage layer       map customer_band per 2.4
 7  Enrich company           optional, cheap, from the domain
      ├─ success  →  continue
      └─ fail     →  status failed_enrich, continue anyway
 8  Upsert HubSpot contact   all properties from sections 2 and 2.1-2.5
      ├─ success  →  continue
      └─ fail     →  alert, retry with backoff. Record already saved at step 2.
 9  Create HubSpot deal      Audit pipeline, stage Intake received
10  Notify                   format in 7.1
11  Update raw record        write back hs_contact_id and hs_deal_id
```

### 7.1 The notification

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

---

## 8. The verification job

Scheduled daily. This is the piece almost nobody builds and the reason the whole thing is worth pointing at in an interview.

It checks the pipeline is working rather than reporting that it is.

- Any `pv_intake_raw` row with status `received` older than one hour. The pipeline stalled after capture.
- Count of HubSpot contacts created in the last 24 hours against count of raw rows. A mismatch is a silent failure.
- Any row with `hs_contact_id` null and status not in the failure set.

Alert on any of the three.

---

## 9. Build order when the time comes

1. Supabase table, section 6.
2. HubSpot properties and pipeline, sections 2 through 4. Verify `pv_buyer_type` values match the form exactly with one test submission.
3. n8n steps 1 through 4. Confirm a submission lands in Supabase and a bad email produces an alert.
4. n8n steps 5 through 11.
5. Swap `INTAKE_WEBHOOK_URL`.
6. Verification job, section 8.

---

## 10. What this demonstrates

Worth being able to say out loud, since the point is that this doubles as portfolio work.

- Capture-first architecture. The record is written before any external call can fail.
- Explicit failure handling per call, with status rather than deletion.
- Deliberate normalization. Email lowercased, human-entered text left alone.
- Normalization owned in one place, so the pipeline stays reconcilable.
- Duplicate detection before create.
- Derived fields computed in the pipeline rather than asked of the user.
- Stage entry driven by a defined event rather than a dragged card.
- Closed lost as a required enum.
- A scheduled verification job that checks the pipeline produced what it claimed to.

The last one is the differentiator. Everything above it is competent.
