import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Hammer,
  Package,
  Briefcase,
  Coffee,
  Shirt,
  Sparkles,
  Truck,
} from "lucide-react";

import Reveal from "@/components/grahmos/Reveal";

const AISLES = [
  { icon: Package, slug: "packaging", name: "Packaging", body: "Boxes, mailers, labels — small runs welcome.", tint: "from-slate-900/85 to-slate-700/60" },
  { icon: Hammer, slug: "fabrication", name: "Fabrication", body: "CNC, metal, wood, and prototyping shops.", tint: "from-zinc-900/85 to-zinc-700/60" },
  { icon: Cpu, slug: "electronics", name: "Electronics", body: "PCB assembly, components, repair benches.", tint: "from-indigo-900/85 to-indigo-700/60" },
  { icon: Shirt, slug: "apparel-merch", name: "Apparel & Merch", body: "Cut-and-sew, screen print, embroidery.", tint: "from-rose-900/85 to-rose-700/60" },
  { icon: Coffee, slug: "food-beverage", name: "Food & Beverage", body: "Roasters, caterers, commissary kitchens.", tint: "from-amber-900/85 to-amber-700/60" },
  { icon: Briefcase, slug: "office-services", name: "Office & Business Services", body: "Print, IT, studios, and back-office help.", tint: "from-emerald-900/85 to-emerald-700/60" },
  { icon: Truck, slug: "logistics", name: "Logistics & Delivery", body: "Same-borough courier, freight, warehousing.", tint: "from-cyan-900/85 to-cyan-700/60" },
  { icon: Sparkles, slug: "local-brands", name: "Local Brands", body: "Made at the Yard. Sold to the world.", tint: "from-violet-900/85 to-violet-700/60" },
];

/** Eight BNY aisles, each deep-linking into /mall/aisles/<slug>. */
export default function AislesSection() {
  return (
    <section id="aisles" className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-grahmos-gold">
          For Buyers · The Aisles
        </div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Eight aisles. One neighborhood of makers.
          </h2>
          <Link
            to="/mall/aisles"
            className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-grahmos-purple-light"
          >
            Browse all aisles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AISLES.map((a, i) => (
          <Reveal key={a.slug} delay={i * 70}>
            <Link
              to={`/mall/aisles/${a.slug}`}
              className={`group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${a.tint} bg-grahmos-ink p-5 text-white transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
            >
              <a.icon className="absolute right-4 top-4 h-7 w-7 opacity-50 transition-opacity group-hover:opacity-90" />
              <div className="text-lg font-bold leading-tight">{a.name}</div>
              <div className="mt-0.5 text-xs text-white/70">{a.body}</div>
              <ArrowRight className="mt-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
