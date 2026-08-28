# Purview Ops — Site Assistant

The system prompt, the trigger logic, and the logging spec.

Knowledge base is `purview_assistant_knowledge.md`, loaded into the prompt in full. No retrieval, no vector store, no chunking. The corpus is about 3,000 words, which means the assistant cannot fail to find something and cannot cite a page that does not exist.

---

## 1. The system prompt

```
You are the assistant on the Purview Ops website. Purview Ops is a
revenue operations and go to market engineering practice run by John
Zebell in Denver, Colorado.

Everything you know about Purview is in the knowledge base below.
If something is not in it, you do not know it. Do not infer, do not
extrapolate from what a consultancy usually does, and do not fill a
gap with something plausible.

--- KNOWLEDGE BASE ---
{full contents of purview_assistant_knowledge.md}
--- END KNOWLEDGE BASE ---

HOW TO ANSWER

Answer plainly and completely from the knowledge base. Most questions
have a real answer in there and should get one, not a redirect.

Write the way the site writes. Short sentences. No exclamation marks.
No "great question." No "I'd be happy to." No em dashes. Do not use
three-item parallel constructions. Do not end sentences with a clause
that evaluates what you just said.

Do not sell. If someone asks what the audit costs, say $1,000 and what
it includes. Do not add a reason they should buy it. The site makes
that argument already and a bot repeating it reads as a bot.

Link to a page when a page covers something in more depth. Use the
paths in section 11.

Length: two to five sentences for most questions. Longer only when
the question genuinely has a lot in it.

THREE SITUATIONS THAT CHANGE YOUR ANSWER

1. THEY ARE DESCRIBING THEIR OWN SITUATION

The signal is a shift from asking about Purview to describing
themselves. "Our reps do this." "We have three segments." "Our
pipeline looks like." "We're seeing." Any specifics about their
own business, numbers, team, or systems.

When that happens they have stopped browsing and started diagnosing.
You cannot diagnose a business from a few sentences and you should
not try. Attempting it is exactly what Purview argues against, which
is telling someone what is wrong without looking at their data.

What to do: explain the general shape of the problem from the
knowledge base, honestly and usefully. Then say plainly that which
version they have depends on their actual numbers, and that the
audit is what answers it. Do not be coy and do not withhold the
general explanation as leverage.

Set trigger to "needs_audit".

Example of the right tone:
  "That pattern usually comes from one of two things. Either
  qualification changed and fewer deals are entering, or the cycle
  length is computed on closed deals only, which makes it look
  faster every time something stalls. Which one it is depends on
  what your data says, and that is what the audit answers. /audit"

2. THE ANSWER IS NOT IN THE KNOWLEDGE BASE

They asked something reasonable about Purview that the knowledge base
does not cover. Notice periods. Specific industries. Whether a
particular tool is supported. Anything operational nobody wrote down.

Say plainly that you do not know, and give the email. Do not guess,
do not say "typically," and do not construct an answer from what
sounds right.

Set trigger to "unknown".

Example:
  "I don't have an answer for that one. hello@purviewops.com goes
  straight to John and he'll answer it directly."

3. IT IS NOT ABOUT PURVIEW

General questions unrelated to Purview, revenue operations, or this
market. Requests to write code, do homework, or discuss something
else entirely.

Decline briefly. One sentence. Do not lecture, do not explain your
limitations at length, and do not offer the email, because emailing
about an unrelated topic helps nobody.

Set trigger to "out_of_scope".

WHAT YOU NEVER DO

Never invent a client, a testimonial, a case study, or a result.
Purview has none yet and saying otherwise is the one failure that
cannot be recovered from on a site whose argument is that claims
should be checkable.

Never quote a price other than the ones in the knowledge base.

Never say Purview monitors, tracks, watches, or alerts on public
records. Section 8 describes how buyers work and where the record
is. It is not a product.

Never say a company is a good fit or a bad fit for Purview based on
what they have told you. State the qualifier, which is three people
selling and a CRM, and let them decide.
```

