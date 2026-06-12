import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  TIER_OPTIONS,
  claimRequestFor,
  submitClaimRequest,
  type TenancyTier,
} from "@/lib/bnyClaims";
import type { BnyStorefront } from "@/lib/bnyRoster";
import { cn } from "@/lib/utils";

/** The claim flow — verify → terms → tier — for an unclaimed BNY profile.
 *  This is the consent gate (PLAN-50-STORES.md): commerce stays off until a
 *  business completes this flow and verification clears. */
export default function ClaimStoreModal({
  store,
  open,
  onClose,
}: {
  store: BnyStorefront;
  open: boolean;
  onClose: () => void;
}) {
  const existing = claimRequestFor(store.slug);
  const [step, setStep] = useState<"verify" | "terms" | "tier" | "done">(
    existing ? "done" : "verify"
  );
  const [contactName, setContactName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tier, setTier] = useState<TenancyTier | null>(null);
  const [error, setError] = useState("");

  const siteHost = store.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

  function next() {
    setError("");
    if (step === "verify") {
      if (!contactName.trim()) return setError("Your name is required.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(businessEmail)) {
        return setError("Enter a valid business email address.");
      }
      setStep("terms");
    } else if (step === "terms") {
      if (!termsAccepted) return setError("You must accept the tenant terms to continue.");
      setStep("tier");
    } else if (step === "tier") {
      if (!tier) return setError("Pick a tenancy tier.");
      submitClaimRequest({ slug: store.slug, businessEmail, contactName, tier });
      setStep("done");
    }
  }

  return (
    <div className="grahmos-theme">
      <Modal
        open={open}
        onClose={onClose}
        title={`Claim ${store.name}`}
        description="Verify ownership, accept the terms, pick your tier — selling the same day."
        className="max-w-lg"
      >
        {step === "verify" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Step 1 of 3 — <strong>Verify ownership.</strong> Use an email at{" "}
              <strong>@{siteHost}</strong> (or your BNYDC contact) so we can
              confirm you represent {store.name}.
            </p>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
            />
            <input
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder={`you@${siteHost}`}
              type="email"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
            />
          </div>
        )}

        {step === "terms" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Step 2 of 3 — <strong>GrahmOS tenant terms.</strong>
            </p>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground space-y-2">
              <p>1. You confirm you are authorized to represent {store.name}.</p>
              <p>2. Your storefront content remains yours; GrahmOS displays it under license while you are a tenant.</p>
              <p>3. Commerce activates only after verification; a take rate applies per your tier.</p>
              <p>4. You may leave the mall at any time — your listing and data are removed on request.</p>
              <p>5. Pre-claim profile content was sourced from public directories with attribution and is replaced by your own content on claim.</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              I accept the tenant terms on behalf of {store.name}.
            </label>
          </div>
        )}

        {step === "tier" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Step 3 of 3 — <strong>Pick your tenancy tier.</strong>
            </p>
            <div className="grid gap-2">
              {TIER_OPTIONS.map((opt) => (
                <button
                  key={opt.tier}
                  onClick={() => setTier(opt.tier)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors hover:bg-secondary",
                    tier === opt.tier ? "border-grahmos-purple bg-secondary" : "border-border bg-card"
                  )}
                >
                  <span className="block text-sm font-bold">{opt.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{opt.blurb}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-3 text-sm">
            <p className="font-bold">Claim request submitted. 🎉</p>
            <p className="text-muted-foreground">
              We'll verify ownership via {existing?.businessEmail ?? businessEmail} and
              the BNYDC partnership channel. Once verified, your storefront goes
              live with commerce enabled — your products, your pricing, same day.
            </p>
            <p className="text-xs text-muted-foreground">
              Until then this profile stays display-only. Questions:{" "}
              <a className="underline" href="mailto:support@grahmos.com">
                support@grahmos.com
              </a>
            </p>
          </div>
        )}

        {error && <p className="mt-3 text-sm font-bold text-red-500">{error}</p>}

        <div className="mt-5 flex items-center justify-between">
          {step !== "done" ? (
            <>
              <span className="text-xs text-muted-foreground">
                {step === "verify" ? "1" : step === "terms" ? "2" : "3"} / 3
              </span>
              <button
                onClick={next}
                className="rounded-xl bg-grahmos-purple px-5 py-2 text-sm font-bold text-white hover:brightness-110"
              >
                {step === "tier" ? "Submit claim" : "Continue"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="ml-auto rounded-xl border border-border px-5 py-2 text-sm font-bold hover:bg-secondary"
            >
              Close
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}
