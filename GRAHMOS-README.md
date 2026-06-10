# GrahmOS — White-Glove Virtual Mall

A premium virtual mall and digital leasing platform where businesses, buyers,
sellers, and channel partners transact through AI + human-assisted commerce
agents. Built on the OpenSea-style scaffold, themed to the GrahmOS brand.

## Routes

| Path | What it is | Auth |
|------|-----------|------|
| `/` | **GrahmOS landing** — marketing site with a Remotion-animated mall hero, storefront plans, aisles, live Concierge | public |
| `/os` | **GrahmOS Mall OS** — operator dashboard (occupancy, GMV, leases, tenant applications, agent queue, zoning map) | operator/agent |
| `/mall` + `/mall/*` | The shopping experience (legacy dark scaffold) with the Concierge mounted | public |

## Stack

- **Frontend:** Vite + React 18 + Tailwind 3, shadcn-style UI in `src/components/ui/`, recharts dashboards, Remotion (`@remotion/player`) for the animated hero.
- **Auth:** WorkOS AuthKit (`@workos-inc/authkit-react`) via `src/auth/`. Unified `useGrahmOSAuth()` hook; graceful **demo mode** when no `VITE_WORKOS_CLIENT_ID` is set. Role gating (`buyer`/`seller`/`channel_partner`/`agent`/`operator`).
- **Backend:** Netlify Functions (`netlify/functions/`), exposed under `/api/*` via the `@netlify/vite-plugin` (works under plain `npm run dev`). WorkOS access tokens verified server-side against JWKS (`jose`).
- **Agent layer:** `/api/concierge` is powered by Claude (`claude-opus-4-8`) with a deterministic canned fallback so the white-glove widget always responds.

## API

| Function | Path | Notes |
|----------|------|-------|
| `concierge.ts` | `POST /api/concierge` | White-glove agent (Claude + fallback) |
| `mall-overview.ts` | `GET /api/mall/overview` | Dashboard KPIs (operator/agent only) |
| `storefronts.ts` | `GET/POST /api/storefronts` | List / apply for a storefront |
| `quotes.ts` | `GET/POST /api/quotes` | B2B quote engine |

`_auth.ts` (token verification) and `_data.ts` (domain data — swap for Neon/Airtable) are shared helpers.

## Run locally

```bash
npm install
cp .env.example .env   # optional — app runs in demo mode without keys
npm run dev            # Netlify primitives (functions) available via the Vite plugin
```

Without keys: auth is demo mode (click **Enter Demo (Operator)** to reach `/os`), and the concierge returns curated canned replies. Add `VITE_WORKOS_CLIENT_ID` + `ANTHROPIC_API_KEY` to go live.

## Deploy (Netlify)

`netlify.toml` is configured: build `npm run build`, publish `dist`, functions in `netlify/functions`, SPA fallback redirect. Set the env vars from `.env.example` in the Netlify dashboard. Add your deploy origin to AuthKit's allowed redirect URIs.

## Next

See `PRD-VIRTUAL-MALL.md` for the full vision (rent/lease/own tenancy tiers, tokenized storefront deeds, Cloudflare Agents layer, Neon system-of-record). This build delivers Phase 0–1 + the white-glove agent entry point and the operator console.
