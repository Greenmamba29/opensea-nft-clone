# PROGRESS.md — GrahmOS Living Build Tracker

> **The single source of truth for build status.** Every work session (human or
> agent) reads this first, works the topmost unfinished item, and updates the
> status + log before stopping. Statuses: ✅ done · 🔶 in progress · ⬜ next · 🧊 later.
>
> Prod: **https://grahmos-virtual-mall.netlify.app** · Deploy: push to `master`
> (GitHub Actions). Conventions: `skills.md` §6 recipe, `ARCHITECTURE.md`,
> `agents.md` invariants, `soul.md` voice. Plan of record: `PRD-VIRTUAL-MALL.md` v2.

---

## ✅ Shipped (verified in prod)

| Item | Where | Commit |
|---|---|---|
| GrahmOS rebrand (ex-Accio), site renamed | repo-wide + Netlify | 916c76c |
| Landing (buyer-first, intent hero), Mall shell (Atrium/Aisles/Stores/Products/Quotes/Orders) | `src/pages/*`, `src/components/grahmos/` | 916c76c |
| Directions Mode (route engine + map + RouteCard) | `src/lib/routeEngine.ts`, `DirectionsPage` | eac8132 |
| Grandmother guide personas (picker, orb, concierge skin) | `src/lib/grandmothers.ts` | cd38873 |
| Concierge on real Claude (`claude-opus-4-8`, canned fallback) | `netlify/functions/concierge.ts` | a54cc98+ |
| WorkOS auth shell + demo mode, fail-closed prod | `src/auth/`, `_auth.ts` | fd23be3, 02ccd0b |
| Netlify Postgres persistence (applications, quotes) | `_db.ts` + migrations | eac8132 |
| Shopify-integrated storefronts (catalog API + snapshot sync) | `shopify-catalog.ts`, `_shopify-snapshot.ts` | 55bd2ed, bee6ac7 |
| Code split (231KB main), Remotion removed | `main.tsx` lazy routes | 6286c9b |
| Deep review: 5-agent scan of ~180 buttons → fixes (privilege-escalation closed, honest UI, dead code deleted) | `V2-FOUNDATION.md`, `.claude/scan-findings.txt` | 02ccd0b |
| Immersive zoom-into-page transitions (click-origin, reduced-motion aware) | `PageTransition.tsx` | 02ccd0b |
| **Escrow engine (PRD §11.3)**: Stripe fiat+USDC rails, Escrow.com adapter, hold→release/refund state machine, Escrow Desk in Mall OS, Buy buttons, webhook | `_escrow.ts`, `checkout.ts`, `escrow.ts`, `stripe-webhook.ts`, `EscrowDesk.tsx` | f5ad930 |
| Governance + historic-reference skill, escrow research | `GRAHMOS-GOVERNANCE.md`, `.claude/skills/` | b64fbf1 |

## 🔶 In progress / blocked on keys

