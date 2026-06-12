#!/usr/bin/env node
/**
 * Sync Shopify catalogs into netlify/functions/_shopify-snapshot.ts.
 *
 * The Shopify-store loop: each integrated storefront's live catalog is pulled
 * from Shopify and written into the snapshot module the /api/shopify/catalog
 * endpoint serves when no Storefront token is configured at runtime. Run by
 * .github/workflows/shopify-sync.yml on a schedule, or locally:
 *
 *   SHOPIFY_STOREFRONT_API_TOKEN=...  node scripts/sync-shopify-snapshot.mjs
 *   SHOPIFY_ADMIN_API_TOKEN=...      node scripts/sync-shopify-snapshot.mjs
 *
 * Token preference: Storefront API token first (public catalog scope), Admin
 * API token as fallback. Domains come from SHOPIFY_SYNC_DOMAINS (comma
 * separated) and default to the flagship store.
 *
 * Exit codes: 0 = synced (changed or unchanged; see stdout), 1 = error,
 * 78 = no token configured (treated as a graceful skip by CI).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT_PATH = join(ROOT, "netlify", "functions", "_shopify-snapshot.ts");

// `||` not `??`: CI passes the unset repo variable through as an empty string,
// which must still fall back to the flagship domain.
const DOMAINS = (process.env.SHOPIFY_SYNC_DOMAINS || "grahmos-marketbny.myshopify.com")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

/** Shopify API version — supported 12 months from release; review quarterly. */
const SHOPIFY_API_VERSION = "2026-04";

/** Storefront tokens are per-shop: a domain-specific env var
 *  (SHOPIFY_STOREFRONT_TOKEN__GRAHMOS_MARKETBNY) wins over the shared one. */
function storefrontTokenFor(domain) {
  const key = `SHOPIFY_STOREFRONT_TOKEN__${domain
    .replace(/\.myshopify\.com$/i, "")
    .replace(/[^a-z0-9]/gi, "_")
    .toUpperCase()}`;
  return process.env[key] ?? STOREFRONT_TOKEN;
}

const STOREFRONT_QUERY = `
  query MallCatalog {
    products(first: 12) {
      edges { node {
        id title handle onlineStoreUrl
        featuredImage { url }
        priceRange { minVariantPrice { amount } }
      } }
    }
  }
`;

const ADMIN_QUERY = `
  query MallCatalog {
    products(first: 12, query: "status:active") {
      edges { node {
        id title handle
        featuredMedia { preview { image { url } } }
        priceRangeV2 { minVariantPrice { amount } }
      } }
    }
  }
`;

async function fetchCatalog(domain) {
  const storefrontToken = storefrontTokenFor(domain);
  if (storefrontToken) {
    const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query: STOREFRONT_QUERY }),
    });
    if (!res.ok) throw new Error(`${domain}: Storefront API ${res.status}`);
    const payload = await res.json();
    return (payload.data?.products?.edges ?? []).map(({ node }) => ({
      id: node.id,
      name: node.title,
      price: Number(node.priceRange.minVariantPrice.amount),
      unit: "each",
      imageUrl: node.featuredImage?.url ?? undefined,
      url: node.onlineStoreUrl ?? `https://${domain}/products/${node.handle}`,
    }));
  }
  if (ADMIN_TOKEN) {
    const res = await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: ADMIN_QUERY }),
    });
    if (!res.ok) throw new Error(`${domain}: Admin API ${res.status}`);
    const payload = await res.json();
    return (payload.data?.products?.edges ?? []).map(({ node }) => ({
      id: node.id,
      name: node.title,
      price: Number(node.priceRangeV2.minVariantPrice.amount),
      unit: "each",
      imageUrl: node.featuredMedia?.preview?.image?.url ?? undefined,
      url: `https://${domain}/products/${node.handle}`,
    }));
  }
  return null;
}

function render(snapshots, syncedAt) {
  const entries = Object.entries(snapshots)
    .map(([domain, products]) => {
      const items = products
        .map((p) => {
          const fields = [
            `      id: ${JSON.stringify(p.id)},`,
            `      name: ${JSON.stringify(p.name)},`,
            `      price: ${p.price},`,
            `      unit: ${JSON.stringify(p.unit)},`,
            p.imageUrl ? `      imageUrl: ${JSON.stringify(p.imageUrl)},` : null,
            p.url ? `      url: ${JSON.stringify(p.url)},` : null,
          ].filter(Boolean);
          return `    {\n${fields.join("\n")}\n    },`;
        })
        .join("\n");
      return `  ${JSON.stringify(domain)}: [\n${items}\n  ],`;
    })
    .join("\n");

  return `/**
 * Synced Shopify catalog snapshots — GENERATED FILE, do not edit by hand.
 *
 * Regenerated by scripts/sync-shopify-snapshot.mjs (last sync: ${syncedAt}).
 * Serves as the catalog source for integrated storefronts when no
 * SHOPIFY_STOREFRONT_API_TOKEN is configured at runtime; the live Storefront
 * API takes precedence when it is.
 */

export interface SnapshotProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string;
  url?: string;
}

export const SHOPIFY_SNAPSHOTS: Record<string, SnapshotProduct[]> = {
${entries}
};
`;
}

async function main() {
  const anyToken = STOREFRONT_TOKEN || ADMIN_TOKEN || DOMAINS.some((d) => storefrontTokenFor(d));
  if (!anyToken) {
    console.log("No SHOPIFY_STOREFRONT_API_TOKEN or SHOPIFY_ADMIN_API_TOKEN set — skipping sync.");
    process.exit(78);
  }

  const snapshots = {};
  for (const domain of DOMAINS) {
    const products = await fetchCatalog(domain);
    if (products && products.length > 0) {
      snapshots[domain] = products;
      console.log(`${domain}: ${products.length} products`);
    } else {
      console.warn(`${domain}: empty catalog — keeping it out of the snapshot`);
    }
  }

  if (Object.keys(snapshots).length === 0) {
    console.error("No catalogs fetched; refusing to write an empty snapshot.");
    process.exit(1);
  }

  // Stable date stamp (UTC day) so re-runs on the same day are idempotent.
  const syncedAt = new Date().toISOString().slice(0, 10);
  const next = render(snapshots, syncedAt);
  const current = existsSync(SNAPSHOT_PATH) ? readFileSync(SNAPSHOT_PATH, "utf8") : "";

  // Compare ignoring the date stamp line so an unchanged catalog is a no-op.
  const strip = (s) => s.replace(/last sync: \d{4}-\d{2}-\d{2}/, "last sync: X");
  if (strip(next) === strip(current)) {
    console.log("Snapshot unchanged.");
    return;
  }

  writeFileSync(SNAPSHOT_PATH, next, "utf8");
  console.log(`Snapshot updated: ${SNAPSHOT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
