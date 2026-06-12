# Shopify Integration — Best-Practices Review

**Date:** 2026-06-12
**Scope:** `netlify/functions/shopify-catalog.ts`, `netlify/functions/_shopify-snapshot.ts` (generated), `scripts/sync-shopify-snapshot.mjs`, `.github/workflows/shopify-sync.yml`, `src/pages/AisleDetailPage.tsx` (inline `ShopifyCatalogStrip`), `src/lib/api.ts`.

> Note: there is no standalone `src/components/grahmos/ShopifyCatalogStrip.tsx`. The component lives inline in `src/pages/AisleDetailPage.tsx:9-18`.

---

## Summary table

| # | Area | Current state | Risk | Recommendation |
|---|------|---------------|------|----------------|
| 1 | API versioning | `2024-10` hardcoded in 3 places | **P0** — past end-of-life (June 2026); Shopify supports versions ~12 months. Requests may already be silently coerced or start failing. | Move to `2026-04` (latest stable as of today; `2025-07` minimum to stay supported through July 2026). Centralize as one constant / env var. |
| 2 | Rate limiting | No 429/`THROTTLED` handling anywhere; non-OK responses silently fall back | P1 | Detect 429 + GraphQL `THROTTLED` errors; retry with exponential backoff (honor `Retry-After`); sequential sync loop helps but is not enough at 50 stores. |
| 3 | Pagination | `products(first: 12)`, no cursor | P2 | Fine for a 12-product rail; document the cap. For full catalogs at multi-store scale, add `pageInfo { hasNextPage endCursor }` cursoring to the sync script. |
| 4 | Caching | Function hits Shopify Storefront API on every request; no `Cache-Control` headers | **P0** (cost/perf at scale) | Add CDN response caching: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=3600` (+ `Netlify-CDN-Cache-Control`). Catalog is public and changes rarely. |
| 5 | Error observability | Bare `catch {}` and silent `!res.ok` fallbacks; client strip also swallows errors | P1 | Structured `console.error` with domain, status, GraphQL `errors[]`; tag fallback source in logs so token expiry / scope problems are visible in Netlify function logs. |
| 6 | Token hygiene | ✅ Env-only (`process.env`, GitHub secrets); no tokens in code or generated snapshot | OK | Confirmed good. Keep Admin token out of the runtime function (it already is — Admin is sync-script only). |
| 7 | Multi-store readiness | Single shared `SHOPIFY_STOREFRONT_API_TOKEN` for all `SHOPIFY_SYNC_DOMAINS` | **P0** (blocks the 50-store roadmap) | Storefront tokens are per-shop. Build a domain→token registry (env-var map for v1, Neon table/secrets store for v2). |
| 8 | Webhooks vs polling | Daily cron + commit-snapshot loop | P2 | Long-term: `products/update` / `products/create` / `products/delete` webhooks → revalidate cache or rewrite snapshot. Keep cron as reconciliation backstop. |

---

## 1. API versioning — `2024-10` is past end-of-life (P0)

Shopify supports each API version for 12 months. `2024-10` was supported through **October 2025**; today is June 2026, so it is **two quarters past EOL**. Shopify routes EOL versions to the oldest supported version, which can change response shapes without warning, and may eventually reject the calls outright.

Hardcoded in three places:

- `netlify/functions/shopify-catalog.ts:103` — `https://${domain}/api/2024-10/graphql.json`
- `scripts/sync-shopify-snapshot.mjs:62` — Storefront endpoint
- `scripts/sync-shopify-snapshot.mjs:82` — Admin endpoint

**Fix:**
- Target **`2026-04`** (latest stable release as of June 2026). At minimum `2025-07` to remain in the supported window.
- Extract a single constant, e.g. `const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-04";` shared by the function and the sync script (or duplicated as one named constant per file), so the next bump is a one-line change.
- Add a calendar/CI reminder: bump quarterly or at least annually. The fields used (`products`, `title`, `featuredImage`, `priceRange.minVariantPrice`, `onlineStoreUrl`, `priceRangeV2`, `featuredMedia.preview.image`) are stable across recent versions, so the bump should be low-risk — but verify `priceRangeV2` on Admin, which newer versions have folded into `priceRange`.

## 2. Rate limiting — no throttle handling (P1)

The Storefront API uses cost-based throttling (and IP-based limiting for unauthenticated-style access); the Admin GraphQL API uses a calculated-cost bucket. Throttled responses arrive either as HTTP 430/429 or as HTTP 200 with `errors: [{ extensions: { code: "THROTTLED" } }]`.

Current behavior:
- `shopify-catalog.ts:111` — any `!res.ok` (including 429) silently falls back to snapshot/demo. Tolerable for UX, but invisible.
- `sync-shopify-snapshot.mjs:70,90` — `!res.ok` throws and **fails the whole sync run**; one throttled store at 50 stores aborts the remaining domains (the loop at `:155-163` has no per-domain error isolation).
- Neither path inspects GraphQL-level `errors[]`, so a `THROTTLED` 200 response is treated as an empty catalog.

