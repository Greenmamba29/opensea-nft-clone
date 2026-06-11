# PRD — GrahmOS Virtual Mall
### "Simon Properties of the Digital Economy"

**Status:** Draft v2 · June 2026
**Codebase:** `opensea-nft-clone` (Vite + React 18 + Tailwind, deployed on Netlify)
**Supersedes:** `GRAHMOS_MARKETPLACE_PRD.md` (absorbed) and PRD Draft v1 (reorganized — nothing deleted, everything re-sequenced around one launch story)

---

## 1. The launch story (the only story)

**GrahmOS Virtual Mall is an AI-powered digital mall where buyers walk into a guided
shopping/sourcing experience, discover verified storefronts, buy products, request
quotes, and let a concierge agent complete the transaction with sellers, partners,
or humans behind the scenes.**

**The core loop:**

> Walk into the mall → Tell GrahmOS what you need → Get matched to stores, products,
> quotes, or a sourcing agent → Buy or request help.

That is the whole product. Everything else in this document — agents, tenancy tiers,
deeds, dashboards — exists to make that loop work or to monetize it. We launch one
app telling one story, not four apps at once.

**First vertical anchor: The BNY Digital Mall** — a guided procurement and
storefront marketplace for Brooklyn Navy Yard local manufacturers, suppliers,
makers, and buyers. One real place, one tenant community, one buyer base that
already knows each other. The mall metaphor stops being a metaphor.

**One-line positioning:**

> "GrahmOS is Shopify + Google Maps + AI Concierge + Simon Property Group for
> digital commerce."

### 1.1 The organizing principle

**Enterprise complexity is never visible to consumers.** This was a rule in v1;
it is now the *main organizing principle* of the product. Every other decision in
this PRD — the app map, the renames, the single-agent surface, the demotion of
crypto to a later phase — is this principle applied. Buyers see a mall. Tenants see
a store. Operators see the machinery. Complexity is revealed by role, never by
default — and in v1, the buyer-facing surface contains zero crypto, zero agent
plumbing, and zero marketplace jargon.

v1 phrasing for the money question: **"Buyers pay normally. Tenants can later
upgrade into digital ownership of their storefront unit."** Lead with commerce,
sourcing, and storefront revenue. Ownership is a tenant upgrade story, not a buyer
story. (Full deed/token detail: §10, "Later phases.")

---

## 2. The app map (clean v1 nav)

One nav, buyer-first. Everything a buyer can see:

| Surface | What it is |
|---|---|
| **Atrium** | Home — featured stores, concierge entry, categories |
| **Aisles** | Category map: Packaging · Fabrication · Electronics · Apparel & Merch · Food & Beverage · Office & Business Services · Logistics & Delivery · Local Brands |
| **Stores** | Tenant storefronts |
| **Products** | Searchable catalog |
| **Quotes** | B2B RFQ flow |
| **Orders** | History / tracking |
| **Concierge** | AI + human help (the one visible agent — §4) |
| **Tenant Studio** | Seller dashboard (tenant role only) |
| **Agent Desk** | Internal ops only |

**Language invariant:** Buyers never see "Tokens," "NFTs," "Deeds," or "Activity"
in v1. That vocabulary is tenant/admin only, and most of it is deferred entirely
(§10).

### 2.1 Renames (scaffold page → mall surface)

| Old name | New name |
|---|---|
| NFT Detail | Product Detail / Storefront Unit Detail |
| Tokens | Storefront Index |
| Drops | New Openings |
| Activity | Orders & Mall Activity |
| Rewards | GrahmOS Rewards |
| Collection | Storefront |
| Rankings | Mall Directory |

---

## 3. Directions Mode (the signature feature)

The thing no other marketplace has: **the mall gives you directions.**

1. The buyer states an intent ("I need 500 custom boxes for a candle brand").
2. GrahmOS asks 1–2 clarifying questions — never more.
3. The app generates a **guided route**:

   > Start at the Packaging aisle → visit 2–3 recommended storefronts → compare
   > pricing → request a quote → add the best option to cart → offer delivery.

4. The buyer can switch freely between **Browse Mode** (classic self-serve) and
   **Guided Mode** (the route).

