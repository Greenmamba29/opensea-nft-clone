# skills.md — Engineering Capabilities & Conventions

> The team's "skills": the capability modules of the app, the conventions that keep them
> composable, and the external skills/services the system leans on. Read this before
> writing code so changes stay quick and consistent.

---

## 1. Capability map (what the app can *do*, isolated)

Each capability is a thin slice with a single owner module. Change one without touching
the others.

| Capability | Owner | Surface |
|---|---|---|
| **Identity & roles** | `src/auth/` | gates `/os`, reveals B2B UI |
| **White-glove concierge** | `netlify/functions/concierge.ts` + `Concierge.tsx` | floating agent |
| **Mall operations data** | `netlify/functions/mall-overview.ts` + `_data.ts` | `/os` dashboard |
| **Storefront lifecycle** | `netlify/functions/storefronts.ts` | apply / list tenants |
| **B2B quote engine** | `netlify/functions/quotes.ts` | quote create / price |
| **Design system** | `src/components/ui/` + theme | every surface |
| **Marketing / conversion** | `src/pages/accio/LandingPage.tsx` + `MallHero.tsx` | `/` |
| **Legacy shopping** | `src/pages/*` (non-accio) | `/mall/*` |

## 2. Conventions that make changes fast

- **One concern, one file.** Model id, system prompt, token getter, role derivation —
  each lives in exactly one place. Grep finds it instantly.
- **Semantic tokens over hex.** Re-skin = edit `globals.css`, not 50 components.
- **Functions are the only backend.** All server logic is a Netlify Function under
  `/api/*` (via `@netlify/vite-plugin`, so `npm run dev` runs them too). No hidden
  servers.
- **Shared helpers, never copies.** `_auth.ts` (token verify) and `_data.ts` (domain
  data) are imported by every function. Underscore prefix = not a route.
- **Typed boundaries.** `_data.ts` exports the domain types (`Storefront`, `Quote`, ...);
  the frontend mirrors them via `src/lib/api.ts`. One schema, both sides.
- **Demo-mode everything.** Every capability degrades gracefully with no keys: auth →
  demo operator, concierge → canned, so the app always runs and demos.
- **Role-gate by default.** New non-consumer capability ⇒ wrap in `ProtectedRoute` /
  check `useAccioAuth().user.role`.

## 3. External skills & services the system uses

| Service | Role | Wiring |
|---|---|---|
| **WorkOS AuthKit** | Identity, SSO, sessions | `@workos-inc/authkit-react` (client) + JWKS verify in `_auth.ts` (server) |
| **Claude (Anthropic)** | The agent brain | `@anthropic-ai/sdk`, `claude-opus-4-8` |
| **Netlify** | Frontend host + Functions + Git CI | `netlify.toml`, `@netlify/vite-plugin`, `.github/workflows/deploy.yml` |
| **Remotion** | Hero "video" | `remotion` + `@remotion/player` |
| **recharts** | Dashboard data viz | `MallOSPage.tsx` |
| **Neon Postgres** *(planned)* | System of record | schema in `db/schema.sql` |
| **Airtable** *(planned)* | Staff ops mirror | `src/lib/airtable.ts` stub |
| **Cloudflare** *(planned)* | Stateful agent layer | Durable Objects + Workflows |
| **Stripe / L2** *(planned)* | Payments + deed registry | Phase 3–4 |

## 4. Local dev skills (how to move)

```bash
npm install
npm run dev          # Vite + Netlify Functions (no `netlify dev` wrapper needed)
npx tsc --noEmit     # typecheck frontend
npm run build        # production build (Vite) + functions bundled on deploy
```

Demo mode runs with zero secrets. Add `VITE_WORKOS_CLIENT_ID` + `ANTHROPIC_API_KEY`
(see `.env.example`) to go live. Deploy: push to `master` → GitHub Actions →
Netlify prod (see `ARCHITECTURE.md` → Delivery).

## 5. The Claude-build skills we follow (meta)

When extending the AI features, follow the `claude-api` conventions: official SDK only,
latest Opus by default, model id in one place, structured outputs over prefills,
human gates for money. The agent layer is documented in `agents.md`.

## 6. Adding a capability (the 6-step recipe)

1. **Type it** in `_data.ts` (or a new typed module).
2. **Expose it** as a Netlify Function under `/api/*` with `config.path`.
3. **Gate it** — `authenticate()` + role check.
4. **Client it** — add a typed call in `src/lib/api.ts`.
5. **Surface it** — a `ui/`-composed component, themed, role-revealed.
6. **Degrade it** — a fallback so it works in demo mode.
