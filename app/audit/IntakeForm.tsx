'use client'

import { useState } from 'react'
import { INTAKE_WEBHOOK_URL } from '../webhook'

/* Keys match the HubSpot schema in purview_system_scope.md section 3, so the
   mapping is one to one when the pipeline gets wired.

   Select values are snake_case, not the display labels. customer_band and crm
   are spelled out in the scope doc. buyer_type is not, and these seven are now
   the canonical values: when the HubSpot instance gets built, the pv_buyer_type
   dropdown is built to match this list, not the other way round. Changing one
   here means changing it in HubSpot too, and a mismatch fails silently, with
   the write succeeding and the property coming back empty. */
const BUYER_TYPES = [
  { value: 'developers_ipps', label: 'Developers and IPPs' },
  { value: 'utilities_public_power', label: 'Utilities and public power' },
  { value: 'municipalities_government', label: 'Municipalities and government' },
  {
    value: 'corporate_sustainability_facilities',
    label: 'Corporate sustainability or facilities teams',
  },
  { value: 'epcs_installers', label: 'EPCs and installers' },
  { value: 'other_businesses', label: 'Other businesses' },
  { value: 'not_sure', label: 'Not sure' },
]

const CUSTOMER_BANDS = [
  { value: 'under_10', label: 'Under 10' },
  { value: '10_40', label: '10 to 40' },
  { value: '40_150', label: '40 to 150' },
  { value: '150_plus', label: '150+' },
]

const CRMS = [
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'spreadsheets', label: 'Spreadsheets' },
  { value: 'other', label: 'Something else' },
  { value: 'not_sure', label: 'Not sure' },
]

/* Name and email only. Everything else on this form is something we can
   establish ourselves during the audit, so blocking submission on it buys
   nothing and costs leads. */
const REQUIRED = ['firstname', 'lastname', 'email']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Values = Record<string, string>

const EMPTY: Values = {
  firstname: '',
  lastname: '',
  email: '',
  website: '',
  what_they_sell: '',
  buyer_type: '',
  customer_band: '',
  crm: '',
  untrusted_number: '',
}

/* Defined at module scope on purpose. A component declared inside the form
   body would be a new type on every render, so React would remount it and
   the field would lose focus after each keystroke. */
function Field({
  name,
  label,
  help,
  error,
  children,
}: {
  name: string
  label: string
  help?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {REQUIRED.includes(name) && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {help && (
        <p className="fieldHelp" id={`${name}-help`}>
          {help}
        </p>
      )}
      {children}
      {error && (
        <p className="fieldError" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function IntakeForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Values>({})
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  /* Wires a field to state and to its label, help text and error message. */
  const bind = (name: string, hasHelp = false) => ({
    id: name,
    name,
    value: values[name],
    /* The asterisk is aria-hidden, so this is what actually tells a screen
       reader the field is required. Both read REQUIRED, so they cannot drift. */
    'aria-required': REQUIRED.includes(name) || undefined,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby':
      [errors[name] ? `${name}-error` : null, hasHelp ? `${name}-help` : null]
        .filter(Boolean)
        .join(' ') || undefined,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => set(name, e.target.value),
  })

  /* Prefill the website from the email domain, per the copy. Only when the
     visitor has not typed one, so it never overwrites their answer. */
  const prefillWebsite = () => {
    const email = values.email.trim()
    if (!EMAIL_RE.test(email) || values.website.trim()) return
    /* Lowercased because we are authoring this value rather than recording
       what the visitor typed, and a hostname is canonically lowercase. Their
       own answers are still passed through untouched. */
    const domain = email.split('@')[1]?.toLowerCase()
    if (domain) setValues((v) => ({ ...v, website: `https://${domain}` }))
  }

  /* Required fields and email format only. Nothing else blocks submission. */
  const validate = () => {
    const next: Values = {}
    for (const name of REQUIRED) {
      if (!values[name].trim()) next[name] = 'This one is required.'
    }
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) {
      next.email = 'That does not look like an email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return

    if (!validate()) {
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>('.intake [aria-invalid="true"]')
          ?.focus()
      })
      return
    }

    setStatus('submitting')

    /* Trim only. Nothing is lowercased here, including the email, because
       normalising in two places is how a pipeline stops being reconcilable.
       n8n owns normalisation. */
    const payload: Values = { source_page: '/audit' }
    for (const [key, value] of Object.entries(values)) {
      payload[key] = value.trim()
    }

    try {
      const response = await fetch(INTAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="formDone" role="status">
        <p>
          <strong>Got it.</strong>
        </p>
        <p>
          We will come back within two business days with the access we need and
          a start date. Nothing else is required from you until then.
        </p>
      </div>
    )
  }

  return (
    <form className="intake" onSubmit={onSubmit} noValidate>
      <Field name="firstname" label="First name" error={errors.firstname}>
        <input type="text" autoComplete="given-name" {...bind('firstname')} />
      </Field>

      <Field name="lastname" label="Last name" error={errors.lastname}>
        <input type="text" autoComplete="family-name" {...bind('lastname')} />
      </Field>

      <Field name="email" label="Work email" error={errors.email}>
        <input
          type="email"
          autoComplete="email"
          onBlur={prefillWebsite}
          {...bind('email')}
        />
      </Field>

      <Field name="website" label="Company website" error={errors.website}>
        <input type="url" autoComplete="url" {...bind('website')} />
      </Field>

      <Field
        name="what_they_sell"
        label="What you sell, in one line"
        error={errors.what_they_sell}
      >
        <input
          type="text"
          placeholder="Grid monitoring software for utilities"
          {...bind('what_they_sell')}
        />
      </Field>

      <Field name="buyer_type" label="Who buys it" error={errors.buyer_type}>
        <select {...bind('buyer_type')}>
          <option value="">Choose one</option>
          {BUYER_TYPES.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="customer_band"
        label="Roughly how many customers"
        help="An estimate is fine."
        error={errors.customer_band}
      >
        <select {...bind('customer_band', true)}>
          <option value="">Choose one</option>
          {CUSTOMER_BANDS.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field name="crm" label="What CRM are you on" error={errors.crm}>
        <select {...bind('crm')}>
          <option value="">Choose one</option>
          {CRMS.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="untrusted_number"
        label="One number about your revenue you wish you could trust"
        help="Optional, and the most useful thing on this form."
      >
        <textarea rows={4} {...bind('untrusted_number', true)} />
      </Field>

      {status === 'error' && (
        <p className="formFail" role="alert">
          Something went wrong on our end and your answers did not save. Email{' '}
          <a href="mailto:hello@purviewops.com">hello@purviewops.com</a> and we
          will pick it up from there.
        </p>
      )}

      <button
        className="btn big"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending' : 'Send it'}
      </button>
    </form>
  )
}
