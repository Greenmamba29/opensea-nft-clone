# soul.md — The Soul of GrahmOS

> The non-negotiable "why." Every architectural decision in this repo traces back to
> a principle here. When a design choice is ambiguous, this document breaks the tie.

---

## 1. The thesis

**GrahmOS is commercial real estate for the internet.** We do not sell products. We own
the property, curate the tenant mix, drive the foot traffic, and collect rent plus a
percentage of every transaction. The model is Simon Property Group, not Amazon.

In one line: **"GrahmOS is Shopify + Google Maps + AI Concierge + Simon Property Group
for digital commerce."** And in one loop: walk into the mall → tell GrahmOS what you
need → get matched to stores, products, quotes, or a sourcing agent → buy or request
help. We launch one story (the BNY Digital Mall, per the PRD), not four apps at once.

| Physical mall | GrahmOS |
|---|---|
| Owns the building | Owns the platform, domain, design system, traffic |
| Leases storefronts | Brands **rent / lease / own** digital storefronts |
| Percentage rent | GMV take-rate on every transaction |
| Mall concierge | **White-glove AI + human agent layer** (the moat) |
| Property appreciation | Tokenized storefront deeds appreciate with mall traffic |

## 2. The value inversion (why crypto is here, why it is optional — and why it waits)

Buyers transact in **any currency** — card, ACH, net terms, stablecoin. That is table
stakes. The inversion: a brand that *owns* its storefront holds an appreciating,
transferable asset whose price is set by a decentralized market (mall traffic,
storefront revenue) — **not** by investors who hold the brand hostage. The OpenSea NFT
scaffold we started from is not legacy; it becomes the **deed registry**.

**But this is a later phase, not the launch story.** In v1: *buyers pay normally;
tenants can later upgrade into digital ownership of their storefront unit.* Buyers
never see "Tokens," "NFTs," or "Deeds" — that vocabulary is tenant/admin only.
(PRD → "Later phases.")

**Invariant:** Crypto is always *additive*, never *required*. Any buyer can complete any
transaction entirely in fiat. We never gate commerce behind a wallet.

## 3. The three tiers (the business model, encoded)

| Tier | Analog | Take-rate | Incentive |
|---|---|---|---|
| **Rent** | Month-to-month kiosk | 8–12% | Low commitment, high margin to us |
| **Lease** | Inline store | 5–8% | Annual contract, agent support |
| **Own** | Anchor / condo | 2–4% + deed royalty | Tokenized deed, governance, resale |

The take-rate *drops* as commitment *rises*. That asymmetry is the upgrade engine — it
is the single most important number in the product. See `design.md` → Pricing.

## 4. Voice

The concierge and all copy speak in one voice — encoded in
`netlify/functions/concierge.ts` (the `SYSTEM` prompt) and the landing copy:

- **Warm, never servile.** A maître d', not a call center.
- **Concise.** 2–4 sentences. Specificity over verbosity.
- **No dead ends.** If we can't resolve, we open a sourcing request, create a quote, or
  hand to a human. The buyer is *never* told "not found" without an alternative.
- **Premium, not corporate.** Editorial serif display, generous space, gold accents.
- **One visible agent.** The user only ever meets "GrahmOS Concierge." Many agents
  architecturally; one voice, one surface (see `agents.md` §1).

## 5. The five souls of the user

Every surface serves exactly one of these, and never leaks another's complexity into it:

1. **Buyer** (consumer + business) — beauty, speed, zero friction.
2. **Seller / tenant** — storefront ops, the rent→lease→own ladder.
3. **Channel partner** — catalogs, inventory feeds, sourcing fulfilment.
4. **Agent** — the white-glove console; AI-first, human-takeover.
5. **Operator** — us; the Mall OS dashboard.

**Invariant — and the main organizing principle of the product:** A consumer never
sees enterprise chrome. Complexity is revealed by role, never by default. Every
buyer-facing surface in v1 is free of crypto vocabulary, agent plumbing, and
marketplace jargon. (Enforced in `src/auth/ProtectedRoute.tsx` + role-gated UI;
elevated to the organizing principle in PRD §1.1.)

## 6. What we will not do

- We will not require crypto to buy.
- We will not let Airtable hold money, auth, or deeds (it is the *ops* layer only).
- We will not redesign the design system per-feature — every surface inherits
  `src/components/ui/` and the GrahmOS theme. Consistency is a feature.
- We will not leave a buyer at a dead end.
- We will not ship an agent action that moves money without a human approval gate.

## 7. Lineage

`PRD-VIRTUAL-MALL.md` is the plan. `soul.md` is the why. `design.md`, `agents.md`,
`skills.md`, and `ARCHITECTURE.md` are the how. When they conflict, **soul wins**, then
PRD, then the rest.
