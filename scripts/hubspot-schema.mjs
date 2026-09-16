// Builds the HubSpot schema in section 3 of docs/purview_system_scope.md: nine
// custom contact properties, four custom deal properties, and the Audit
// pipeline. Idempotent — it reads what exists before it writes, so a second run
// on a finished portal creates nothing and still prints the full diff.
//
// The MCP HubSpot connector has no schema tools: it creates records against
// properties that already exist, and nothing in it makes a property, a
// pipeline, or a stage. So this goes at the REST API directly with a Private
// App token.
//
//   node scripts/hubspot-schema.mjs --plan    reads and diffs, writes nothing
//   node scripts/hubspot-schema.mjs --apply   creates, then reads back and diffs
//
// --plan is the default. Nothing is written without --apply.
//
// The token comes from HUBSPOT_TOKEN. It is never logged, never interpolated
// into an error message, and never written to a file: every failure path here
// prints status and response body only, and the token only ever appears in an
// Authorization header.

import { readFileSync } from 'node:fs'

const BASE = 'https://api.hubapi.com'

// --- Decisions the spec does not make ---------------------------------------
// Section 3 is silent on all three. They are isolated here so changing one is a
// one-line edit rather than a hunt through the payloads.

// `pv_submitted_at` is "Date picker" in the spec, HubSpot's UI name for the
// `date` type — a day with no time. Settled as `datetime`: a submission
// timestamp without time of day loses information that cannot be recovered.
// Note the fieldType stays 'date' either way; HubSpot uses the same date picker
// widget for both types and rejects 'datetime' as a fieldType.
const SUBMITTED_AT_TYPE = 'datetime' // 'date' | 'datetime'

// The spec wants closed lost reason as a dropdown. HubSpot ships a standard
// `closed_lost_reason` on deals, but it is type `string` (free text) in this
// portal, not an enumeration. Settled as a custom property: converting the
// standard one touches a field other tooling may already read.
const CLOSED_LOST_MODE = 'custom' // 'custom' -> pv_closed_lost_reason | 'convert' -> closed_lost_reason

// Nothing here makes the closed lost reason *required*. Both HubSpot mechanisms
// are paid — create-form required is Starter+, stage-entry required is
// Professional+ — and this portal is free. n8n enforces it at write time and the
// daily verification job flags any closed lost deal with a blank reason, which
// is the same pattern as the rest of the system: the check catches what the
// platform will not.

// HubSpot requires a probability on every deal stage and the spec gives none.
// These are ascending placeholders; the two closed stages are fixed by HubSpot
// (won = 1.0, lost = 0.0) and are not a judgment call.
const STAGE_PROBABILITY = {
  intake_received: 0.1,
  access_requested: 0.2,
  access_granted: 0.4,
  analysis_running: 0.6,
  findings_delivered: 0.8,
}

// --- The spec, transcribed ---------------------------------------------------

const STAGE_LAYER_OPTIONS = [
  ['seed', 'Seed'],
  ['series_a', 'Series A'],
  ['series_b', 'Series B'],
  ['series_c', 'Series C'],
]

const CLOSED_LOST_OPTIONS = [
  ['no_access', 'No access'],
  ['no_budget', 'No budget'],
  ['timing', 'Timing'],
  ['did_it_themselves', 'Did it themselves'],
  ['hired_internally', 'Hired internally'],
  ['no_response', 'No response'],
  ['not_a_fit', 'Not a fit'],
]

const opts = (pairs) =>
  pairs.map(([value, label], i) => ({ label, value, displayOrder: i, hidden: false }))

const text = (name, label) => ({ name, label, type: 'string', fieldType: 'text' })
const textarea = (name, label) => ({ name, label, type: 'string', fieldType: 'textarea' })
const dropdown = (name, label, pairs) => ({
  name,
  label,
  type: 'enumeration',
  fieldType: 'select',
  options: opts(pairs),
})
const checkbox = (name, label) => ({
  name,
  label,
  type: 'bool',
  fieldType: 'booleancheckbox',
  options: opts([
    ['true', 'Yes'],
    ['false', 'No'],
  ]),
})

