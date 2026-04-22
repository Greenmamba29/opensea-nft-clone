# GrahmOS Marketplace PRD

## Vision: The 100M MRR B2B Marketplace Portal
Transform the existing OpenSea UI structure into a high-performance B2B meta-portal connecting 20 specialized managed marketplaces.

## Technical Architecture
- **Frontend**: React 18 + Vite (converted from OpenSea clone)
- **Primary Database**: NEON Postgres (Serverless)
- **Automation Layer**: Airtable (Master supplier/product control)
- **Payments**: Stripe (Managed connect for supplier payouts)
- **Infrastructure**: Netlify (Frontend) + Railway (Backend)

## The 4-Phase Transformation Plan

### Phase 1: Hub UI Transformation (Current)
- Rebrand OpenSea shell to **GrahmOS Marketplace**.
- Update Sidebar: Discover → Hub, NFTs → Marketplaces, Tokens → Pricing Index.
- Header: Replace Wallet Connect with **Company Auth** (JWT).
- Home Page: Convert NFT carousels into **Marketplace Vertical Feature cards**.

### Phase 2: Hub Infrastructure & Vertical Wiring
- Connect the Hub to the **NEON Postgres** database.
- Establish the **Airtable sync** for real-time product updates across all 20 verticals.
- Implement the "3-Click Intent" rule: Hub → Vertical → Product → RFQ.

### Phase 3: Frictionless Transacting (Supplier/Admin Focus)
- **Buyer Dash**: Quote management and 1-click ordering.
- **Supplier Dash**: Lightweight profile management, shipping label generation, and paperwork automation.
- **Admin Dash**: Platform-wide GMV monitoring and margin control.
- **Loyalty Program**: "Voyages" points re-tasked for volume-based buyer rewards.

### Phase 4: Scaling to 100M MRR
- Optimize high-ticket arbitrage yielding 15-25% managed spreads.
- Localization for global distribution hubs (North America, APAC, EMEA).
- Fully automated shipping and compliance paperwork.

## Revenue Model ($100M MRR Target)
- **GMV Target**: $500M+ per year.
- **Revenue Stream**: Managed Spread (15% average).
- **Secondary Revenue**: Financing, Logistics, and Premium Market Intelligence.

---
*Status: Initiated. Coder TL overseeing technical execution.*
