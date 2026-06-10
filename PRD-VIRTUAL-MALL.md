# PRD — The White-Glove Virtual Mall
### "Simon Properties of the Digital Economy"

**Status:** Draft v1 · June 2026
**Codebase:** `opensea-nft-clone` (Vite + React 18 + Tailwind, deployed on Netlify)
**Supersedes:** `GRAHMOS_MARKETPLACE_PRD.md` (absorbed into this document)

---

## 1. Vision

A White-Glove virtual mall where buyers, businesses, sellers, and channel partners
transact through a beautiful shopping experience backed by white-glove AI and
human-assisted commerce agents.

We are not building "another marketplace." We are building **commercial real estate
for the internet**. Simon Property Group doesn't sell products — it owns the
property, curates the tenant mix, drives foot traffic, and collects rent + a
percentage of tenant sales. That is the model:

| Simon Properties (physical) | Virtual Mall (us) |
|---|---|
| Owns the mall building | Owns the platform, domain, design system, traffic |
| Leases storefronts to brands | Rents / leases / sells digital storefronts ("units") to brands |
| Anchor tenants drive foot traffic | Anchor brands + agent concierge drive discovery traffic |
| Common-area maintenance fees | Platform SaaS fee + transaction take-rate |
| Percentage rent (% of tenant sales) | GMV take-rate on every transaction |
| Mall concierge & valet | AI agent white-glove layer (the differentiator) |
| Property appreciation | Storefront value appreciates with mall traffic; tokenized ownership makes it tradable |

### The crypto/value thesis
Buyers pay in **any currency** (card, ACH, PO/net terms, stablecoin, crypto).
But ownership of mall real estate — and optionally a brand's own storefront
equity — is recorded on-chain. A brand that *owns* its unit holds an appreciating,
transferable asset whose value is set by the decentralized market (mall traffic,
storefront revenue), not by investors. The NFT scaffold we started from is not a
leftover — it becomes the **deed registry** for mall real estate.

### Tenancy tiers (the core business model)
| Tier | Physical analog | What they get | Revenue to us |
|---|---|---|---|
| **Rent** | Month-to-month kiosk | Templated storefront, shared aisle placement | Monthly fee + 8–12% take-rate |
| **Lease** | Multi-year inline store | Custom storefront, category placement, agent support, B2B quote engine | Annual contract + 5–8% take-rate |
| **Own** | Anchor tenant / condo unit | Tokenized deed (NFT) to a mall unit, full customization, resale rights, governance voice | One-time sale + 2–4% take-rate + royalty on deed resale |

---

## 2. What exists today (the scaffold we preserve)

Audited June 2026:

- **Stack:** Vite 5 · React 18 · TypeScript · Tailwind 3 · react-router 6. No backend; all data from `src/data/mock.ts`.
- **Deployed:** Netlify (SPA redirect in `netlify.toml`, Node 20).
- **Pages (12):** Home (hero carousel, featured collections, trending tokens, rankings sidebar, category bar), Collection, NFT Detail, Rankings, Tokens, Activity, Drops, Rewards, Profile ("Buyer Dash"), Studio ("Supplier Portal"), Settings, Support.
- **Design system:** dark premium OpenSea language — `os.bg #0b0e11`, surfaces `#141619/#1a1d21/#24272c`, accent blue `#2081e2`, hover-expanding icon sidebar, card grids. **This is the visual source of truth. No feature ships that doesn't inherit it.**
- **Stubs in place:** `src/lib/airtable.ts` (env-keyed, unimplemented), `db/schema.sql` (Neon Postgres: marketplaces, suppliers, products, buyers, rfqs, orders).
- **Components:** ConnectWalletModal, OnboardingModal, Header, Sidebar, Footer, Layout + home modules.

