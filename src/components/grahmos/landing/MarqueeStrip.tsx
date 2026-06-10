import { usePrefersReducedMotion } from "./use-motion";

const CHIPS = [
  "Packaging",
  "Fabrication",
  "Electronics",
  "Apparel & Merch",
  "Food & Beverage",
  "Office & Business Services",
  "Logistics & Delivery",
  "Local Brands",
  "Brooklyn Navy Yard",
  "Small-run manufacturing",
  "Same-borough delivery",
  "Quote in 24h",
];

/** Scrolling strip of aisle / tenant chips. Falls back to a static wrapped
 *  row when the user prefers reduced motion. */
export default function MarqueeStrip() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className="border-y border-border bg-card py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-6">
          {CHIPS.map((c) => (
            <Chip key={c} label={c} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-border bg-card py-4">
      <style>{`
        @keyframes grahmos-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" />
      <div
        className="flex w-max gap-2"
        style={{ animation: "grahmos-marquee 38s linear infinite" }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-2 pr-2" aria-hidden={dup === 1}>
            {CHIPS.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-border bg-grahmos-cream px-4 py-1.5 text-xs font-semibold text-foreground/80">
      {label}
    </span>
  );
}
