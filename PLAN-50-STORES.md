# PLAN — 50 Storefronts: The BNY Move-In-Ready Program

**Status:** Draft v1 · June 2026
**Inputs:** `research/bny-top50.json` (ranked roster) · `research/bny-roster.md` (human-readable) · `PRD-VIRTUAL-MALL.md` §1–2, §8, §11.2
**Source data:** brooklynnavyyard.org tenant directory, scraped 2026-06-11 (314 tenants)

---

## The program in one paragraph

Fifty of the strongest Brooklyn Navy Yard businesses get a **pre-provisioned, move-in-ready GrahmOS storefront** — not a mockup, a real integrated Shopify store seeded from their own public catalog, placed in the right aisle, wired into Directions Mode — and we offer it to them to claim. The pitch is the opposite of every marketplace cold email: **"Your store is already built; here are the keys."** The tenant walks into a storefront that already looks like them, claims it, picks a tenancy tier (Rent/Lease/Own, §8 of the PRD), and is selling through the mall the same day. The roster, ranking, and cohorts live in `research/bny-top50.json`.

---

## The consent gate (non-negotiable)

Selling under a business's name without authorization is impersonation and trademark infringement. The program only works because of this line, so it is enforced in code, not policy:

- **Unclaimed storefronts are clearly badged** — "Unclaimed — is this your business?" — on the storefront page, in aisle listings, and in Directions Mode stops.
- **Unclaimed storefronts show only publicly available information**, with attribution ("Source: brooklynnavyyard.org tenant directory / {business}'s public site") and a prominent link to the business's own website.
- **Unclaimed storefronts cannot transact.** No checkout, no add-to-cart, no quotes fulfilled in their name, no pricing presented as offers, no implication of partnership or endorsement. Seeded Shopify products stay in **draft** status until claim.
- **The claim flow is the gate:** verify ownership (business email domain, or a verification code via the BNYDC channel) → accept the GrahmOS tenant terms → pick Rent/Lease/Own. Only then does a profile become a store and commerce switch on.
- One-click **"remove this listing"** honored immediately, no questions.

This protects the BNY anchor relationship — BNYDC cannot champion a platform that freelances its tenants' brands — and it *is* the sales motion: the unclaimed badge converts visitors into outreach pressure ("claim your store") instead of liability.

---

## Pipeline (per store)