**How it renders:** a Google-Maps-style vertical stepper — the **Route Card** —
that persists across navigation. Each step is checkable, tappable, and deep-links
to the storefront/product/quote it references. A stylized SVG mall-map header sits
above the stepper for delight and orientation. **The map is garnish; the stepper
is the engine.** If the map ships a phase late, nothing breaks.

### 3.1 The Maps-clone evolution (v1 → v3)

Directions Mode deliberately clones the Google Maps UX, deepening each phase:

- **v1 (shipped):** route = vertical stepper + SVG mall map with an animated
  path; the buyer's guide marker travels the map as stops complete — turn-by-turn,
  but tap-to-advance.
- **v2 — live navigation:** the journey animates *continuously* and life-like:
  the guide walks the route in real time as the buyer browses, re-routes when
  the buyer detours ("you've wandered into Fabrication — want to keep going, or
  shall we get back to your boxes?"), and recalculates ETA as quotes land.
- **v3 — agent orchestration at the edge:** each active journey gets its own
  **journey subagent** (Cloudflare Durable Object, one per user-route) embedded
  in the navigation itself — it holds route state, watches for quote responses
  and stock changes, and nudges the route forward without a page open. The
  visible experience never changes: it is still one guide, one route, one voice.

Directions Mode is the demo, the screenshot, and the reason a BNY buyer tells
another BNY buyer about GrahmOS.

---

## 4. One visible agent: GrahmOS Concierge

Users only ever see **one agent: "GrahmOS Concierge."** One name, one voice, one
chat surface, everywhere in the mall.

Behind that surface, the concierge routes to specialists:

```
GrahmOS Concierge (the only visible surface)
   ├─ Product Match   (discovery, alternatives)
   ├─ Quote           (RFQ lifecycle)
   ├─ Sourcing        (route demand to vendors/partners)
   ├─ Cart            (assisted carts, recovery)
   ├─ Order Support   (tracking, returns, follow-up)
   └─ Human takeover  (same conversation, no seam)
```

**Invariant: many agents architecturally, one voice and one visible surface.**
A buyer never learns they were handed between specialists, and never sees an
agent roster, a routing decision, or a "transferring you now" message. The full
architectural roster and routing rules live in `agents.md`.

### 4.1 The Grandmothers (the face of the concierge)

The one visible agent wears a face the user chooses: a **Grandmother** — a warm,
persona-rich guide selected from a small cast (or assigned on first visit, sticky
forever after). She is a *persona skin* on the single concierge, never a second
agent — the one-voice invariant holds.

- **Cast:** ~6 Brooklyn-flavored grandmothers, each with a name, voice, accent
  color, and a specialty aisle (e.g. Nonna Rosa → Food & Beverage, Nai Nai Lin →
  Electronics). Warm and premium, never kitschy.
- **Where she lives:** a small **orb** at the bottom of every screen (mall and
  landing). On full desktop pages, a corner avatar card with a **phone-style
  "Call" CTA**. In Guided Mode she narrates the route and her marker walks the
  mall map.
- **Personal and persistent:** each user gets *their* grandmother — one persona
  dedicated to that user's outcomes. Her voice constitution derives from
  `soul.md`; her per-user memory (preferences, past routes, open quotes) persists
  server-side and follows the user across sessions.
- **The memory loop:** persona + conversation outcomes are written back to the
  ops layer (Airtable today, Neon as system of record), which feeds the agent
  loop; the loop returns learned parameters (intent patterns, conversion
  signals, stuck-journey flags) to Agent Desk so admins see what every
  grandmother is learning. User-facing: she just *remembers you*.

---

## 5. Role dashboards (one question each)

Each role gets one dashboard answering one question. Nothing leaks between them.

### Buyer — *"What am I buying, sourcing, tracking, or saving?"*
Active orders · saved storefronts · quote requests · recommended aisles ·
concierge history · rewards · business profile · reorder shortcuts.

### Tenant (Tenant Studio) — *"How is my storefront performing?"*
Traffic · catalog · orders · quotes · lease/rent status · payouts ·
agent-assisted sales · upgrade path (Rent → Lease → Own).

### Agent Desk (internal) — *"Where does the system need human help?"*
Live conversations · stuck carts · unanswered quotes · vendor follow-ups ·
high-value buyers · approvals · refund exceptions · onboarding tasks.

### Partner — *"What demand can I fulfill?"*
Incoming sourcing requests · catalog feed · inventory · SLA · wholesale pricing ·
fulfillment tasks.

---

## 6. The first 90 seconds (per role)

### Buyer
Land in Atrium → choose **Shop** / **Source for my business** / **Ask Concierge**
→ enter need → see recommended aisle/stores/products (Directions Mode if guided)
→ add to cart or request quote → concierge completes → track in dashboard.

### Seller
Apply → choose **Rent / Lease / Own** → upload catalog → GrahmOS builds the
storefront → receive orders/quotes → agent converts buyers → see traffic, GMV,
and upgrade options in Tenant Studio.

### Agent (internal)
Monitor journeys → take over stuck carts / complex quotes → route sourcing
requests to partners → approve sensitive actions.

**Primary CTA everywhere: "Tell GrahmOS what you need."**
Secondary CTAs: "Browse Aisles" · "Request a Quote" · "Open a Storefront."

---

## 7. MVP v1: BNY Sourcing Mall

Build **only** this:

- Atrium
- Aisles (the eight categories in §2)
- Storefront pages
- Product pages
- Search + Concierge (one agent surface, §4)
- Cart
- Request quote
- Buyer dashboard
- Tenant Studio
- Agent Desk **light**
- Stripe checkout
- Neon DB
- Airtable ops queue

**Explicitly delayed** (see §10 for where they land):

- Deed registry
- Token marketplace
- Governance
- Stablecoin checkout
- Full rewards game
- Public deed resale
- Overbuilt multi-agent UI (the roster stays behind the one concierge surface)

---

## 8. Business model (unchanged, just resequenced)

This is the part of v1 that was already right. The mall economics:

### Tenancy tiers
| Tier | Physical analog | What they get | Revenue to us |
|---|---|---|---|
| **Rent** | Month-to-month kiosk | Templated storefront, shared aisle placement | Monthly fee + 8–12% take-rate |
| **Lease** | Multi-year inline store | Custom storefront, category placement, agent support, B2B quote engine | Annual contract + 5–8% take-rate |
| **Own** | Anchor tenant / condo unit | Digital ownership of a mall unit, full customization, resale rights, governance voice | One-time sale + 2–4% take-rate + royalty on resale |

The take-rate *drops* as commitment *rises* — that asymmetry is the upgrade
engine. In v1, "Own" is sold as a tenant upgrade path; its on-chain mechanics are
a later phase (§10).

### Every storefront is an integrated Shopify store

The unit being rented, leased, or owned is not a page template — it is a
**fully provisioned Shopify store, integrated into the mall.** GrahmOS is the
mall layer (traffic, aisles, Directions Mode, concierge, quotes, leases);
Shopify is the per-tenant commerce engine (catalog, checkout, inventory,
fulfillment, taxes). This is deliberate: we sell *commercial real estate plus
a turnkey business*, and we never rebuild commerce plumbing Shopify already
runs at scale.

How the tiers map:

| Tier | Shopify arrangement |
|---|---|
| **Rent** | GrahmOS-provisioned store on a GrahmOS Shopify account; templated theme; tenant operates it through Tenant Studio |
| **Lease** | Same provisioned store with custom theme + apps; tenant gets direct Shopify admin access alongside Tenant Studio |
| **Own** | The Shopify store (and its domain) transfers to the tenant outright; GrahmOS keeps the mall integration + take-rate via the integration contract |

Integration surfaces:
- **Storefront API** — pulls each store's live catalog into the mall (aisle
  pages, Products catalog, Directions Mode stops, concierge product matches).