### Page remapping (preserve layout, repurpose meaning)
| Existing page | Becomes |
|---|---|
| HomePage | Mall Atrium — featured storefronts, aisles, concierge entry |
| CollectionPage | Storefront page (a brand's unit in the mall) |
| NFTDetailPage | Product detail (multi-mode: retail / B2B / quote) **and** Deed detail for mall units |
| RankingsPage | Mall Directory — aisles/verticals ranked by traffic & GMV |
| TokensPage | Pricing Index + storefront deed market |
| DropsPage | New store openings & product launches |
| ActivityPage | Order & mall activity feed |
| RewardsPage | Shop Cash / loyalty (Voyages re-tasked) |
| ProfilePage | Buyer dashboard (consumer + business modes) |
| StudioPage | Seller/tenant portal |
| SettingsPage | Account, company, payment settings |
| SupportPage | White-glove support + agent handoff |
| ConnectWalletModal | Kept — wallet = deed ownership + crypto checkout |

---

## 3. The four experiences (role-gated, one design language)

1. **Buyer** (consumer + business): browse aisles, follow storefronts, save items, cart, checkout in any currency, request quotes, agent-assisted sourcing, order history, rewards.
2. **Tenant / Seller**: storefront management, products, inventory, orders, quotes, payouts, lease status, upgrade path (rent → lease → own).
3. **Channel Partner**: catalogs, inventory feeds, wholesale pricing, sourcing-request responses, fulfillment SLAs.
4. **Agent (white-glove layer)**: concierge console — assisted carts, quotes, sourcing routing, vendor/partner messaging, escalation. Agents are AI-first with human takeover.

Enterprise complexity is never visible to consumers. Role-based UI reveal only.

---

## 4. System architecture

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND — Netlify (keep)                                   │
│  Vite/React SPA · existing design system · role-gated UI     │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTPS / WebSocket
┌──────────────▼───────────────────────────────────────────────┐
│  AGENT & API LAYER — Cloudflare Workers (new)                │
│  · Cloudflare Agents SDK: one Durable Object per             │
│    conversation/cart/quote → persistent, stateful,           │
│    real-time agent sessions                                  │
│  · Workers API: products, storefronts, carts, orders, auth   │
│  · Workflows: order routing, quote lifecycle, sourcing       │
│  · KV (sessions/cache) · R2 (assets/paperwork PDFs)          │
└───────┬──────────────┬──────────────┬────────────────────────┘
        │              │              │
┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼────────────────────────┐
│ Neon Postgres│ │ Airtable  │ │ Payments & Chain              │
│ system of    │ │ ops brain │ │ Stripe Connect (fiat, payouts)│
│ record       │ │ (staff    │ │ Stablecoin/crypto checkout    │
│ (schema.sql, │ │ workflows,│ │ Deed registry (ERC-721 on an  │
│ extended)    │ │ approvals)│ │ L2, e.g. Base) — Phase 4      │
└──────────────┘ └───────────┘ └───────────────────────────────┘
```

**Data ownership rule:** Postgres is the system of record (orders, money, deeds, auth-adjacent data). Airtable is the *operations* layer — staff-facing views, approvals, agent task queues, sourcing pipelines — synced via Workers, never the source of truth for payments or auth.

### 4.1 Deployment decision: Netlify vs Cloudflare

**Decision: hybrid. Keep Netlify for the frontend. Build the agent/API layer on Cloudflare.**

Why this is the right call:

- The frontend is a static SPA already live on Netlify. Migrating it buys nothing and risks the thing that's working. Netlify is excellent at exactly this.
- The agent layer is the opposite shape: **long-lived, stateful, real-time**. Cloudflare's Agents SDK + Durable Objects is purpose-built for it — each buyer conversation, assisted cart, and quote negotiation is a Durable Object with its own state, WebSocket hibernation (cheap idle agents), scheduled follow-ups (cart recovery, order follow-up), and global low latency. Netlify Functions are stateless and short-lived; building persistent agents there means fighting the platform.
- Cloudflare Workflows gives durable multi-step execution for quote lifecycles and multi-vendor order routing (steps survive failures/retries) — this is the backbone of white-glove reliability.
- **Consolidation path:** if operating two platforms ever becomes friction, the SPA moves to Cloudflare Workers static assets in an afternoon (it's a `dist/` folder). The reverse — moving stateful agents off Cloudflare — would be a rewrite. So this hybrid has a one-way cheap exit, which is the safe architecture.

### 4.2 Agent roster (Cloudflare Agents SDK, Claude-powered)

| Agent | Durable Object scope | Responsibilities |
|---|---|---|
| **Mall Concierge** | per visitor session | Greeting, navigation, intent routing to specialist agents |
| **Product Match** | per search session | NL product discovery, alternatives, "no dead ends" |
| **B2B Sourcing** | per sourcing request | Route demand to vendors/channel partners, track responses |
| **Quote** | per quote | Quote lifecycle: draft → priced → accepted → order |
| **Cart / Checkout** | per cart | Assisted carts (open/edit with permission), checkout help, recovery via scheduled wake-ups |
| **Tenant Onboarding** | per applicant | White-glove storefront setup, lease/rent/own guidance |
| **Channel Partner** | per partner | Catalog ingestion, availability confirmation, SLA tracking |
| **Order Support** | per order | Tracking, returns, exceptions, proactive follow-up |
| **VIP / Leasing** | per company account | Anchor-tenant sales, deed purchases, net terms — human-in-the-loop required |

Every agent action writes to Postgres (audit) and mirrors to Airtable (staff queue). Human agents take over any conversation through the same Durable Object — the buyer never sees a seam. High-stakes actions (discounts above threshold, deed transfers, net-terms approval) require human approval, enforced in the Worker, not the prompt.

### 4.3 Payments
- **Phase 1–2:** Stripe (cards, Connect payouts to tenants, PO/net-terms invoicing for approved B2B).
- **Phase 3:** Stablecoin checkout (USDC) alongside fiat — "any currency" promise.
- **Phase 4:** Deed registry — mall units as ERC-721 on an L2; rent/lease in fiat or crypto; deed resale with platform royalty. Wallet connect modal already exists in the scaffold.

### 4.4 Data model (extends `db/schema.sql`)
Keep existing tables; add: `storefronts` (tenancy tier, unit location/aisle, lease terms, deed token id), `companies`, `channel_partners`, `pricing_rules`, `carts` + `cart_events`, `quotes` + `quote_items`, `sourcing_requests`, `agent_tasks`, `agent_conversations`, `rewards_ledger`, `analytics_events`, `deeds` (token id, owner, unit, royalty terms). Mirror the staff-workflow subset to Airtable.

---

## 5. Build phases

### Phase 0 — Foundation (week 1–2)
Componentize the scaffold (extract Card, Button, Modal, Table, EmptyState from existing pages into `src/components/ui/`), add role-based auth shell, stand up Cloudflare Worker project + Neon connection, seed Postgres from `schema.sql` + extensions, replace `mock.ts` reads with API calls behind a feature flag.

### Phase 1 — The Mall opens (week 3–6)
Storefront pages (CollectionPage repurposed), product detail multi-mode, mall directory, cart + Stripe checkout, buyer dashboard, tenant portal v1 (products, inventory, orders), Airtable ops sync.

### Phase 2 — White glove (week 7–10)
Cloudflare Agents SDK deployment: Concierge + Product Match + Cart agents live on every page (contextual, non-intrusive entry points), assisted carts, agent console for human takeover, cart-recovery scheduling, Airtable agent task queue.

### Phase 3 — B2B engine (week 11–14)
Company accounts + tier pricing, quote engine (full status lifecycle), sourcing-request engine, channel partner portal, multi-vendor order routing via Workflows, net terms / PO checkout, USDC checkout.

### Phase 4 — Real estate (week 15+)
Tenancy tiers productized (rent/lease/own), deed registry on L2, deed market on TokensPage, leasing agent + VIP flows, analytics dashboards (GMV by aisle, quote conversion, agent performance, sourcing gaps), governance for deed owners.

*The 20 prompt-by-prompt build specs from the founding document map onto these phases: Prompts 1–3 → Phase 0; 4–11 → Phase 1; 14–15 → Phase 2; 8 (agent parts), 12–13, 16–18 → Phase 3; 19–20 → Phase 4 close-out. Each prompt keeps its "do not redesign the visual system" constraint.*

---

## 6. Revenue model

1. **Occupancy revenue** — rent (monthly), leases (annual), unit sales (one-time + resale royalty). Predictable, real-estate-style.
2. **Transaction take-rate** — inverse to tenancy tier (rent 8–12% → own 2–4%): the more a brand commits, the more margin they keep. This is the upgrade incentive.
3. **White-glove services** — agent-assisted sourcing spreads, premium concierge tiers for VIP/B2B accounts.
4. **Secondary** — financing, logistics, market intelligence (per original GrahmOS plan).

**North-star metric:** Mall GMV. **Health metrics:** occupancy rate, rent→lease→own upgrade rate, agent-assisted conversion vs self-serve, quote→order conversion, deed floor price.

---

## 7. Non-negotiables

1. The existing design system is the visual authority. Every new surface reuses extracted components.
2. Buyers never see enterprise complexity. Role reveal only.
3. Payments, auth, and deeds live in Postgres/Stripe/chain — never Airtable.
4. Every agent action is audited and human-overridable; money-moving actions gate on human approval.
5. No dead ends: empty search/results always offer agent help or a sourcing request.
6. Crypto is additive, never required — any buyer can transact entirely in fiat.

---

## 8. Open questions

- L2 choice for deed registry (Base vs Arbitrum vs Polygon) — defer to Phase 4 spike.
- Human agent staffing model at launch (founder-operated concierge is fine for pilot).
- First anchor tenants — pilot catalogs (`pilot-product-catalog*.jsonl`) suggest BNY-area vertical; confirm launch aisle mix.
- Pricing for rent/lease tiers — validate against pilot tenant conversations.