1. **Scrape the public catalog** — products, images, copy from the tenant's public site (Firecrawl; respect robots/ToS; public info only).
2. **Provision or map:**
   - `ecommerceHint: unknown/none` → provision a Shopify store via the GrahmOS Shopify org, theme by aisle (the Tenant Onboarding agent's job, PRD §11.2).
   - `ecommerceHint: store` (29 of the 50) → **do not clone.** They already run commerce; they get an **integration invite** instead: a mall storefront entry that points at their existing store, with the claim flow connecting their store to the mall (Storefront API pull per PRD §8).
3. **Seed products as drafts** — never ACTIVE before claim.
4. **Create the mall storefront entry** — correct aisle, unclaimed badge, attribution block, link out.
5. **Outreach** — BNY Development Corp partnership channel first (one warm intro beats fifty cold emails, and keeps the anchor relationship clean), then direct to the business.
6. **Claim** — verification → terms → tier selection.
7. **Activate commerce** — drafts go live, checkout enabled, take-rate metering on, storefront joins Directions Mode routing as a transactable stop.

---

## Phases

| Phase | Cohort | Stores | Mode | Exit criteria (before next phase) |
|---|---|---|---|---|
| **A — Pilot** | 1 (ranks 1–10) | 10 | Manual-assisted: operator + Claude build each storefront by hand, perfect the claim flow on real brands | **≥3 claims OR a BNYDC partnership letter.** Also: claim flow shipped, zero trademark complaints, unclaimed badge live |
| **B — Scale** | 2 (ranks 11–30) | 20 | Semi-automated: sync script + provisioning agent do the heavy lifting; operator reviews each storefront before publish | ≥25% cumulative claim rate, provisioning time <1 day/store, outreach tracker running |
| **C — Pipeline** | 3 (ranks 31–50) | 20 | Fully pipelined: scrape → provision → seed → list with spot-check review only. **Start as profiles, not stores** (see Risks — Shopify cost) | 50 listings live, ≥15 claimed stores total, program review for the next 50 |

Phase A's ten are the press-proven brands (Russ & Daughters, Atoms, Catbird, Stick With Me Sweets, Kings County Distillery, Aurate, ECCO, Care/of, Brooklyn Roasting, Té Company) — the ones whose claimed storefronts make the mall look real to everyone else.

---

## Automation map

**Exists today:**

| Piece | Role in the program |
|---|---|
| `scripts/sync-shopify-snapshot.mjs` + `SHOPIFY_SYNC_DOMAINS` | Multi-store catalog sync — extends from one flagship store to N provisioned stores by adding domains |
| `.github/workflows/shopify-sync.yml` (daily) | Keeps mall snapshots fresh across all program stores |
| "shopify-catalog-sync" scheduled task | Same sync on the operator's schedule, belt-and-suspenders with the workflow |
| Tenant Onboarding agent (PRD §11.2) | The provisioning brain: creates the store from the storefront application — for this program, from the scraped catalog |
| Shopify MCP (`grahmos-marketbny` org) | Store provisioning, product creation (drafts), collections, status flips at claim time |
| Firecrawl MCP | Public catalog scraping per store |

**Must be built:**

| Piece | What it is |
|---|---|
| **Claim flow UI** | Verify → terms → tier picker; the consent gate made concrete |
| **Unclaimed badge** | Storefront + aisle-card + route-stop treatment, with attribution block and no-transact enforcement |
| **Per-store domain registry in Neon** | `storefronts` rows (PRD §11.4) gain claim status, source attribution, scrape date, `platform` + `shopifyDomain`; the system of record for what's claimed vs not |
| **Outreach tracker in Airtable** | Ops layer (PRD §11 data-ownership rule): one row per roster entry — contact, channel, status, claim date, objections |

---

## Risks

1. **Trademark / impersonation** — the existential one. Mitigated by the consent gate: no transactions, clear unclaimed badging, attribution, instant takedown. Reviewed by counsel before Phase A goes public.
2. **Stale catalogs** — a seeded storefront showing discontinued products embarrasses the tenant and us. Mitigation: scrape date shown on unclaimed profiles, daily sync after claim, re-scrape before any outreach touch.
3. **BNYDC relationship** — if BNYDC reads this as scraping their tenants, the anchor story dies. Mitigation: BNYDC is outreach step one, not a bystander; offer them co-branding on the program ("the Yard's digital mall").
4. **Shopify per-store cost at 50 stores** — Shopify plan costs × 50 unclaimed stores is real money for inventory nobody has claimed. Mitigation: **cohort 3 launches as profiles-not-stores** (mall listing + scraped catalog display, no Shopify provisioning) until claims justify provisioning; cohort 2 provisions on a rolling basis as Phase A proves claim rates. Integration-invite stores (29 of 50) cost us nothing — they bring their own Shopify.
5. **Directory data quality** — signals are directory/page-based; no revenue or sentiment verification (see `research/bny-roster.md`, Data gaps). Mitigation: press/ratings enrichment pass before each phase's outreach.

---

## Next actions

1. **Operator** — counsel review of the consent gate + unclaimed-listing model (one pager, this doc's §2).
2. **Operator** — open the BNYDC partnership conversation; ask for a warm channel to cohort 1.
3. **Claude** — build the claim flow UI + unclaimed badge (storefront page, aisle cards, route stops).
4. **Claude** — extend Neon `storefronts` schema with claim status / attribution / scrape-date fields and migrate.
5. **Claude** — create the Airtable outreach tracker base seeded from `research/bny-top50.json` (50 rows, cohort + channel fields).
6. **Claude** — pilot the pipeline end-to-end on one cohort-1 integration-invite brand (existing store, so no provisioning risk) in a staging storefront — not public until 1–2 clear.
7. **Operator + Claude** — press/ratings enrichment pass on cohort 1 before first outreach touch.
8. **Operator** — Phase A go/no-go once 1–6 land.
