import type { Config, Context } from "@netlify/functions";

import { json } from "./_auth";
import { PRODUCTS, STOREFRONTS } from "./_data";

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

export interface ShopifyCatalogProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: null;
  imageUrl?: string;
  url?: string;
  source: "shopify" | "demo";
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
  return json({ source: "demo", products });
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const domain = new URL(req.url).searchParams.get("domain") ?? "";
  if (!domain || !/^[a-z0-9][a-z0-9.-]*\.myshopify\.com$/i.test(domain)) {
    return json({ error: "domain query param must be a *.myshopify.com domain" }, 422);
  }

  const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
  if (!token) return demoCatalog(domain);

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    });
    if (!res.ok) return demoCatalog(domain);

    const payload = (await res.json()) as {
      data?: { products?: { edges?: { node: ShopifyProductNode }[] } };
    };
    const edges = payload.data?.products?.edges;
    if (!edges) return demoCatalog(domain);

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
    return json({ source: "shopify", products });
  } catch {
    return demoCatalog(domain);
  }
};

export const config: Config = { path: "/api/shopify/catalog" };