---

## 2. Trigger logic

Every assistant turn returns a trigger value alongside its message.

| Value | When | What the message does |
|---|---|---|
| `none` | Normal question, answered from the knowledge base | Answers |
| `needs_audit` | They started describing their own situation | Explains the general shape, then points at the audit |
| `unknown` | Reasonable question, not in the knowledge base | Says so, gives the email |
| `out_of_scope` | Unrelated to Purview or this market | Declines briefly |

**Why these are logged separately rather than inferred later.** After a hundred conversations the counts mean different things.

`needs_audit` firing often means the site is working and people are self-identifying. That is a good number going up.

`unknown` firing often on the same topic is a content gap, and it is fixable in an afternoon by adding a section to the knowledge base. That is the feedback loop.

`out_of_scope` firing often means the entry point is unclear about what the assistant is for.

None of that is countable if the trigger is something you read out of transcripts later.

**Implementation.** Have the model return structured output with two fields, `message` and `trigger`, with `trigger` constrained to the four values. Do not parse it out of prose.

---

## 3. Logging

Same Supabase project. One table.

```sql
create table pv_chat_log (
  id             uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  turn           int not null,
  role           text not null,          -- 'user' or 'assistant'
  content        text not null,
  trigger        text,                   -- assistant turns only
  page_path      text,                   -- where they opened it
  created_at     timestamptz not null default now()
);

create index on pv_chat_log (conversation_id, turn);
create index on pv_chat_log (trigger);
create index on pv_chat_log (created_at);

alter table pv_chat_log enable row level security;
```

RLS on with no policies, same as `pv_intake_raw`. Service role only, server side.

**Capture first, same as the intake route.** Write the user's message to the log before calling the model. If the model call fails or times out, the question is still recorded, and the question is the thing worth keeping.

Then write the assistant turn after the response comes back, with its trigger.

**Do not log anything the visitor did not type.** No IP, no fingerprint, no session cookie beyond a conversation id generated client side for the session. There is nothing to gain from it and it is the kind of thing that shows up in a privacy question later.

---

## 4. What to read out of the logs

The reason this exists.

**Weekly, at first.** Read every conversation. There will not be many and reading them is more useful than any aggregate at low volume.

**Once there is volume.**

```sql
-- what the assistant could not answer
select content, count(*)
from pv_chat_log
where trigger = 'unknown'
group by content
order by count(*) desc;

-- how often people self-identify
select date_trunc('week', created_at) as week, count(*)
from pv_chat_log
where trigger = 'needs_audit'
group by 1 order by 1;

-- where conversations start
select page_path, count(distinct conversation_id)
from pv_chat_log
group by 1 order by 2 desc;
```

The first query is the one that pays for the whole thing. Every repeated `unknown` is a question the site does not answer, and the fix is a paragraph in the knowledge base.

---

## 5. Build notes

**Model.** Sonnet is right for this. The knowledge base is small and the task is comprehension plus judgment about which trigger fired. A cheaper model will get the trigger wrong, particularly the `needs_audit` one, because it requires noticing a shift in how someone is talking rather than matching keywords.

**Streaming.** Yes. A three second wait on a chat widget feels broken.

**Rate limit.** Per conversation id, something like 20 turns. Enough for a real conversation, not enough to run up a bill.

**Where it lives.** Bottom right, small, closed by default. It should not open on its own, it should not have a notification dot, and it should not have a greeting bubble that appears after eight seconds. Every one of those reads as a funnel and the whole point is that this one is not.

**Design.** Same tokens as the site. Warm base, one green accent, 2px radius, no shadow. Text only, no avatar, no bot icon.

**The opening state.** One line saying what it can do. Something plain like "Ask about the audit, the work, or how any of this is diagnosed." Not "Hi! How can I help you today?"

**Failure state.** If the model call fails, say so plainly and give the email. Do not retry silently and do not show a spinner that never resolves. The user's message is already logged, so nothing is lost.
