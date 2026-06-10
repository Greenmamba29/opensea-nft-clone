# ARCHITECTURE.md — Component Breakdown

> A full, component-isolated breakdown of the GrahmOS build. Each component is documented
> as: **Responsibility · Interface · Dependencies · Invariants · Extension points.**
> The goal: any change is local, predictable, and fast — you touch one box, not the graph.

---

## 0. First principles (the rules the whole system obeys)

1. **Dependency direction points inward.** UI → API client → Functions → data/services.
   Nothing inner imports anything outer. The design system depends on *nothing* app-specific.
2. **One concern, one owner.** Each fact (model id, system prompt, role logic, a domain
   type) lives in exactly one file. Duplication is a bug.
3. **Boundaries are typed.** `_data.ts` is the single schema; client and server both
   derive from it. The wire format is the contract.
4. **Everything degrades.** No key ⇒ demo mode, not a crash. Every leaf has a fallback.
5. **The platform is the boundary.** Static SPA on the CDN; all logic in Functions under
   `/api/*`. There is no third place for code to hide.
6. **Reversibility.** Netlify-now / Cloudflare-later is a one-way cheap exit (SPA moves in
   an afternoon; stateful agents would not move back). Choose the cheap-exit architecture.

```
                    ┌────────────────────────────────────────────┐
   inward ◀─────────│  src/components/ui  (pure design system)    │
                    └────────────────────────────────────────────┘
                                   ▲
        ┌──────────────────────────┼──────────────────────────┐
        │  src/pages, src/components/grahmos  (feature surfaces) │
        └──────────────────────────┼──────────────────────────┘
                                   ▼  src/lib/api.ts (typed client)
        ┌──────────────────────────────────────────────────────┐
        │  netlify/functions/*  (API: auth, concierge, data)    │
        └──────────────────────────┼──────────────────────────┘
                                   ▼
        ┌──────────────────────────────────────────────────────┐
        │  services: WorkOS · Claude · (Neon · Airtable · CF)   │
        └──────────────────────────────────────────────────────┘
```

---

## 1. Composition root — `src/main.tsx`

- **Responsibility:** Wire the tree once. Provider → Router → Routes. No logic.
- **Interface:** Mounts `<AuthProvider><BrowserRouter><Routes/></BrowserRouter></AuthProvider>`.
- **Dependencies:** every page (lazy candidates), `AuthProvider`, `ProtectedRoute`.
- **Invariants:** `/` = landing, `/os` = role-gated dashboard, `/mall/*` = legacy mall,
  `*` → redirect to `/`. Routing is declared *here only*.
- **Extension:** add a route = one `<Route>` line; gate it by wrapping in `ProtectedRoute`.

## 2. Identity — `src/auth/`

The only component allowed to know *who* the user is.

| File | Responsibility |
|---|---|
| `auth-context.ts` | Types (`GrahmOSUser`, `GrahmOSRole`), `useGrahmOSAuth()` hook, `deriveRole()`, the `AUTH_ENABLED` flag. The contract. |
| `AuthProvider.tsx` | Two implementations behind one context: **WorkOSBridge** (real AuthKit) and **DemoProvider** (localStorage). Picks by `VITE_WORKOS_CLIENT_ID`. Wires the API token getter. |
| `ProtectedRoute.tsx` | Gate by auth + role; renders an inline sign-in prompt, never a hard redirect. |

- **Interface (out):** `useGrahmOSAuth() → { user, isLoading, demoMode, signIn, signUp, signOut, getAccessToken }`.
- **Invariants:** The rest of the app **never** imports `@workos-inc/*` — only `useGrahmOSAuth`.
  Swapping auth providers touches *only* this folder. Demo mode is always available.
- **Extension:** new role → extend `GrahmOSRole` + `deriveRole`; new gate → `roles={[...]}`.

## 3. Typed API client — `src/lib/api.ts`

- **Responsibility:** The single door from browser to `/api/*`. Attaches the WorkOS bearer
  token (via an injected `tokenGetter`, wired by `AuthProvider`), throws typed errors,
  returns typed JSON.
- **Interface:** `api<T>(path, opts)`, `askConcierge(messages, surface)`, `setTokenGetter()`.
- **Invariants:** No component calls `fetch('/api/...')` directly — always through here.
  Auth is transparent to callers.
- **Extension:** new endpoint → one typed function here mirroring the function's shape.

## 4. Design system — `src/components/ui/` + theme

- **Responsibility:** Pure, token-driven primitives. Zero app knowledge.
- **Interface:** `Button, Card(+parts), Badge, Table(+parts), Switch, Progress, Avatar`.
- **Dependencies:** `cn()` (`src/lib/utils.ts`), CVA, Tailwind tokens. Nothing else.
- **Invariants:** Semantic tokens only; no feature logic; CVA variants over boolean props.
- **Extension:** missing primitive → add *here*, themed. Never inline a one-off. (See `design.md`.)

## 5. Feature surfaces