- **Admin API + webhooks** — orders, inventory, and payout events flow back
  into mall data (Orders page, Tenant Studio analytics, agent loop, take-rate
  metering).
- **Provisioning** — the Tenant Onboarding agent creates the store from the
  storefront application (theme by aisle, catalog upload, GrahmOS integration
  app installed) — "GrahmOS builds your storefront" is literal.
- **Checkout** — v1 buyers check out per-store via Shopify; the mall cart is
  an orchestration layer on top. The escrow rails of §11.3 apply to B2B
  quote-driven orders, which settle outside Shopify checkout.

The mall remains the system of record for *tenancy* (tier, lease terms, unit,
deed-later); Shopify is the system of record for *commerce* (products,
orders, fulfillment). `storefronts` rows carry `platform` + `shopifyDomain`.

### Revenue streams
1. **Occupancy revenue** — rent (monthly), leases (annual), unit sales (one-time + resale royalty). Predictable, real-estate-style.
2. **Transaction take-rate** — inverse to tenancy tier (rent 8–12% → own 2–4%): the more a brand commits, the more margin they keep.
3. **White-glove services** — agent-assisted sourcing spreads, premium concierge tiers for VIP/B2B accounts.
4. **Secondary** — financing, logistics, market intelligence (per original GrahmOS plan).
5. **Later: ownership** — deed sales and resale royalties, once Phase 4 ships (§10).

