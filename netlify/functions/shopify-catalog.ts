import type { Config, Context } from "@netlify/functions";

import { json } from "./_auth";
import { PRODUCTS, STOREFRONTS } from "./_data";
import { SHOPIFY_SNAPSHOTS } from "./_shopify-snapshot";

/**
 * GET /api/shopify/catalog?domain=<shopifyDomain>
 *
 * Public catalog proxy for the per-tenant Shopify stores behind each mall
 * storefront. When SHOPIFY_STOREFRONT_API_TOKEN is configured we query the
 * Shopify Storefront API (GraphQL) for the store's products; otherwise (or on
 * any error) we fall back to the demo PRODUCTS for that storefront so the
 * endpoint always answers 200 in demo mode.
 *
 * v1 scaffold uses a single shared token; per-storefront tokens land later
 * via Neon alongside the tenant provisioning flow.
 */

/** Shopify API version — supported 12 months from release; review quarterly. */
const SHOPIFY_API_VERSION = "2026-04";

/** Public-catalog caching: edge-cache 5 min, serve stale up to an hour while
 *  revalidating. Vary on the domain query so stores don't share entries. */
const CACHE_HEADERS: Record<string, string> = {
  "content-type": "application/json",
  "Cache-Control": "public, max-age=60",
  "Netlify-CDN-Cache-Control": "public, durable, s-maxage=300, stale-while-revalidate=3600",
  "Netlify-Vary": "query=domain",
};

function cachedJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: CACHE_HEADERS });
}

/** Storefront tokens are per-shop: look for a domain-specific token first
 *  (SHOPIFY_STOREFRONT_TOKEN__GRAHMOS_MARKETBNY for
 *  grahmos-marketbny.myshopify.com), then the shared flagship token. */
function tokenForDomain(domain: string): string | undefined {
  const key = `SHOPIFY_STOREFRONT_TOKEN__${domain
    .replace(/\.myshopify\.com$/i, "")
    .replace(/[^a-z0-9]/gi, "_")
    .toUpperCase()}`;
  return process.env[key] ?? process.env.SHOPIFY_STOREFRONT_API_TOKEN;
}

export interface ShopifyCatalogProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: null;
  imageUrl?: string;
  url?: string;
  source: "shopify" | "shopify-sync" | "demo";
}

const PRODUCTS_QUERY = `
  query MallCatalog {
    products(first: 12) {
      edges {
        node {
          id
          title
          description
          onlineStoreUrl
          featuredImage { url }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }
`;

interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  onlineStoreUrl: string | null;
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

/** Catalog synced from the real store via the Admin API (see _shopify-snapshot.ts). */
function syncedCatalog(domain: string) {
  const snapshot = SHOPIFY_SNAPSHOTS[domain];
  if (!snapshot) return null;
  const products: ShopifyCatalogProduct[] = snapshot.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    unit: p.unit,
    image: null,
    imageUrl: p.imageUrl,
    url: p.url,
    source: "shopify-sync" as const,
  }));
  return cachedJson({ source: "shopify-sync", products });
}

function demoCatalog(domain: string) {
  const storefront = STOREFRONTS.find((s) => s.shopifyDomain === domain);
  const products: ShopifyCatalogProduct[] = (
    storefront ? PRODUCTS.filter((p) => p.storefrontId === storefront.id) : []
  ).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    unit: "each",
    image: null,
    source: "demo" as const,
  }));
  return cachedJson({ source: "demo", products });
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const domain = new URL(req.url).searchParams.get("domain") ?? "";
  if (!domain || !/^[a-z0-9][a-z0-9.-]*\.myshopify\.com$/i.test(domain)) {
    return json({ error: "domain query param must be a *.myshopify.com domain" }, 422);
  }

  const token = tokenForDomain(domain);
  if (!token) return syncedCatalog(domain) ?? demoCatalog(domain);

  try {
    const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    });
    if (!res.ok) {
      console.warn(`shopify-catalog: ${domain} returned ${res.status} — falling back to snapshot`);
      return syncedCatalog(domain) ?? demoCatalog(domain);
    }

    const payload = (await res.json()) as {
      data?: { products?: { edges?: { node: ShopifyProductNode }[] } };
    };
    const edges = payload.data?.products?.edges;
    if (!edges) return syncedCatalog(domain) ?? demoCatalog(domain);

    const products: ShopifyCatalogProduct[] = edges.map(({ node }) => ({
      id: node.id,
      name: node.title,
      price: Number(node.priceRange.minVariantPrice.amount),
      unit: "each",
      image: null,
      imageUrl: node.featuredImage?.url ?? undefined,
      url: node.onlineStoreUrl ?? undefined,
      source: "shopify" as const,
    }));
    return cachedJson({ source: "shopify", products });
  } catch (err) {
    console.warn(`shopify-catalog: ${domain} fetch failed — falling back to snapshot`, err);
    return syncedCatalog(domain) ?? demoCatalog(domain);
  }
};

export const config: Config = { path: "/api/shopify/catalog" };
