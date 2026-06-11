import { Link } from "react-router-dom";

// Each link carries a real destination where one exists; routes go through
// react-router, in-page anchors scroll, and not-yet-built pages are honestly
// omitted rather than faked with href="#".
type FooterLink = { label: string; to?: string; href?: string };

const COLUMNS: { h: string; links: FooterLink[] }[] = [
  {
    h: "The Mall",
    links: [
      { label: "Browse Aisles", to: "/mall/aisles" },
      { label: "Top Storefronts", to: "/mall/stores" },
      { label: "All Products", to: "/mall/products" },
      { label: "Request a Quote", to: "/mall/quotes" },
    ],
  },
  {
    h: "Solutions",
    links: [
      { label: "Shop the Mall", to: "/mall" },
      { label: "For Sellers", href: "#plans" },
      { label: "Guided Sourcing", to: "/mall/directions" },
      { label: "Order Tracking", to: "/mall/orders" },
    ],
  },
  {
    h: "Company",
    links: [
      { label: "How it Works", href: "#how" },
      { label: "Ask the Concierge", href: "#concierge" },
      { label: "The Mall OS", to: "/os" },
    ],
  },
];

function FooterItem({ link }: { link: FooterLink }) {
  const cls = "transition-colors hover:text-white";
  if (link.to) return <Link to={link.to} className={cls}>{link.label}</Link>;
  return <a href={link.href} className={cls}>{link.label}</a>;
}

/** Landing footer. */
export default function SiteFooter() {
  return (
    <footer className="bg-grahmos-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="font-display text-2xl font-bold text-white">
            GrahmOS<span className="text-grahmos-gold">✦</span>
          </Link>
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
                <li key={l.label}>
                  <FooterItem link={l} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 GrahmOS. All rights reserved.
      </div>
    </footer>
  );
}
