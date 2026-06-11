# agents.md — The White-Glove Agent Layer

> The agent architecture: what exists today, the planned roster, and the invariants that
> govern any agent that touches a buyer, a quote, or money.
> Source of truth: `netlify/functions/concierge.ts`, `src/components/grahmos/Concierge.tsx`.

---

## 1. The principle

The white-glove layer is the moat. A marketplace anyone can clone; an *agent-assisted
commerce concierge* — AI-first, human-takeover, auditable — they cannot. Agents sit
**across** the whole mall, not bolted onto one page.

**The surface invariant: many agents architecturally, one voice and one visible
surface.** Users only ever see **"GrahmOS Concierge"** — one name, one chat surface,
everywhere. The specialist roster below (Product Match → Quote → Sourcing → Cart →
Order Support → Human takeover) is routing machinery *behind* that surface. A buyer
never sees an agent roster, a routing decision, or a "transferring you" message —
including human takeover, which happens inside the same conversation with no seam.
(PRD §4; soul.md §4 "one voice.")

**The persona layer: the Grandmothers (PRD §4.1).** The one visible agent wears a
face the user picks (or is assigned, sticky): a Grandmother from a small
Brooklyn-flavored cast (`src/lib/grandmothers.ts`). She is a persona *skin* —
name, voice, accent color, greeting, specialty aisle — passed to `/api/concierge`
as a `persona` field and folded into the `SYSTEM` prompt. She is never a second
agent: switching grandmothers changes the voice, not the machinery. Each user's
grandmother is *their* dedicated persona; her per-user memory (preferences,
routes, open quotes) persists and is written back to the ops layer
(Airtable/Neon), which feeds the agent loop and returns learned parameters to
Agent Desk. Her voice constitution derives from `soul.md`; she never claims to
be human (invariant 7).

## 2. What ships today

```
Browser                         Netlify Function                 Model
─────────                       ────────────────                 ─────
Concierge.tsx  ──POST /api/concierge──▶  concierge.ts  ──▶  Claude (claude-opus-4-8)
(floating UI)   {messages, surface}      ├─ authenticate()        │
                                         ├─ SYSTEM prompt (voice)  │
                                         └─ cannedReply() fallback ◀┘ (no key / error)
```

- **Model:** `claude-opus-4-8` (the current most-capable Opus). Model id lives in one
  place — `netlify/functions/concierge.ts`.
- **Surface tagging:** the client passes `surface` ("landing" | "mall" | ...) so the
  agent tailors routing to context.
- **Graceful degradation:** with no `ANTHROPIC_API_KEY`, or on any API error, the
  function returns a deterministic, intent-routed canned reply. **The buyer never sees a
  dead end** (soul §4). `source` in the response is `claude | canned | fallback` for
  observability.
- **Auth-aware:** the concierge reads the caller (via `_auth.ts`) and is open to guests
  (greeter) and richer for signed-in users.

## 3. The planned roster (Durable Objects, Phase 2+)

Each agent is one Durable Object scope on Cloudflare (see `ARCHITECTURE.md` → Agent layer).
Today they are conceptual; **GrahmOS Concierge is their only front door** — none of these
ever gets its own buyer-facing UI (see §1, the surface invariant).

| Agent | DO scope | Responsibility |
|---|---|---|
| **GrahmOS Concierge** | per visitor session | The one visible agent: greet, navigate, route intent (← shipped as `/api/concierge`) |
| **Product Match** | per search | NL discovery, alternatives, no dead ends |
| **B2B Sourcing** | per sourcing request | Route demand to vendors/partners |
| **Quote** | per quote | Lifecycle: draft → priced → accepted → order |
| **Cart / Checkout** | per cart | Assisted carts, recovery via scheduled wake |
| **Tenant Onboarding** | per applicant | White-glove storefront setup, tier guidance |
| **Channel Partner** | per partner | Catalog ingestion, availability, SLA |
| **Order Support** | per order | Tracking, returns, proactive follow-up |
| **VIP / Leasing** | per company | Anchor sales, deed purchase — human-in-loop required |

## 4. Routing model

Intent → specialist. The concierge classifies the buyer's message and routes:

```
product discovery → Product Match
bulk / quantity   → Quote / B2B Sourcing
storefront / lease→ Tenant Onboarding / VIP Leasing
sourcing / supplier→ B2B Sourcing → Channel Partner
order / return    → Order Support
```

Today this lives as prompt-guided routing in the `SYSTEM` string + `cannedReply()`
heuristics. In Phase 2 it becomes explicit hand-offs between Durable Objects — but the
hand-offs stay invisible: the buyer keeps talking to "GrahmOS Concierge" throughout.

## 5. Invariants (every agent obeys)

1. **No dead ends.** Always offer a next action — quote, sourcing request, or human.
2. **Auditable.** Every agent action writes to Postgres (system of record) and mirrors to
   Airtable (staff queue). Today: function responses carry `source`/`role`; full audit
   lands with the Postgres wiring.
3. **Human-overridable.** A human agent takes over the same conversation seamlessly; the
   buyer sees no seam.
4. **Money gates on humans.** Discounts past a threshold, deed transfers, net-terms
   approval — these *require* human approval, enforced in the Worker/function, **not** in
   the prompt. Prompts are not a security boundary.
5. **Currency-agnostic.** Agents quote and transact in any currency; crypto is additive.
6. **One voice, one surface.** The `SYSTEM` prompt is the canonical voice (see
   `soul.md` §4), and "GrahmOS Concierge" is the only agent name or surface a user
   ever sees (§1). Specialists never speak under their own name. A Grandmother
   persona renames the *face*, never the machinery.
7. **Persona honesty.** A Grandmother is a beloved character, not a deception:
   she never claims to be human, and human takeover is disclosed exactly as
   before — same conversation, no seam, no pretending the human is the persona.

## 6. Model & API conventions

- Default to the latest Opus (`claude-opus-4-8`) unless a task is explicitly a
  fast/cheap subtask. Never downgrade silently.
- Use the official Anthropic SDK (`@anthropic-ai/sdk`), never raw HTTP or OpenAI shims.
- Short, latency-sensitive concierge turns: no streaming, `max_tokens` ~1024, thinking
  omitted. Long agentic flows (Phase 2): adaptive thinking + `high`/`xhigh` effort.
- Model id, system prompt, and fallback copy live in exactly one file each.

## 7. Extension checklist (read before adding an agent)

1. Define its Durable Object scope (what one instance owns).
2. Define its hand-offs (who it routes to / from).
3. Wire the audit write (Postgres) + staff mirror (Airtable).
4. Identify money-moving actions → add the human approval gate in code.
5. Keep the voice — extend the `SYSTEM` prompt, don't fork it.
6. Add a deterministic fallback so the surface never dead-ends.
7. **Never add a new visible agent.** The new specialist routes through GrahmOS
   Concierge; it gets no buyer-facing name, avatar, or chat surface of its own.
