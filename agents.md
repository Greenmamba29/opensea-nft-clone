# agents.md — The White-Glove Agent Layer

> The agent architecture: what exists today, the planned roster, and the invariants that
> govern any agent that touches a buyer, a quote, or money.
> Source of truth: `netlify/functions/concierge.ts`, `src/components/accio/Concierge.tsx`.

---

## 1. The principle

The white-glove layer is the moat. A marketplace anyone can clone; an *agent-assisted
commerce concierge* — AI-first, human-takeover, auditable — they cannot. Agents sit
**across** the whole mall, not bolted onto one page.

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
Today they are conceptual; the concierge is their unified front door.

| Agent | DO scope | Responsibility |
|---|---|---|
| **Mall Concierge** | per visitor session | Greet, navigate, route intent (← shipped as `/api/concierge`) |
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
heuristics. In Phase 2 it becomes explicit hand-offs between Durable Objects.

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
6. **One voice.** The `SYSTEM` prompt is the canonical voice (see `soul.md` §4).

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