| Item | Status | What unblocks it |
|---|---|---|
| Escrow live mode (Stripe) | Code done, demo provider active | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` in Netlify env; enable crypto payment method in Stripe dashboard for USDC rail |
| Escrow.com high-value rail | Adapter done | `ESCROW_COM_EMAIL` + `ESCROW_COM_API_KEY` (sandbox first) |
| Shopify live catalog | Snapshot sync live; Storefront API ready | User mints Storefront API token → `SHOPIFY_STOREFRONT_API_TOKEN` |
| Real auth | Demo mode active in prod | `VITE_WORKOS_CLIENT_ID` (+ WorkOS role claims for operator) |

## ⬜ Next (V2 backlog, priority order — see V2-FOUNDATION.md)

1. **Product detail + storefront page rebuild.** `/mall/product/:id` and `/mall/collection/:id` still render OpenSea mock (`src/data/mock.ts`) instead of the real product/storefront by id from `mallData.ts`. Wire Buy (→ `/api/checkout`) and Request-a-quote (→ `/mall/quotes` prefilled) on both. This is the core commerce dead-end.
2. **Single source of truth for domain data.** Collapse the triplication: `_data.ts` ↔ `src/lib/mallData.ts` ↔ `FALLBACK_OVERVIEW` in MallOSPage; derive `api.ts` types from one schema module.
3. **Legacy page sweep.** CollectionPage/NFTDetailPage/TokensPage/SettingsPage/SupportPage/RewardsPage are mostly theater (dead filters/tabs/fake toast). Rebuild on mall data or retire routes. Kill `Math.random()` pricing in mock.ts.
4. **Connect transfers.** When tenants onboard Stripe Connect accounts, wire real `transfers.create` on escrow release (today release = ledger mark; refund is real).
5. **Concierge ↔ routeEngine.** Concierge replies start guided routes (chat → Directions Mode).
6. **Directions v2.** Continuous navigation + re-routing; store stops deep-link the specific storefront (needs #1).
7. **Grandma memory server-side** + Airtable ops write-back loop.
8. **Shopify webhooks** (orders → mall Orders page) + tenant store provisioning via Shopify MCP.

## 🧊 Later phases (committed in PRD)

Cloudflare Durable-Object agent roster · deed registry on L2 (crypto stays additive) ·
Circle arc-escrow (Phase 4-5) · Phase 5 decentralized pre-IPO market (hard-gated:
quant validation + securities counsel) · seller/channel-partner portals.

---

## Session log (append newest first)

- **2026-06-18 15:00 (auto-continue, run 3):** SKIPPED commit of the WIP a 3rd time — but this run **audited it** to turn the recurring blocker into a one-decision unblock. `git pull` clean (HEAD `4ed5b75`, prod deployed from `d19c1db`). Confirmed the fresh 14:52 writes to `.remember/` + `research/sourcing/2026-06-18.*` were the **sibling `grahmos-arbitrage-daily` task** (ran clean, no push) — NOT an active code session; the code WIP (cart/payments/pages) is frozen at 06-17 00:21 (~62h stale), so the collision rationale is moot. Read-only audit of the un-authored WIP: ✅ `tsc --noEmit` **and** `npm run build` both exit 0; ✅ no hardcoded secrets (only doc/UI hint strings matched `sk_live_`/`whsec_`); ✅ money-flow endpoints gate correctly — `connect.ts` onboard/tier-change require `requireRole(["operator","agent"])`, `returns.ts` only *flags* the order for the Escrow Desk (refund still human-gated), `orders.ts` is read-only buyer-scoped → **§5.4 invariant intact**; ✅ all 4 migrations purely additive/idempotent (`CREATE TABLE/INDEX … IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, no destructive DDL). ⚠️ **One real violation:** the WIP **reintroduces "Accio"** — 0 occurrences in HEAD, ~20 in the WIP, in two forms: the `grahmos-accio.myshopify.com` backend Shopify domain (`_shopify-snapshot.ts` data + `mallData.ts`/`factoryStores.ts`) and the "Accio Airtable" ops-base naming (new `_airtable.ts` + comments in `agents.md`/`skills.md`/`quotes.ts`/`storefronts.ts`/`_escrow.ts`). Both are backend/infra, not buyer-facing, but the rule is absolute. Did **not** commit the WIP: step-2 guardrail + the Accio violation + cannot functionally smoke-test the money paths without Stripe/Connect keys, and a push auto-deploys to prod **and** auto-applies the 4 migrations (hard to reverse). Prod unchanged at `d19c1db`; re-verified healthy (`GET /` 200, `POST /api/concierge` 200). **Single human action to unblock:** reconcile the Accio refs (rename the Shopify store + Airtable base to a GrahmOS-aligned id, or add an explicit carve-out for backend resource names), then `git add -A && git commit` — the WIP is verified clean on every other axis and is safe to ship once that's done. The routine then resumes backlog #1.
- **2026-06-18 (auto-continue):** SKIPPED again — same dirty tree, now stale. `git pull` clean (up to date at `d19c1db`; `cc12762` is the prior skip log). Working tree still carries the same uncommitted, un-authored WIP as 06-17 (36 modified tracked files + 52 untracked spanning cart/payments/factory-stores/claims/connect/returns/orders functions, 4 migrations, 3 skills, `tests/`). Newest edit timestamp is **2026-06-17 00:21**, i.e. untouched for ~38h — no longer an active session, but I did not author it and can't vouch it builds, so committing it could ship half-finished code. Nothing was pushed, so prod = `d19c1db`; verified healthy: `GET /` → 200, `POST /api/concierge` → 200. **Action needed from a human:** review and either commit or `git stash`/discard this WIP so the routine can resume backlog item #1 (Product detail + storefront rebuild). The autonomous routine cannot safely proceed while this collision stands.
- **2026-06-17 (auto-continue):** SKIPPED to avoid collision. Working tree was dirty with extensive uncommitted in-progress work I did not author — 36 modified tracked files (+1932/−741) and 52 untracked files spanning new subsystems (cart, payments, factory-stores, claims, connect, returns, orders functions; 4 DB migrations under `netlify/database/migrations/`; `store-factory`/`run-skill-generator`/`deploy-store` skills; `tests/`). Files were written as recently as 12:21 AM today, indicating active work in another session. `.remember/remember.md` was empty (no handoff). Per the routine's collision rule, did not pick a backlog item or commit anything beyond this log line. Next run should re-check `git status`: if that work has been committed, resume with backlog item #1 (Product detail + storefront page rebuild).
- **2026-06-11 (session 5):** Escrow engine shipped + verified in prod (f5ad930). Deep-review V2 fixes + zoom transitions (02ccd0b). This tracker created; 5-hour auto-continue routine scheduled.
- **2026-06-11 (session 4):** Shopify integration (55bd2ed, bee6ac7); governance + escrow research (b64fbf1).
- **2026-06-10 (session 3):** Rebrand → GrahmOS; cohesion overhaul; Directions Mode; grandmothers; perf split.
- **2026-06-10 (session 2):** Neon persistence; auth fail-closed; dashboard wired live; first deploys + CI.
- **2026-06-10 (session 1):** Accio scaffold: landing, Mall OS, WorkOS, concierge, Netlify functions.

## How an automated session should work this file

1. Read this file + `.remember/remember.md`. 2. Pick the topmost ⬜ (or finish a 🔶 if unblocked). 3. Follow `skills.md` §6; verify with `npx tsc --noEmit` + `npm run build` + a browser/API smoke test. 4. Commit with a descriptive message, push (autodeploys), confirm prod healthy. 5. Move the item, append one Session-log line. Never reintroduce "Accio". Money-moving code keeps the human gate (`agents.md` §5.4).