### 5a. Landing — `src/pages/grahmos/LandingPage.tsx`
- **Responsibility:** Conversion. The marketing site + plan selection + concierge entry.
- **Dependencies:** `ui/`, `MallHero` (Remotion), `Reveal`, `Concierge`, `useGrahmOSAuth`.
- **Invariants:** GrahmOS light theme; all sections inherit `ui/`; auth-aware CTAs.

### 5b. Mall OS — `src/pages/grahmos/MallOSPage.tsx`
- **Responsibility:** Operator console — KPIs, charts, tenant queue, agent queue, zoning.
- **Dependencies:** `ui/`, recharts, `useGrahmOSAuth`; (will read `/api/mall/overview`).
- **Invariants:** Role-gated (`operator`/`agent`); recharts for all viz; one grid grammar.

### 5c. Concierge — `src/components/grahmos/Concierge.tsx`
- **Responsibility:** The visible white-glove agent. Chat UI + suggested prompts.
- **Interface:** `<Concierge surface="landing|mall" />`. Calls `askConcierge()`.
- **Invariants:** Non-intrusive, floating, never blocks; degrades to a helpful message on
  error (no dead end). Brain lives server-side (`agents.md`).

### 5d. Motion — `MallHero.tsx`, `Reveal.tsx`
- **Responsibility:** The hero composition (Remotion) and scroll-reveal primitive.
- **Invariants:** Self-contained; motion is meaningful (a storefront demo), not noise.

### 5e. Legacy mall — `src/pages/*` (non-grahmos) + `src/components/Layout.tsx`
- **Responsibility:** The shopping scaffold under `/mall/*`. Dark theme. Mounts Concierge.
- **Invariants:** Isolated under the `/mall` prefix; will migrate to GrahmOS light over time.

## 6. API layer — `netlify/functions/`

Stateless HTTP, one file per capability, `config.path` declares the route.

| Function | Route | Responsibility | Gate |
|---|---|---|---|
| `concierge.ts` | `POST /api/concierge` | The agent (Claude + canned fallback) | open (richer when authed) |
| `mall-overview.ts` | `GET /api/mall/overview` | Dashboard KPIs | operator/agent |
| `storefronts.ts` | `GET/POST /api/storefronts` | List / apply storefront | authed |
| `quotes.ts` | `GET/POST /api/quotes` | B2B quote engine | authed |
| `_auth.ts` | — (helper) | WorkOS JWT verify via JWKS (`jose`); demo bypass | — |
| `_data.ts` | — (helper) | Domain data + the canonical types | — |

- **Invariants:** Underscore = not a route. Every route calls `authenticate()` first.
  Money-moving actions gate on a human (see `agents.md` §5). `_data.ts` is the schema —
  swap its internals for Neon/Airtable without changing any signature.
- **Extension:** new capability = new `*.ts` with `export const config = { path }`,
  importing `_auth`/`_data`.

## 7. Data & domain — `_data.ts` (now) → Neon Postgres (planned)

- **Responsibility:** System of record. Today: typed mock data. Target: `db/schema.sql`
  on Neon (marketplaces, suppliers, products, buyers, rfqs, orders + storefronts, quotes,
  deeds, agent_tasks, ...).
- **Invariants:** Postgres owns money, auth-adjacent data, and deeds. **Airtable never
  does** — it is the staff *ops mirror* only. The function signatures are the seam; the
  storage swap is invisible to callers.

## 8. Delivery — build, CI/CD, config

| Concern | Owner |
|---|---|
| Build | `vite.config.ts` (+ `@netlify/vite-plugin`), `tailwind.config.ts`, `tsconfig.json` |
| Hosting + Functions | `netlify.toml` (publish `dist`, functions dir, SPA redirect) |
| **Autodeploy** | `.github/workflows/deploy.yml` — push to `master` → build → `netlify deploy --prod` |
| Secrets | GitHub repo secrets `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`; runtime env in Netlify |
| Local env | `.env.example` (demo-mode defaults documented) |

- **Invariant:** One deploy path. CI builds and ships; no manual prod deploys in steady state.

## 9. The planned outer ring (Phase 2–4) — where it plugs in

| Addition | Plugs into | Boundary kept stable |
|---|---|---|
| Cloudflare Agents (Durable Objects, Workflows) | behind `/api/*` or a sibling Worker | the concierge contract in `api.ts` |
| Neon Postgres | behind `_data.ts` | function signatures |
| Airtable ops mirror | async from functions | never on the read path for money/auth |
| Stripe | new `/api/checkout` function | typed like every other route |
| Deed registry (L2 NFT) | new function + the existing wallet modal | crypto stays additive |

Because every seam is typed and every concern has one owner, each addition is a *new box*,
not a rewrite. That is the whole point.

---

## 10. Change-cost summary (why this is fast)

| To change… | You touch | You do NOT touch |
|---|---|---|
| The brand colors | `globals.css` tokens | any component |
| The agent's voice | `concierge.ts` `SYSTEM` | the UI |
| The auth provider | `src/auth/` | the whole app |
| The data store | `_data.ts` internals | any function signature |
| A new role/gate | `auth-context.ts` + one `ProtectedRoute` | other routes |
| A new capability | the 6-step recipe in `skills.md` | everything else |
