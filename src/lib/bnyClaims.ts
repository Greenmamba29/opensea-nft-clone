// Claim-flow state for the BNY 50-storefronts program (PLAN-50-STORES.md).
// The consent gate made concrete: unclaimed profiles are display-only until a
// business verifies ownership, accepts terms, and picks a tenancy tier.
// v1 stores claim *requests* locally (localStorage) and surfaces them in the
// UI; backend verification (email-domain / BNYDC channel) lands with Neon.

export type TenancyTier = "rent" | "lease" | "own";

export interface ClaimRequest {
  slug: string;
  businessEmail: string;
  contactName: string;
  tier: TenancyTier;
  acceptedTermsAt: string; // ISO timestamp
  submittedAt: string; // ISO timestamp
  status: "submitted"; // future: "verified" | "rejected" via backend
}

const STORAGE_KEY = "grahmos.bnyClaims";

function loadAll(): Record<string, ClaimRequest> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ClaimRequest>) : {};
  } catch {
    return {};
  }
}

function saveAll(claims: Record<string, ClaimRequest>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  } catch {
    // Storage full/blocked — claim request is lost but the UI already told
    // the user to expect a follow-up via the outreach channel.
  }
}

/** The claim request previously submitted for this profile, if any. */
export function claimRequestFor(slug: string): ClaimRequest | undefined {
  return loadAll()[slug];
}

/** Submit a claim request for an unclaimed BNY profile. */
export function submitClaimRequest(input: {
  slug: string;
  businessEmail: string;
  contactName: string;
  tier: TenancyTier;
}): ClaimRequest {
  const now = new Date().toISOString();
  const request: ClaimRequest = {
    ...input,
    acceptedTermsAt: now,
    submittedAt: now,
    status: "submitted",
  };
  const all = loadAll();
  all[input.slug] = request;
  saveAll(all);
  return request;
}

export const TIER_OPTIONS: Array<{ tier: TenancyTier; name: string; blurb: string }> = [
  { tier: "rent", name: "Rent", blurb: "Month-to-month stall. Lowest commitment, standard take rate." },
  { tier: "lease", name: "Lease", blurb: "Annual storefront. Better rates, featured placement eligibility." },
  { tier: "own", name: "Own", blurb: "Permanent flagship. Best rates, full storefront customization." },
];
