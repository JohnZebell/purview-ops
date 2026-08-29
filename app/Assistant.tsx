'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { CHAT_WEBHOOK_URL } from './chat'

type Message = {
  role: 'user' | 'assistant'
  content: string
  /* Returned alongside the message, per section 2 of the spec. Nothing
     renders it. It is kept because n8n is the thing that writes it to
     pv_chat_log, and having it on the client costs nothing if a later
     version wants to act on it. */
  trigger?: string
}

/* Section 5. Enough for a real conversation, not enough to run up a bill.
   Client side, so it is a courtesy and not an enforcement: anyone can post to
   the webhook directly, and the real limit belongs in n8n with the model. */
const MAX_TURNS = 20

/* Section 5 again. One line saying what it can do, not a greeting. */
const OPENING = 'Ask about the audit, the work, or how any of this is diagnosed.'

/* The prompt tells the assistant to write links as [text](/path) and to emit
   at most one. Matching that one shape is smaller than a markdown dependency
   and, more to the point, it can only ever produce a Link or a text node.
   There is no path here that turns model output into markup. */
const LINK_PATTERN = /\[([^\]\n]+)\]\((\/[^)\s]*)\)/g

/* One leading slash, and the next character cannot open an authority.
   Browsers read both //host and /\host as protocol-relative, so "starts with
   a slash" is not on its own enough to prove a path is internal. The pattern
   above already refuses http, https, and mailto by requiring the slash. */
const isInternalPath = (path: string) =>
  path === '/' || /^\/[^/\\]/.test(path)

/* Returns text nodes and Links. Anything that does not match, including a
   link whose path failed isInternalPath, stays in the text untouched, which
   is why last only advances past links that were actually rendered. */
function renderMessage(content: string): ReactNode[] {
  /* Built per call. A module-level global regex carries lastIndex between
     calls and would skip matches on the second message. */
  const pattern = new RegExp(LINK_PATTERN.source, 'g')
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const [raw, text, path] = match
    if (!isInternalPath(path)) continue
    if (match.index > last) out.push(content.slice(last, match.index))
    out.push(
      <Link href={path} key={match.index}>
        {text}
      </Link>,
    )
    last = match.index + raw.length
  }

  if (last < content.length) out.push(content.slice(last))
  return out
}

export default function Assistant() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  /* Whether the last failure still got the question into pv_chat_log. The
     route reports it, so the failure copy can say which happened. */
  const [logged, setLogged] = useState(false)

  /* Generated on first send rather than on mount, so the server render and
     the client render cannot disagree, and so a visitor who never opens the
     widget never gets an id at all. */
  const conversationId = useRef<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  /* Opening is always a deliberate click, so moving focus is what the person
     just asked for. */
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, status])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const spent = messages.filter((m) => m.role === 'user').length >= MAX_TURNS

  const send = async () => {
    const text = input.trim()
    if (!text || status === 'sending' || spent) return

    if (!conversationId.current) conversationId.current = crypto.randomUUID()

    /* Every message is a turn, so one exchange is N and N+1 and
       (conversation_id, turn) orders the whole transcript. n8n has to agree
       with this when it writes the two rows. */
    const turn = messages.length + 1
    const history = messages.map(({ role, content }) => ({ role, content }))

    setMessages((m) => [...m, { role: 'user', content: text }])
    setInput('')
    setStatus('sending')

    /* Tracked locally rather than in state, so the catch below reports the
       capture that actually happened on this attempt. */
    let captured = false

    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId.current,
          turn,
          message: text,
          page_path: pathname,
          history,
        }),
      })
      /* Read before the status check: the route puts logged on the failure
         body too, and that is the case the copy needs it for. */
      const data = await response.json().catch(() => null)
      captured = data?.logged === true

      if (!response.ok) throw new Error(String(response.status))

      const reply = typeof data?.message === 'string' ? data.message.trim() : ''
      /* An empty body is a failure even with a 200 on it. Rendering nothing
         would read as the assistant ignoring them. */
      if (!reply) throw new Error('empty reply')

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: reply,
          trigger: typeof data?.trigger === 'string' ? data.trigger : undefined,
        },
      ])
      setStatus('idle')
    } catch {
      setLogged(captured)
      setStatus('error')
    }
  }

  if (!CHAT_WEBHOOK_URL) return null

  return (
    <div className="assistant">
      {/* A div and not a section: the site styles every section with 5rem of
          vertical padding and a rule, which this is not. */}
      {open && (
        <div
          className="asstPanel"
          id="asstPanel"
          role="dialog"
          aria-label="Site assistant"
        >
          <div className="asstHead">
            <h2>Ask</h2>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="asstLog" ref={logRef} aria-live="polite">
            <p className="asstOpening">{OPENING}</p>

            {messages.map((m, i) => (
              <p
                className={m.role === 'user' ? 'asstUser' : 'asstReply'}
                key={i}
              >
                {m.role === 'assistant' ? renderMessage(m.content) : m.content}
              </p>
            ))}

            {status === 'sending' && <p className="asstNote">Thinking</p>}

            {/* Two versions, because the route writes the question to
                pv_chat_log before it calls n8n. The usual failure is n8n, and
                in that one the question really is saved, so saying so is true
                rather than reassuring. */}
            {status === 'error' && (
              <p className="asstFail" role="alert">
                {logged
                  ? 'Something went wrong on our end and no answer came back. Your question is saved either way. '
                  : 'Something went wrong on our end and that did not go through. '}
                Email{' '}
                <a href="mailto:hello@purviewops.com">hello@purviewops.com</a>{' '}
                and we will pick it up from there.
              </p>
            )}

            {spent && (
              <p className="asstNote">
                That is as far as this one goes. Email{' '}
                <a href="mailto:hello@purviewops.com">hello@purviewops.com</a>{' '}
                to carry on.
              </p>
            )}
          </div>

          <form
            className="asstForm"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <textarea
              id="asstInput"
              ref={inputRef}
              rows={2}
              value={input}
              disabled={spent}
              aria-label="Your question"
              onChange={(event) => {
                setInput(event.target.value)
                if (status === 'error') setStatus('idle')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
            />
            <button
              className="btn asstSend"
              type="submit"
              disabled={status === 'sending' || spent || !input.trim()}
            >
              {status === 'sending' ? 'Sending' : 'Send'}
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          className="btn asstLauncher"
          type="button"
          aria-expanded={false}
          aria-controls="asstPanel"
          onClick={() => setOpen(true)}
        >
          Ask a question
        </button>
      )}
    </div>
  )
}
