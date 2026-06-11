/**
 * Synced Shopify catalog snapshots.
 *
 * Real product data pulled from connected Shopify stores via the Admin API
 * (last sync: 2026-06-11). Serves as the catalog source for integrated
 * storefronts until a Storefront API token is configured — token creation
 * is gated to the Shopify admin UI (blocked for AI tools), so the snapshot
 * keeps the integration live in the meantime. When
 * SHOPIFY_STOREFRONT_API_TOKEN is set, the live Storefront API takes
 * precedence and these entries are ignored.
 */

export interface SnapshotProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string;
  url?: string;
}

const MARKETBNY_CDN = "https://cdn.shopify.com/s/files/1/0729/2311/9727/files";
const MARKETBNY_STORE = "https://grahmos-marketbny.myshopify.com/products";

export const SHOPIFY_SNAPSHOTS: Record<string, SnapshotProduct[]> = {
  "grahmos-marketbny.myshopify.com": [
    {
      id: "gid://shopify/Product/15022586658927",
      name: "The Complete Snowboard",
      price: 699.95,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/Main_589fc064-24a2-4236-9eaf-13b2bd35d21d.jpg?v=1779837343`,
      url: `${MARKETBNY_STORE}/the-complete-snowboard`,
    },
    {
      id: "gid://shopify/Product/15022586626159",
      name: "The Collection Snowboard: Hydrogen",
      price: 600,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/Main_0a40b01b-5021-48c1-80d1-aa8ab4876d3d.jpg?v=1779837343`,
      url: `${MARKETBNY_STORE}/the-collection-snowboard-hydrogen`,
    },
    {
      id: "gid://shopify/Product/15022586691695",
      name: "The Hidden Snowboard",
      price: 749.95,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1779837343`,
      url: `${MARKETBNY_STORE}/the-hidden-snowboard`,
    },
    {
      id: "gid://shopify/Product/15022586560623",
      name: "The Compare at Price Snowboard",
      price: 785.95,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/snowboard_sky.png?v=1779837344`,
      url: `${MARKETBNY_STORE}/the-compare-at-price-snowboard`,
    },
    {
      id: "gid://shopify/Product/15022586527855",
      name: "The Videographer Snowboard",
      price: 885.95,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/Main.jpg?v=1779837343`,
      url: `${MARKETBNY_STORE}/the-videographer-snowboard`,
    },
    {
      id: "gid://shopify/Product/15022586724463",
      name: "Selling Plans Ski Wax",
      price: 9.95,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/snowboard_wax.png?v=1779837344`,
      url: `${MARKETBNY_STORE}/selling-plans-ski-wax`,
    },
    {
      id: "gid://shopify/Product/15022586396783",
      name: "Gift Card",
      price: 10,
      unit: "each",
      imageUrl: `${MARKETBNY_CDN}/gift_card.png?v=1779837344`,
      url: `${MARKETBNY_STORE}/gift-card`,
    },
  ],
};