**Fix (sync script especially):**
```js
async function fetchWithRetry(url, init, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status !== 430) return res;
    const wait = Number(res.headers.get("retry-after")) * 1000
      || 500 * 2 ** i + Math.random() * 250; // expo backoff + jitter
    await new Promise((r) => setTimeout(r, wait));
  }
  throw new Error(`throttled after ${attempts} attempts: ${url}`);
}
```
- Also check `payload.errors?.some(e => e.extensions?.code === "THROTTLED")` and retry those.
- Wrap the per-domain loop body in try/catch so one failing store doesn't abort the other 49; collect failures and exit non-zero only if *all* fail (or report partial failures distinctly).
- In the runtime function, a single retry is reasonable; beyond that, fall back — but log it (see §5).

## 3. Pagination — `first: 12`, no cursors (P2)

`shopify-catalog.ts:33` and `sync-shopify-snapshot.mjs:38,50` request `products(first: 12)` with no `pageInfo`/`after` handling.

- For the aisle rail UI this is **correct and intentional** — don't over-fetch.
- For the snapshot/sync path at 50 stores, 12 products per store may undersell larger merchants, and there is no way to know a store has more (no `pageInfo { hasNextPage }` in the query).

**Fix:** in the sync script, add cursor pagination capped at a sane limit (e.g. 50–100 products/store, `first: 50` per page using `pageInfo { hasNextPage endCursor }`), and keep the runtime rail at 12. Make the per-store cap configurable when stores grow.

## 4. Caching — every request hits Shopify (P0 at scale)