### The Simon Properties frame
| Simon Properties (physical) | GrahmOS (digital) |
|---|---|
| Owns the mall building | Owns the platform, domain, design system, traffic |
| Leases storefronts to brands | Rents / leases / sells digital storefronts ("units") to brands |
| Anchor tenants drive foot traffic | Anchor brands + concierge drive discovery traffic |
| Common-area maintenance fees | Platform SaaS fee + transaction take-rate |
| Percentage rent (% of tenant sales) | GMV take-rate on every transaction |
| Mall concierge & valet | GrahmOS Concierge (AI + human white-glove layer — the differentiator) |
| Property appreciation | Storefront value appreciates with mall traffic; ownership upgrade makes it transferable (later phase) |

**North-star metric:** Mall GMV. **Health metrics:** occupancy rate,
rent→lease→own upgrade rate, agent-assisted conversion vs self-serve,
quote→order conversion, Directions Mode route completion rate.

---

## 9. What exists today (the scaffold we preserve)

Audited June 2026:

- **Stack:** Vite 5 · React 18 · TypeScript · Tailwind 3 · react-router 6. No backend; all data from `src/data/mock.ts`.
- **Deployed:** Netlify (SPA redirect in `netlify.toml`, Node 20).
- **Pages (12):** Home (hero carousel, featured collections, trending tokens, rankings sidebar, category bar), Collection, NFT Detail, Rankings, Tokens, Activity, Drops, Rewards, Profile ("Buyer Dash"), Studio ("Supplier Portal"), Settings, Support.
- **Design system:** dark premium OpenSea language — `os.bg #0b0e11`, surfaces `#141619/#1a1d21/#24272c`, accent blue `#2081e2`, hover-expanding icon sidebar, card grids. **This is the visual source of truth. No feature ships that doesn't inherit it.**
- **Stubs in place:** `src/lib/airtable.ts` (env-keyed, unimplemented), `db/schema.sql` (Neon Postgres: marketplaces, suppliers, products, buyers, rfqs, orders).
- **Components:** ConnectWalletModal, OnboardingModal, Header, Sidebar, Footer, Layout + home modules.

### Page remapping (preserve layout, repurpose meaning)
The renames table (§2.1) is the buyer-facing naming; this is the implementation map:

| Existing page | Becomes |
|---|---|
| HomePage | Atrium — featured storefronts, aisles, concierge entry |
| CollectionPage | Storefront page (a brand's unit in the mall) |
| NFTDetailPage | Product Detail (multi-mode: retail / B2B / quote) — Storefront Unit Detail mode is a later phase |
| RankingsPage | Mall Directory — aisles/verticals ranked by traffic & GMV |
| TokensPage | Storefront Index (deed-market mode deferred to later phase) |
| DropsPage | New Openings — store openings & product launches |
| ActivityPage | Orders & Mall Activity (buyers see Orders; the activity feed is tenant/admin) |
| RewardsPage | GrahmOS Rewards (light in v1; full rewards game deferred) |
| ProfilePage | Buyer dashboard (consumer + business modes) |
| StudioPage | Tenant Studio |
| SettingsPage | Account, company, payment settings |
| SupportPage | White-glove support + concierge handoff |
| ConnectWalletModal | Kept in codebase, hidden from v1 buyer UI — resurfaces in later phases |

---

## 10. Committed later phases: ownership, deeds, crypto & the pre-IPO market

> Everything in this section is **committed roadmap, not maybes** — it is simply
> not the launch story and **never visible to v1 buyers.** v1 phrasing: *"Buyers
> pay normally. Tenants can later upgrade into digital ownership of their
> storefront unit."* Crypto is deferred in sequencing only; it is a core part of
> what GrahmOS becomes.

### The value thesis (deferred, not deleted)
Buyers pay in any currency (card, ACH, PO/net terms; later stablecoin/crypto).
But ownership of mall real estate — and optionally a brand's own storefront
equity — is eventually recorded on-chain. A brand that *owns* its unit holds an
appreciating, transferable asset whose value is set by the decentralized market
(mall traffic, storefront revenue), not by investors. The NFT scaffold we started
from is not a leftover — it becomes the **deed registry** for mall real estate.

### What lands here (Phase 3–4)
- **Stablecoin checkout (USDC)** alongside fiat — the "any currency" promise (Phase 3).
- **Deed registry** — mall units as ERC-721 on an L2 (e.g. Base); rent/lease in fiat or crypto (Phase 4).
- **Deed market** — Storefront Index gains a deed-trading mode; resale with platform royalty (Phase 4).
- **Governance for deed owners** (Phase 4).
- **Public deed resale** and the **full rewards game** (Phase 4+).
- ConnectWalletModal resurfaces as the deed-ownership + crypto-checkout entry.

### Phase 5 — The decentralized pre-IPO market (founder thesis)

The endgame the deed registry builds toward: a **decentralized market that
prices private companies before they have public value.** The mall is the
instrument — every tenant generates continuous, verifiable commercial signal
(traffic, GMV, quote-to-order conversion, repeat rate, payout history). Deed
and storefront-equity trading against that signal becomes a live price-discovery
mechanism for pre-IPO companies: the market caps a business on its *observed
commerce*, not on pitch decks.

How it layers (each stream of signal feeds the next):
1. **Commerce layer (v1):** real orders/quotes produce ground-truth revenue data.
2. **Occupancy layer (Phase 4):** deed values capitalize location + traffic.
3. **Equity layer (Phase 5):** tenants optionally tokenize a storefront-equity
   slice; the decentralized market prices it continuously against layers 1–2.

**Honesty gates (non-negotiable):**
- This is a *founder hypothesis* to be validated quantitatively against real
  mall data — the pricing model must be specified, backtested, and documented
  on its own merits before any external claim is made about it.
- Tokenized pre-IPO equity is a regulated securities activity in essentially
  every jurisdiction. **Phase 5 does not ship — and is not pitched as a product —
  before securities counsel signs off on the structure** (Reg CF/Reg A/Reg D or
  equivalent, transfer restrictions, accreditation, disclosures).
- It inherits the §1.1 rule: none of this is ever visible to buyers; it is a
  tenant/investor surface.

### Invariants that survive the sequencing
- Crypto is always *additive*, never *required*. Any buyer transacts entirely in fiat, forever.
- "Tokens / NFTs / Deeds" vocabulary stays tenant/admin-side even after launch — buyers see "Storefront Unit," "ownership," "upgrade."
- No claim about the pricing model leaves the building without the math and the legal opinion behind it.

---

## 11. System architecture

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

### 11.1 Deployment decision: Netlify vs Cloudflare

**Decision: hybrid. Keep Netlify for the frontend. Build the agent/API layer on Cloudflare.**

Why this is the right call:

- The frontend is a static SPA already live on Netlify. Migrating it buys nothing and risks the thing that's working. Netlify is excellent at exactly this.
- The agent layer is the opposite shape: **long-lived, stateful, real-time**. Cloudflare's Agents SDK + Durable Objects is purpose-built for it — each buyer conversation, assisted cart, and quote negotiation is a Durable Object with its own state, WebSocket hibernation (cheap idle agents), scheduled follow-ups (cart recovery, order follow-up), and global low latency. Netlify Functions are stateless and short-lived; building persistent agents there means fighting the platform.
- Cloudflare Workflows gives durable multi-step execution for quote lifecycles and multi-vendor order routing (steps survive failures/retries) — this is the backbone of white-glove reliability.
- **Consolidation path:** if operating two platforms ever becomes friction, the SPA moves to Cloudflare Workers static assets in an afternoon (it's a `dist/` folder). The reverse — moving stateful agents off Cloudflare — would be a rewrite. So this hybrid has a one-way cheap exit, which is the safe architecture.

### 11.2 Agent roster (Cloudflare Agents SDK, Claude-powered)

**Surface rule first:** all of these hide behind the single GrahmOS Concierge
surface (§4). The roster is architecture, not UI.

| Agent | Durable Object scope | Responsibilities |
|---|---|---|
| **GrahmOS Concierge** | per visitor session | The one visible agent: greeting, navigation, intent routing to specialists |
| **Product Match** | per search session | NL product discovery, alternatives, "no dead ends" |
| **B2B Sourcing** | per sourcing request | Route demand to vendors/channel partners, track responses |
| **Quote** | per quote | Quote lifecycle: draft → priced → accepted → order |
| **Cart / Checkout** | per cart | Assisted carts (open/edit with permission), checkout help, recovery via scheduled wake-ups |
| **Tenant Onboarding** | per applicant | White-glove storefront setup, lease/rent/own guidance |
| **Channel Partner** | per partner | Catalog ingestion, availability confirmation, SLA tracking |
| **Order Support** | per order | Tracking, returns, exceptions, proactive follow-up |
| **VIP / Leasing** | per company account | Anchor-tenant sales, ownership upgrades, net terms — human-in-the-loop required |

Every agent action writes to Postgres (audit) and mirrors to Airtable (staff queue). Human agents take over any conversation through the same Durable Object — the buyer never sees a seam. High-stakes actions (discounts above threshold, deed transfers, net-terms approval) require human approval, enforced in the Worker, not the prompt.

### 11.3 Payments — the exchange-partner escrow model

**Organizing rule: GrahmOS never touches custody.** Crypto is purely an
exchange integration through licensed partners; escrow is held by the partner;
the GrahmOS workflow agent (the "agent middleman") only sends release/refund
instructions via API. This keeps the platform out of the flow of funds — no
money-transmitter licenses, no BitLicense, no key custody.

**The agent-middleman escrow loop (every rail implements it):**
```
buyer pays → partner HOLDS (escrow) → GrahmOS agent verifies condition
(delivery / quote fulfilled / inspection passed) → agent calls RELEASE
(payout to tenant) or REFUND (back to buyer) → audit row in Postgres
```

- **v1 / Phase 1–2 — Stripe Connect (fiat + crypto-in, one partner):**
  Connected accounts per tenant; **manual payouts** = the escrow hold (funds
  sit in the tenant's connected balance until the agent releases). Crypto rail
  via **Stripe Stablecoin Payments**: buyers pay USDC (Ethereum/Solana/
  Polygon/Base), Stripe converts and settles **USD** into the same balance —
  GrahmOS never sees the crypto, refunds return to the buyer's wallet.
  Agent calls: `PaymentIntent.create` → verify → `payouts.create` / `refunds.create`.
- **Phase 2+ — Escrow.com API for high-value deals** (storefront-unit/deed
  sales, anchor leases): a licensed internet escrow agent with milestone
  create → agree → ship → inspect → release/refund endpoints and webhooks.
  Zero licensing burden; built for big-ticket, not checkout.
- **Phase 3 — international tenant payouts (optional):** Airwallex
  Payments-for-Platforms as an additional layer — its Holding Account +
  split-release API is a true agent-released escrow primitive and pays out to
  150+ countries. **Note (researched):** Airwallex is fiat-only — no crypto
  exchange or on/off-ramp — so it cannot be the crypto partner; it is a
  global-payouts add-on, redundant with Stripe for a US-first launch.
- **Phase 4–5 — native on-chain escrow (only with tokenized equity, §10):**
  Circle Developer-Controlled Wallets + a USDC escrow smart contract (Circle
  publishes an agent-released escrow reference, `circlefin/arc-escrow`) with
  the GrahmOS agent as release-approver — gated on custody counsel.
  Deed registry and resale per §10; the scaffold's wallet modal stays hidden
  until then.

**Regulatory posture:** the licensed partner (Stripe / Escrow.com / Airwallex
/ Circle) is always the regulated money transmitter or escrow agent of
record; GrahmOS relies on partner-of-record + agent-of-payee structures and
never receives or controls customer funds. Re-verify per state with counsel
before Phase 3+.

### 11.4 Data model (extends `db/schema.sql`)
Keep existing tables; add: `storefronts` (tenancy tier, unit location/aisle, lease terms, deed token id, `platform` + `shopifyDomain` + Shopify access scopes per §8), `companies`, `channel_partners`, `pricing_rules`, `carts` + `cart_events`, `quotes` + `quote_items`, `sourcing_requests`, `agent_tasks`, `agent_conversations`, `rewards_ledger`, `analytics_events`, `routes` (Directions Mode route cards: intent, steps, completion state), `deeds` (token id, owner, unit, royalty terms — Phase 4). Mirror the staff-workflow subset to Airtable.

---

## 12. Build phases

### Phase 0 — Foundation (week 1–2)
Componentize the scaffold (extract Card, Button, Modal, Table, EmptyState from existing pages into `src/components/ui/`), add role-based auth shell, stand up Cloudflare Worker project + Neon connection, seed Postgres from `schema.sql` + extensions, replace `mock.ts` reads with API calls behind a feature flag.

### Phase 1 — The BNY Mall opens (week 3–6) · *this is MVP v1 (§7)*
Atrium, Aisles, Storefront pages (CollectionPage repurposed), Product pages, search, cart + Stripe checkout, request quote, buyer dashboard, Tenant Studio v1 (products, inventory, orders), Agent Desk light, Airtable ops sync.

### Phase 2 — White glove + Directions Mode (week 7–10)
Cloudflare Agents SDK deployment behind the single Concierge surface: Product Match + Cart specialists live (contextual, non-intrusive entry points), assisted carts, **Directions Mode + Route Card** (§3), Agent Desk for human takeover, cart-recovery scheduling, Airtable agent task queue.

### Phase 3 — B2B engine (week 11–14)
Company accounts + tier pricing, quote engine (full status lifecycle), sourcing-request engine, channel partner portal, multi-vendor order routing via Workflows, net terms / PO checkout, USDC checkout (§10).

### Phase 4 — Real estate (week 15+)
Tenancy tiers productized (rent/lease/own), deed registry on L2, deed market on the Storefront Index, leasing agent + VIP flows, analytics dashboards (GMV by aisle, quote conversion, agent performance, sourcing gaps), governance for deed owners. All of §10 lands here.

*The 20 prompt-by-prompt build specs from the founding document map onto these phases: Prompts 1–3 → Phase 0; 4–11 → Phase 1; 14–15 → Phase 2; 8 (agent parts), 12–13, 16–18 → Phase 3; 19–20 → Phase 4 close-out. Each prompt keeps its "do not redesign the visual system" constraint.*

---

## 13. Non-negotiables

1. **Enterprise complexity is never visible to consumers.** The main organizing principle (§1.1). Role reveal only; buyers never see "Tokens," "NFTs," "Deeds," or agent plumbing in v1.
2. The existing design system is the visual authority. Every new surface reuses extracted components.
3. **One visible agent.** Many agents architecturally; one voice, one surface — GrahmOS Concierge (§4).
4. Payments, auth, and deeds live in Postgres/Stripe/chain — never Airtable.
5. Every agent action is audited and human-overridable; money-moving actions gate on human approval.
6. No dead ends: empty search/results always offer concierge help or a sourcing request.
7. Crypto is additive, never required — any buyer can transact entirely in fiat (and in v1, crypto isn't even visible).

---

## 14. Open questions

- L2 choice for deed registry (Base vs Arbitrum vs Polygon) — defer to Phase 4 spike.
- Human agent staffing model at launch (founder-operated concierge is fine for the BNY pilot).
- First anchor tenants — pilot catalogs (`pilot-product-catalog*.jsonl`) confirm the BNY vertical; lock the launch aisle mix across the eight v1 aisles (§2).
- Pricing for rent/lease tiers — validate against pilot tenant conversations.
- Directions Mode clarifying-question budget — is 1–2 questions enough for B2B sourcing intents, or does Quote-flow handoff need to happen earlier?