// Section 3, "Custom contact properties to create". Option values are the locked
// ones from section 2.1-2.5 of purview_hubspot_setup.md — if these drift from the
// form, the write succeeds and the property comes back empty.
const CONTACT_PROPERTIES = [
  text('pv_what_they_sell', 'What they sell'),
  dropdown('pv_buyer_type', 'Buyer type', [
    ['developers_ipps', 'Developers and IPPs'],
    ['utilities_public_power', 'Utilities and public power'],
    ['municipalities_government', 'Municipalities and government'],
    ['corporate_sustainability_facilities', 'Corporate sustainability or facilities teams'],
    ['epcs_installers', 'EPCs and installers'],
    ['other_businesses', 'Other businesses'],
    ['not_sure', 'Not sure'],
  ]),
  dropdown('pv_customer_band', 'Customer count band', [
    ['under_10', 'Under 10'],
    ['10_40', '10 to 40'],
    ['40_150', '40 to 150'],
    ['150_plus', '150+'],
  ]),
  dropdown('pv_crm', 'Current CRM', [
    ['hubspot', 'HubSpot'],
    ['salesforce', 'Salesforce'],
    ['spreadsheets', 'Spreadsheets'],
    ['other', 'Something else'],
    ['not_sure', 'Not sure'],
  ]),
  textarea('pv_untrusted_number', 'Number they do not trust'),
  dropdown('pv_stage_layer', 'Stage assessment', STAGE_LAYER_OPTIONS),
  dropdown('pv_intake_status', 'Intake status', [
    ['received', 'Received'],
    ['enriched', 'Enriched'],
    ['failed_enrich', 'Failed enrich'],
    ['invalid_email', 'Invalid email'],
    ['duplicate', 'Duplicate'],
  ]),
  text('pv_source_page', 'Source page'),
  { name: 'pv_submitted_at', label: 'Submitted at', type: SUBMITTED_AT_TYPE, fieldType: 'date' },
]

// Section 3, "Custom deal properties".
const DEAL_PROPERTIES = [
  dropdown('pv_audit_stage_layer', 'Stage assessment', STAGE_LAYER_OPTIONS),
  checkbox('pv_intake_complete', 'Intake complete'),
  checkbox('pv_access_granted', 'CRM access granted'),
  checkbox('pv_findings_sent', 'Findings sent'),
  ...(CLOSED_LOST_MODE === 'custom'
    ? [dropdown('pv_closed_lost_reason', 'Closed lost reason', CLOSED_LOST_OPTIONS)]
    : []),
]

// Section 3, "Pipeline". Order is the spec's order and is load-bearing: these
// replace the stock stages wholesale.
const AUDIT_STAGES = [
  { label: 'Intake received', probability: STAGE_PROBABILITY.intake_received, closed: false },
  { label: 'Access requested', probability: STAGE_PROBABILITY.access_requested, closed: false },
  { label: 'Access granted', probability: STAGE_PROBABILITY.access_granted, closed: false },
  { label: 'Analysis running', probability: STAGE_PROBABILITY.analysis_running, closed: false },
  { label: 'Findings delivered', probability: STAGE_PROBABILITY.findings_delivered, closed: false },
  { label: 'Retainer started', probability: 1.0, closed: true },
  { label: 'No decision', probability: 0.0, closed: true },
]

const PIPELINE_LABEL = 'Audit'
const PROPERTY_GROUPS = { contacts: 'contactinformation', deals: 'dealinformation' }

// --- Transport ---------------------------------------------------------------

const TOKEN_VAR = 'HUBSPOT_TOKEN'

function token() {
  const t = process.env[TOKEN_VAR]
  if (t) return t
  // Read .env.local directly so the script runs without a dotenv dependency.
  try {
    const line = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
      .split('\n')
      .find((l) => l.trimStart().startsWith(`${TOKEN_VAR}=`))
    if (line) {
      const v = line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')
      if (v) return v
    }
  } catch {
    // fall through to the error below
  }
  throw new Error(`${TOKEN_VAR} is not set. Put it in .env.local or the environment.`)
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const txt = await res.text()
  const json = txt ? JSON.parse(txt) : null
  if (!res.ok) {
    // Deliberately prints the response only. The request carried the token and
    // is never echoed.
    const err = new Error(`${method} ${path} -> ${res.status}: ${txt}`)
    err.status = res.status
    err.body = json
    throw err
  }
  return json
}

// --- Compare ------------------------------------------------------------------

// Reads the property back from HubSpot and checks the three things that matter:
// internal name, type, and options. Never trusts the create response.
function diffProperty(spec, live) {
  const problems = []
  if (!live) return ['absent']

  if (live.name !== spec.name) problems.push(`name ${live.name} != ${spec.name}`)
  if (live.type !== spec.type) problems.push(`type ${live.type} != ${spec.type}`)
  if (live.fieldType !== spec.fieldType) {
    problems.push(`fieldType ${live.fieldType} != ${spec.fieldType}`)
  }
  if (live.label !== spec.label) problems.push(`label "${live.label}" != "${spec.label}"`)

  if (spec.options) {
    const want = spec.options.map((o) => `${o.value}=${o.label}`)
    const got = (live.options ?? []).map((o) => `${o.value}=${o.label}`)
    const missing = want.filter((w) => !got.includes(w))
    const extra = got.filter((g) => !want.includes(g))
    if (missing.length) problems.push(`options missing: ${missing.join(', ')}`)
    if (extra.length) problems.push(`options extra: ${extra.join(', ')}`)
    // Order is not compared: HubSpot reorders by displayOrder and the spec does
    // not pin an order beyond the one implied by the table.
  }
  return problems
}

