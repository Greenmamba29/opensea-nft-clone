# V2 Foundation — Deep Review Findings & Rebuild Plan

> Output of a 5-agent isolated scan of every surface (June 2026) — every button
> classified working / partial / dead, plus an architectural review. This is the
> foundation for Version 2: what's now fixed, and the prioritized rebuild backlog.
> Raw findings: `.claude/scan-findings.txt`.

## Scan coverage
5 parallel agents, 105 tool calls, ~189 interactive elements catalogued across:
landing · new mall pages · legacy scaffold pages · operator dashboard + API · architecture.

| Surface | Buttons | Dead | Partial |
|---|---|---|---|
| Landing | 43 | 1 | 5 |
| Mall (new pages) | 44 | 6 | 6 |
| Mall (legacy scaffold) | 67 | 45 | 9 |
| Dashboard + API | 26 | 17 | 0 |
| **Total** | **~180** | **69** | **20** |

The legacy OpenSea-clone scaffold pages are where ~65% of dead buttons live.

---

## Fixed in this pass (V2.0)

**Security / correctness (was HIGH):**
- **Privilege-escalation closed.** `deriveRole()` (server `_auth.ts` + client `auth-context.ts`) no longer grants `operator` from email text (`+operator`, `@grahmos.market`) under real auth — anyone could register `attacker+operator@…`. The `+tag` heuristic is now **demo-mode only**; real roles must come from a verified WorkOS claim.
- **Dashboard crash guard.** `MallOSPage` mapped live DB `status` through `STATUS_MAP[s.status].label` — an unmapped value (e.g. a DB row set to `approved`) threw and blanked the table. Now falls back gracefully.
- **Honest quote submission.** `QuotesPage` previously faked success on API failure ("saved (demo)") while persisting nothing. Now it records + confirms **only** on a real `201`, and shows a clear error otherwise.

**Dead chrome made real or honest:**
- **Operator dashboard:** sidebar nav now links the items that have destinations (Storefronts→/mall/stores, Quotes→/mall/quotes, Settings→/mall/settings); the rest are marked **"Soon"** (non-interactive, no more `href="#"`). Search box now filters the tenant table + `⌘K` focus; "View All" toggles full/recent; bell + unbuilt panels honestly labeled "Soon".
- **Mall header:** search now routes to `/mall/products?q=…` (+ `K` focus); "Sign in" wired to WorkOS `signIn()` (and flips to "Sign out" when authed) — there was previously *no way to authenticate from the mall*.
- **Footers:** landing + mall footers now link real destinations; placeholder `href="#"` links and the fake USD selector removed.
- **Product identity preserved:** product cards (ProductsPage, AisleDetailPage) route to `/mall/product/:id`, store cards to `/mall/collection/:id`, instead of all opening the same generic page.

**Dead code / hazards removed:**
- Deleted `ConnectWalletModal.tsx` + `OnboardingModal.tsx` (orphaned, imported nowhere).
- Deleted `src/lib/airtable.ts` — a no-op stub that also exported `VITE_AIRTABLE_API_KEY`, i.e. a secret inlined into the public client bundle (per ARCHITECTURE.md §7 Airtable belongs behind functions).

**The headline feature — immersive transitions:**
- `PageTransition.tsx` + `page-zoom-in` keyframes: every route change **zooms into the page from the point you clicked** (origin tracked via pointer position, depth blur + perspective). Wired into the mall `Layout` and the standalone landing/`/os` routes. Respects `prefers-reduced-motion`.

---

## V2 rebuild backlog (prioritized — not yet done)

1. **Product detail + storefront page rebuild (HIGH).** `/mall/product/:id` and `/mall/collection/:id` still render legacy OpenSea mock (`src/data/mock.ts`: "Industrial Pump Model", NFT traits, chains) instead of real `mallData.ts` product/storefront by id. Buy / Request-a-quote CTAs on `CollectionPage`/`NFTDetailPage` are dead. This is the core commerce dead-end. Rebuild both to read by route param from `mallData.ts`, with working "Request a quote" (→ `/mall/quotes` prefilled) and add-to-cart-or-RFQ.
2. **Single source of truth for domain data (HIGH).** Mall data is triplicated and already drifting: `netlify/functions/_data.ts`, `src/lib/mallData.ts`, and an inline `FALLBACK_OVERVIEW` in `MallOSPage`. The client `MallOverview`/`Storefront`/`Quote` types are re-declared in `api.ts` rather than derived from `_data.ts`. Collapse to one schema module the wire boundary derives from.
3. **Legacy page sweep.** `CollectionPage`, `NFTDetailPage`, `TokensPage`, `SettingsPage`, `SupportPage`, `RewardsPage` are mostly theater (filters that filter nothing, tabs that don't change content, a permanently-rendered fake "Saved" toast on Settings, four dead support tiles). Either rebuild on mall data or retire the routes. `mock.ts` uses `Math.random()` at module scope → nondeterministic prices on each load.
4. **Demo-mode split-brain.** Client grants a demo operator session, but prod functions fail closed without `DEMO_MODE` → `/os` renders on sample data and New Quote 401s. Decide per-environment and surface the state.
5. **Directions Mode store stops** route every "Visit \<merchant\>" to the generic `/mall/collection` — should deep-link the specific storefront once #1 lands.

---

## Architecture verdict
The skeleton honors its own rules — routing only in `main.tsx`, auth isolated in `src/auth/`, all fetches through `api.ts`, lazy route splitting. The debt is concentrated in (a) the un-retired OpenSea-clone scaffold and (b) hand-synced data duplication. V2 is mostly *finishing the migration* the rebrand started: move every `/mall/*` page off `mock.ts` onto `mallData.ts`, unify the schema, and make the commerce CTAs real.
