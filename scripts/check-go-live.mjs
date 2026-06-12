#!/usr/bin/env node
/**
 * GrahmOS go-live status check — reports which integrations are live and
 * which tokens are still missing, WITHOUT ever printing a secret value.
 *
 *   node scripts/check-go-live.mjs
 *
 * Checks (all presence/effect-based):
 *   1. Production catalog endpoint — source "shopify" means the Storefront
 *      token is live in Netlify; "shopify-sync" means snapshot fallback.
 *   2. Netlify env var names for the site (via netlify CLI if authenticated).
 *   3. GitHub Actions secret names (via GITHUB_TOKEN env if provided).
 *   4. Concierge — source "claude" means ANTHROPIC_API_KEY is live.
 *
 * Exit code 0 always (it's a report, not a gate).
 */

import { execSync } from "node:child_process";

const SITE = "https://grahmos-virtual-mall.netlify.app";
const FLAGSHIP = "grahmos-marketbny.myshopify.com";
const REPO = "Greenmamba29/opensea-nft-clone";
const NETLIFY_SITE_ID = "302e39fd-7b07-4311-a3ec-1636eed5d824";

// ANTHROPIC_API_KEY lives at the Netlify TEAM level (invisible to site
// env:list) — the concierge effect-check above is its source of truth.
const WANTED_NETLIFY = ["SHOPIFY_STOREFRONT_API_TOKEN"];
const WANTED_GH = ["SHOPIFY_STOREFRONT_API_TOKEN", "NETLIFY_AUTH_TOKEN", "NETLIFY_SITE_ID"];

const rows = [];
const row = (ok, label, fix) => rows.push({ ok, label, fix });

// 1 + 4: effect checks against production
try {
  const res = await fetch(`${SITE}/api/shopify/catalog?domain=${FLAGSHIP}`);
  const body = await res.json();
  row(
    body.source === "shopify",
    `Shopify catalog rail: source="${body.source}" (${body.products?.length ?? 0} products)`,
    body.source === "shopify"
      ? ""
      : "Add SHOPIFY_STOREFRONT_API_TOKEN in Netlify env, redeploy — source flips to 'shopify'"
  );
} catch (e) {
  row(false, `Prod catalog endpoint unreachable: ${e.message}`, `Check ${SITE}`);
}

try {
  const res = await fetch(`${SITE}/api/concierge`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "ping" }], surface: "landing" }),
  });
  const body = await res.json();
  row(body.source === "claude", `Concierge: source="${body.source}"`, body.source === "claude" ? "" : "Set ANTHROPIC_API_KEY in Netlify env");
} catch (e) {
  row(false, `Concierge endpoint unreachable: ${e.message}`, "");
}

// 2: Netlify env names (CLI auth from the developer machine; names only)
try {
  const out = execSync(`npx netlify env:list --json --site ${NETLIFY_SITE_ID}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 60_000,
  });
  const names = Object.keys(JSON.parse(out));
  for (const k of WANTED_NETLIFY) {
    row(names.includes(k), `Netlify env: ${k} ${names.includes(k) ? "present" : "MISSING"}`,
      names.includes(k) ? "" : `https://app.netlify.com/projects/grahmos-virtual-mall/configuration/env`);
  }
} catch {
  row(false, "Netlify env: could not list (CLI not authenticated here)", "Run npx netlify login, or check the dashboard");
}

// 3: GitHub Actions secret names (needs GITHUB_TOKEN env; names only)
if (process.env.GITHUB_TOKEN) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets?per_page=100`, {
      headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: "application/vnd.github+json" },
    });
    const names = ((await res.json()).secrets ?? []).map((s) => s.name);
    for (const k of WANTED_GH) {
      row(names.includes(k), `GitHub secret: ${k} ${names.includes(k) ? "present" : "MISSING"}`,
        names.includes(k) ? "" : `https://github.com/${REPO}/settings/secrets/actions`);
    }
  } catch (e) {
    row(false, `GitHub secrets: check failed (${e.message})`, "");
  }
} else {
  row(false, "GitHub secrets: skipped (set GITHUB_TOKEN to check)", `https://github.com/${REPO}/settings/secrets/actions`);
}

console.log("\nGrahmOS go-live status\n──────────────────────");
for (const r of rows) {
  console.log(`${r.ok ? "✅" : "❌"} ${r.label}${r.fix ? `\n   ↳ ${r.fix}` : ""}`);
}
const missing = rows.filter((r) => !r.ok).length;
console.log(`\n${missing === 0 ? "All live. 🏛️" : `${missing} item(s) outstanding.`}\n`);
