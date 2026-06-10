# soul.md — The Soul of Accio

> The non-negotiable "why." Every architectural decision in this repo traces back to
> a principle here. When a design choice is ambiguous, this document breaks the tie.

---

## 1. The thesis

**Accio is commercial real estate for the internet.** We do not sell products. We own
the property, curate the tenant mix, drive the foot traffic, and collect rent plus a
percentage of every transaction. The model is Simon Property Group, not Amazon.

| Physical mall | Accio |
|---|---|
| Owns the building | Owns the platform, domain, design system, traffic |
| Leases storefronts | Brands **rent / lease / own** digital storefronts |
| Percentage rent | GMV take-rate on every transaction |
| Mall concierge | **White-glove AI + human agent layer** (the moat) |
| Property appreciation | Tokenized storefront deeds appreciate with mall traffic |

## 2. The value inversion (why crypto is here, and why it is optional)

Buyers transact in **any currency** — card, ACH, net terms, stablecoin. That is table
stakes. The inversion: a brand that *owns* its storefront holds an appreciating,
transferable asset whose price is set by a decentralized market (mall traffic,
storefront revenue) — **not** by investors who hold the brand hostage. The OpenSea NFT
scaffold we started from is not legacy; it becomes the **deed registry**.

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

## 5. The five souls of the user

Every surface serves exactly one of these, and never leaks another's complexity into it:

1. **Buyer** (consumer + business) — beauty, speed, zero friction.
2. **Seller / tenant** — storefront ops, the rent→lease→own ladder.
3. **Channel partner** — catalogs, inventory feeds, sourcing fulfilment.
4. **Agent** — the white-glove console; AI-first, human-takeover.
5. **Operator** — us; the Mall OS dashboard.

**Invariant:** A consumer never sees enterprise chrome. Complexity is revealed by role,
never by default. (Enforced in `src/auth/ProtectedRoute.tsx` + role-gated UI.)

## 6. What we will not do

- We will not require crypto to buy.
- We will not let Airtable hold money, auth, or deeds (it is the *ops* layer only).
- We will not redesign the design system per-feature — every surface inherits
  `src/components/ui/` and the Accio theme. Consistency is a feature.
- We will not leave a buyer at a dead end.
- We will not ship an agent action that moves money without a human approval gate.

## 7. Lineage

`PRD-VIRTUAL-MALL.md` is the plan. `soul.md` is the why. `design.md`, `agents.md`,
`skills.md`, and `ARCHITECTURE.md` are the how. When they conflict, **soul wins**, then
PRD, then the rest.