`shopify-catalog.ts:89-133` performs a live Storefront API call per incoming request and returns `json(...)` with no cache headers (`_auth.ts`'s `json()` presumably sets only `content-type`). A public catalog endpoint behind a CDN is the textbook case for response caching:

- Wasted Storefront API quota (and risk of §2 throttling) under traffic.
- Added p95 latency (~200–600 ms Shopify round trip) on every page view of an aisle.
- 50 stores × N visitors multiplies this linearly.

**Fix:** add headers to the catalog response, e.g.:

```ts
return json(
  { source: "shopify", products },
  200,
  {
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    "Netlify-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    "Netlify-Vary": "query=domain",
  }
);
```

- `Netlify-Vary: query=domain` is required so the CDN keys the cache per store domain.
- Snapshot/demo responses can cache even longer (`s-maxage=3600`) since they only change on deploy.
- This alone removes most live Shopify calls and is the cheapest scale win available.

## 5. Error observability — silent failures (P1)

Three layers of swallowed errors mean a revoked/expired token or missing scope produces **no signal anywhere** — the site just quietly degrades to stale snapshot or demo data:

- `shopify-catalog.ts:111` — `if (!res.ok) return syncedCatalog(...)` — status code discarded.
- `shopify-catalog.ts:117` — missing `edges` (e.g. GraphQL `errors[]`, including `ACCESS_DENIED`/`THROTTLED`) discarded.
- `shopify-catalog.ts:130-132` — bare `catch { ... }` — exception discarded.
- `src/pages/AisleDetailPage.tsx:16` — client `.catch(() => {})` — fine for UI, but it means the server log is the only place this can surface, and currently it doesn't.

**Fix:** keep the fallbacks (good resilience design) but log before falling back:

```ts
console.error(JSON.stringify({
  fn: "shopify-catalog", domain,
  event: "storefront_api_failed",
  status: res.status,
  errors: payload?.errors?.map(e => e.extensions?.code),
  fallback: snapshotHit ? "shopify-sync" : "demo",
}));
```

Structured single-line JSON makes Netlify function logs greppable and lets you alert on `storefront_api_failed`. Also include the `source` actually served in the response (already done — good) so a dashboard can watch the live-vs-fallback ratio.

## 6. Token hygiene — confirmed clean (OK)

- Runtime: `shopify-catalog.ts:99` reads `process.env.SHOPIFY_STOREFRONT_API_TOKEN` only.
- Sync: `sync-shopify-snapshot.mjs:33-34` reads env; workflow injects from GitHub secrets (`shopify-sync.yml:44-45`).
- Generated snapshot (`_shopify-snapshot.ts`) contains only public product data — no tokens leak into the committed artifact.
- The Admin token is used **only** in the CI sync script, never in the deployed function — correct separation (Admin tokens must never be reachable from request-handling code paths).
- Minor: tokens are passed as plain env to a step that runs arbitrary script output through `$GITHUB_OUTPUT` — fine as-is; just never `echo` the token in the workflow.

No findings. ✅

## 7. Multi-store readiness — shared token won't scale (P0 for roadmap)

Storefront API tokens are **issued per shop** by a custom/headless app installed on that shop. The current design — one `SHOPIFY_STOREFRONT_API_TOKEN` applied to every domain in `SHOPIFY_SYNC_DOMAINS` (`sync-shopify-snapshot.mjs:28-34`, `shopify-catalog.ts:99`) — only authenticates against the single store that issued it. The moment a second domain is added to `SHOPIFY_SYNC_DOMAINS`, calls to it will 401, and per §5 that failure is currently invisible.

The code comment at `shopify-catalog.ts:16-17` already acknowledges this ("per-storefront tokens land later via Neon").

**Recommended registry shape (v1, env-only):**

```ts
// domain → token env var, e.g.
// SHOPIFY_TOKEN__GRAHMOS_MARKETBNY_MYSHOPIFY_COM=shpat_...
function tokenForDomain(domain: string): string | undefined {
  const key = "SHOPIFY_TOKEN__" + domain.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  return process.env[key] ?? process.env.SHOPIFY_STOREFRONT_API_TOKEN; // shared fallback
}
```

**v2 (50 stores):** a Neon table `shopify_stores(domain text pk, storefront_token text, api_version text, status text, last_sync timestamptz)` with tokens encrypted at rest (or token references into a secrets store), loaded by both the function and the sync script. Env vars stop being manageable past ~10 stores, and Netlify env vars have size/count limits.

Apply the same mapping in the sync script's domain loop so each domain is fetched with its own token.

## 8. Webhooks over daily polling (P2, long-term)

The daily cron (`shopify-sync.yml:19-20`) + commit + redeploy loop works, but:

- Up to 24h staleness on price/availability changes.
- Each change burns a full CI run + Netlify deploy.
- At 50 stores, every store's change redeploys the whole site.

**Recommended path:** register `products/update`, `products/create`, `products/delete` webhooks per store (HMAC-verified via `X-Shopify-Hmac-Sha256` against the app secret) pointing at a Netlify function, which either:

1. **Purges the CDN cache** for that domain's `/api/shopify/catalog` response (pairs with §4 — webhook = cache invalidation, live API = source of truth), or
2. Writes the updated catalog to Netlify Blobs / Neon, replacing the committed snapshot file entirely (cleaner than generated-code commits).

Keep the daily cron as a reconciliation backstop (webhooks can be missed; Shopify removes webhook subscriptions if the endpoint fails repeatedly). This also eliminates the slightly awkward "bot commits generated TS into the repo and dispatches deploy" pattern (`shopify-sync.yml:59-79`).

---

## Prioritized fix list

### P0 — would break or degrade production
1. **Bump API version off EOL `2024-10` → `2026-04`** — `netlify/functions/shopify-catalog.ts:103`, `scripts/sync-shopify-snapshot.mjs:62`, `scripts/sync-shopify-snapshot.mjs:82`. Centralize in one constant/env var. (§1)
2. **Add CDN cache headers to the catalog function** — `netlify/functions/shopify-catalog.ts:71,86,129` (`json()` call sites): `Cache-Control` + `Netlify-CDN-Cache-Control` with `stale-while-revalidate`, plus `Netlify-Vary: query=domain`. Removes per-request Shopify calls. (§4)
3. **Per-store Storefront tokens** — `netlify/functions/shopify-catalog.ts:99` and `scripts/sync-shopify-snapshot.mjs:33,61-66`: domain→token lookup (env-map now, Neon registry at scale). The shared token 401s on any second store, and that failure is currently silent. (§7)

### P1 — reliability and operability
4. **Structured error logging before every fallback** — `netlify/functions/shopify-catalog.ts:111,117,130`; log status code, GraphQL error codes, and which fallback served. (§5)
5. **429/THROTTLED retry with exponential backoff + jitter** — `scripts/sync-shopify-snapshot.mjs:62-70,82-90`; also inspect GraphQL `errors[]`. (§2)
6. **Per-domain error isolation in the sync loop** — `scripts/sync-shopify-snapshot.mjs:155-163`: try/catch per domain so one throttled/broken store doesn't abort the other 49. (§2)

### P2 — scale and long-term architecture
7. **Cursor pagination in the sync script** — `scripts/sync-shopify-snapshot.mjs:36-58`: `pageInfo { hasNextPage endCursor }`, configurable per-store cap; keep the runtime rail at 12. (§3)
8. **Webhook-driven sync** (`products/update` etc. + HMAC verification) replacing daily polling; keep cron as reconciliation. Store catalogs in Blobs/Neon instead of committing generated TS. (§8)
9. **Verify `priceRangeV2` on the Admin query** when bumping versions — newer Admin API versions consolidate it into `priceRange` — `scripts/sync-shopify-snapshot.mjs:54`. (§1)
