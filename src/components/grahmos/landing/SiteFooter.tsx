const COLUMNS = [
  { h: "The Mall", links: ["Browse Aisles", "Top Storefronts", "New Arrivals", "Request a Quote"] },
  { h: "Solutions", links: ["For Buyers", "For Sellers", "Sourcing Desk", "Local Delivery"] },
  { h: "Company", links: ["About Us", "Brooklyn Navy Yard", "Careers", "Press"] },
  { h: "Resources", links: ["Help Center", "Guides", "Blog", "Events"] },
];

/** Landing footer. */
export default function SiteFooter() {
  return (
    <footer className="bg-grahmos-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="font-display text-2xl font-bold text-white">
            GrahmOS<span className="text-grahmos-gold">✦</span>
          </div>
          <p className="mt-3 max-w-60 text-sm">
            An AI-guided virtual mall for buying, sourcing, and selling —
            launching with the makers of the Brooklyn Navy Yard.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.h}>
            <div className="mb-3 text-sm font-bold text-white">{col.h}</div>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 GrahmOS. All rights reserved. · Privacy Policy · Terms of Service
      </div>
    </footer>
  );
}