async function getProperty(objectType, name) {
  try {
    return await api('GET', `/crm/v3/properties/${objectType}/${name}`)
  } catch (e) {
    if (e.status === 404) return null
    throw e
  }
}

// --- Apply ---------------------------------------------------------------------

async function ensureProperty(objectType, spec, apply) {
  const live = await getProperty(objectType, spec.name)
  if (live) return { spec, action: 'exists' }
  if (!apply) return { spec, action: 'would-create' }
  await api('POST', `/crm/v3/properties/${objectType}`, {
    ...spec,
    groupName: PROPERTY_GROUPS[objectType],
  })
  return { spec, action: 'created' }
}

// Renaming `default` and replacing its stages destroys the seven stock stages.
// Any deal sitting on one of them would be stranded, so this refuses to run
// until the pipeline is empty.
async function auditPipeline(apply) {
  const { results: pipelines } = await api('GET', '/crm/v3/pipelines/deals')
  const target = pipelines.find((p) => p.id === 'default') ?? pipelines[0]
  if (!target) throw new Error('No deal pipeline found to rename.')

  const search = await api('POST', '/crm/v3/objects/deals/search', {
    filterGroups: [
      { filters: [{ propertyName: 'pipeline', operator: 'EQ', value: target.id }] },
    ],
    limit: 1,
  })
  if (search.total > 0) {
    throw new Error(
      `Pipeline "${target.label}" has ${search.total} deal(s) on it. Replacing its ` +
        `stages would strand them. Move or delete them first, or say to keep the ` +
        `stock stages and add the Audit stages alongside.`
    )
  }

  if (!apply) return { id: target.id, from: target.label, action: 'would-replace' }

  await api('PUT', `/crm/v3/pipelines/deals/${target.id}`, {
    label: PIPELINE_LABEL,
    displayOrder: target.displayOrder ?? 0,
    stages: AUDIT_STAGES.map((s, i) => ({
      label: s.label,
      displayOrder: i,
      metadata: { isClosed: String(s.closed), probability: String(s.probability) },
    })),
  })
  return { id: target.id, from: target.label, action: 'replaced' }
}

// --- Report ---------------------------------------------------------------------

async function verify(objectType, specs, heading) {
  console.log(`\n${heading}`)
  let ok = 0
  for (const spec of specs) {
    const live = await getProperty(objectType, spec.name)
    const problems = diffProperty(spec, live)
    if (problems.length === 0) {
      ok++
      console.log(`  MATCH   ${spec.name}  (${spec.type}/${spec.fieldType})`)
    } else {
      console.log(`  DIFFER  ${spec.name}  ${problems.join('; ')}`)
    }
  }
  console.log(`  ${ok}/${specs.length} match the spec.`)
  return ok === specs.length
}

async function verifyPipeline() {
  console.log('\nAudit pipeline')
  const { results } = await api('GET', '/crm/v3/pipelines/deals')
  const p = results.find((x) => x.label === PIPELINE_LABEL)
  if (!p) {
    console.log(`  DIFFER  no pipeline labelled "${PIPELINE_LABEL}"`)
    return false
  }
  const want = AUDIT_STAGES.map((s) => s.label)
  const got = [...p.stages].sort((a, b) => a.displayOrder - b.displayOrder).map((s) => s.label)
  const same = want.length === got.length && want.every((w, i) => w === got[i])
  console.log(same ? `  MATCH   stages in order: ${got.join(' -> ')}` : `  DIFFER  want ${want.join(' -> ')}\n          got  ${got.join(' -> ')}`)
  return same
}

async function main() {
  const apply = process.argv.includes('--apply')
  console.log(apply ? 'APPLY — writing to HubSpot.' : 'PLAN — reading only, nothing is written.')

  const created = []
  for (const spec of CONTACT_PROPERTIES) {
    created.push(await ensureProperty('contacts', spec, apply))
  }
  for (const spec of DEAL_PROPERTIES) {
    created.push(await ensureProperty('deals', spec, apply))
  }
  const pipe = await auditPipeline(apply)

  console.log('\n--- what happened ---')
  for (const c of created) console.log(`  ${c.action.padEnd(13)} ${c.spec.name}`)
  console.log(`  ${pipe.action.padEnd(13)} pipeline ${pipe.id} ("${pipe.from}" -> "${PIPELINE_LABEL}")`)

  console.log('\n--- read back from HubSpot ---')
  const a = await verify('contacts', CONTACT_PROPERTIES, 'Contact properties')
  const b = await verify('deals', DEAL_PROPERTIES, 'Deal properties')
  const c = await verifyPipeline()

  console.log(
    `\n${a && b && c ? 'All items match the spec.' : 'Some items do not match — see DIFFER lines above.'}`
  )
  process.exit(a && b && c ? 0 : 1)
}

main().catch((e) => {
  console.error(`\nFailed: ${e.message}`)
  process.exit(1)
})
