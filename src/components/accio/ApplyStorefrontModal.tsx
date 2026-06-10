import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { submitStorefront, type Storefront } from "@/lib/api";

const CATEGORIES = ["Local Makers", "Office Supplies", "Food & Beverage", "Corporate Gifting", "B2B Sourcing"];
const STORE_TYPES: Storefront["storeType"][] = ["Retail Store", "Brand Store", "B2B Store", "Pop-Up"];

/** Public storefront application — posts to /api/storefronts (no auth required). */
export default function ApplyStorefrontModal({
  open,
  onClose,
  tier = "rent",
}: {
  open: boolean;
  onClose: () => void;
  tier?: Storefront["tier"];
}) {
  const [merchant, setMerchant] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [storeType, setStoreType] = useState<Storefront["storeType"]>("Retail Store");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { message } = await submitStorefront({
        merchant,
        category,
        storeType,
        tier,
        contactEmail: email || undefined,
        notes: notes || undefined,
      });
      setDone(message);
    } catch {
      setError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    setDone(null);
    setError(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Apply for a Storefront"
      description={`Tell us about your business — our agents handle the rest. Plan: ${tier}.`}
    >
      {done ? (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800">{done}</div>
          <Button className="w-full" onClick={close}>Done</Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <label className="block">
            <span className="mb-1 block font-medium">Business name</span>
            <input className="h-10 w-full" value={merchant} onChange={(e) => setMerchant(e.target.value)} required placeholder="Brewed Awakenings" />
          </label>
          <label className="block">
            <span className="mb-1 block font-medium">Contact email</span>
            <input type="email" className="h-10 w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block font-medium">Category</span>
              <select className="h-10 w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block font-medium">Store type</span>
              <select className="h-10 w-full" value={storeType} onChange={(e) => setStoreType(e.target.value as Storefront["storeType"])}>
                {STORE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block font-medium">Anything else? <span className="text-muted-foreground">(optional)</span></span>
            <textarea className="w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What do you sell, and what are your goals?" />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
