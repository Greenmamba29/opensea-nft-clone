---
name: go-live
description: >-
  Take GrahmOS Virtual Mall from demo/synced mode to fully live by walking the
  operator through token setup — the user's only job is pasting API tokens
  into the right dashboards; everything else (opening the exact pages in their
  browser, checking what's missing, verifying activation, triggering the sync)
  is automated. Use this skill whenever the user mentions go-live, tokens, API
  keys, env variables, secrets, Storefront API, "make it live", "activate the
  Shopify integration", or asks where to paste/configure a credential for
  GrahmOS — even if they only name one token.
---

# GrahmOS go-live — paste tokens, everything else is automated

## Why this exists

Every GrahmOS integration is built demo-first and flips to live the moment its
token exists. Token *creation* is deliberately human-only (Shopify blocks
AI-driven token minting; secrets should never transit the AI session — the
user pastes them directly into each dashboard, so no secret ever appears in
chat or model context). This skill automates everything around that one human
step.

## The token map (what unlocks what)

| Token | Create it at | Paste it at | Unlocks |
|---|---|---|---|
| `SHOPIFY_STOREFRONT_API_TOKEN` | Shopify admin → Settings → Apps and sales channels → **Build apps in Dev Dashboard** (legacy custom apps are blocked since Jan 2026; the Dev Dashboard app's API credentials include the Storefront API access token). Alternative: install the free **Headless** sales channel (apps.shopify.com/headless) — it issues Storefront tokens per storefront. | **Netlify** (runtime, makes /api/shopify/catalog fully live) AND **GitHub Actions secret** (activates the daily shopify-sync workflow) | Live catalogs in the mall; autonomous daily catalog sync |
| `SHOPIFY_ADMIN_API_TOKEN` (optional fallback) | Same Dev Dashboard app — Admin API token, read_products scope is enough | GitHub Actions secret only | Sync workflow can pull catalogs without a Storefront token |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys | Netlify env (already set at team level — verify, don't recreate) | Real Claude concierge |
| `STRIPE_SECRET_KEY` (later phase) | dashboard.stripe.com → Developers → API keys | Netlify env | Escrow checkout rails (PRD §11.3) |

Exact paste locations:
- **Netlify env:** https://app.netlify.com/projects/grahmos-virtual-mall/configuration/env → "Add a variable" → key + value → save → trigger a redeploy (Deploys → Trigger deploy, or just `git push`).
- **GitHub secrets:** https://github.com/Greenmamba29/opensea-nft-clone/settings/secrets/actions → "New repository secret".

## The flow (run these steps in order)

### 1. Open the exact pages in the user's browser

Preferred: Kimi WebBridge (real browser, user's sessions). Health-check first:
`~/.kimi-webbridge/bin/kimi-webbridge status` — if stuck with a stale PID,
`rm ~/.kimi-webbridge/daemon.pid` then `start` (known issue on this machine).
Then open one tab per destination in a tab group:

```bash
for u in \
  "https://admin.shopify.com/store/grahmos-marketbny/settings/apps/development" \
  "https://dev.shopify.com/dashboard" \
  "https://app.netlify.com/projects/grahmos-virtual-mall/configuration/env" \
  "https://github.com/Greenmamba29/opensea-nft-clone/settings/secrets/actions"; do
  curl -s -X POST http://127.0.0.1:10086/command -H 'Content-Type: application/json' \
    -d "{\"action\":\"navigate\",\"args\":{\"url\":\"$u\",\"newTab\":true,\"group_title\":\"GrahmOS go-live\"},\"session\":\"golive\"}"
  sleep 2
done
```

Fallback when WebBridge is unavailable (opens default browser):
`Start-Process "<url>"` per URL from PowerShell.

Do NOT navigate further inside Shopify/Netlify/GitHub on the user's behalf —
the user drives token creation and pasting. Tell them what to click on each
tab (use the token map above) and that you'll verify when they say done.

### 2. Report current status

Run `node scripts/check-go-live.mjs` (repo root). It prints a ✅/❌ checklist —
presence and effect only, never secret values. Optionally set `GITHUB_TOKEN`
in the shell first (from Git Credential Manager: write
`protocol=https\nhost=github.com\n\n` to a temp file and run
`cmd /c "git credential fill < file"` — PowerShell pipes mangle git stdin) to
include the GitHub-secrets check; never print that token either.

### 3. Wait for the user

They create the Shopify app, copy the Storefront token, paste it into the
Netlify tab and the GitHub tab. Nothing to do until they say it's done.

### 4. Verify and activate

1. Re-run `node scripts/check-go-live.mjs` — Netlify/GitHub rows should flip.
2. Trigger a Netlify redeploy if the env var was added after the last deploy
   (`git commit --allow-empty -m "chore: redeploy for env" && git push`, or
   the user clicks Trigger deploy).
3. Confirm the rail is live: GET
   `https://grahmos-virtual-mall.netlify.app/api/shopify/catalog?domain=grahmos-marketbny.myshopify.com`
   must return `"source":"shopify"` (not `shopify-sync`).
4. Kick the sync loop once: dispatch `.github/workflows/shopify-sync.yml` via
   the GitHub API (`POST /repos/Greenmamba29/opensea-nft-clone/actions/workflows/shopify-sync.yml/dispatches`,
   body `{"ref":"master"}`) and confirm the run concludes `success` — it
   should now sync instead of skip.
5. Report which integrations went live and what's still outstanding.

## Invariants

- A secret value never appears in chat, in a tool result you echo, in a
  commit, or in a log line. Presence checks and effect checks only.
- New stores joining the program: add their domain to the `SHOPIFY_SYNC_DOMAINS`
  repo variable (comma-separated) — no code change needed.
- This skill edits nothing in Shopify/Netlify/GitHub itself; it opens doors,
  checks status, and verifies. The user is the only one who touches secrets.
