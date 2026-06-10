import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headset, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGrahmOSAuth } from "@/auth/auth-context";
import Reveal from "@/components/grahmos/Reveal";
import Concierge from "@/components/grahmos/Concierge";
import ApplyStorefrontModal from "@/components/grahmos/ApplyStorefrontModal";
import Hero from "@/components/grahmos/landing/Hero";
import ValueBand from "@/components/grahmos/landing/ValueBand";
import MarqueeStrip from "@/components/grahmos/landing/MarqueeStrip";
import AislesSection from "@/components/grahmos/landing/AislesSection";
import ConciergeSection from "@/components/grahmos/landing/ConciergeSection";
import SellersSection, { type Tier } from "@/components/grahmos/landing/SellersSection";
import SiteFooter from "@/components/grahmos/landing/SiteFooter";
import { openConcierge } from "@/components/grahmos/landing/use-motion";

/** GrahmOS Virtual Mall landing — buyer story first (intent → Directions Mode →
 *  aisles → concierge), then the seller pitch (storefront plans), then CTA. */
export default function LandingPage() {
  const { user, signIn, signOut } = useGrahmOSAuth();
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyTier, setApplyTier] = useState<Tier>("rent");
  const openApply = (tier: Tier = "rent") => {
    setApplyTier(tier);
    setApplyOpen(true);
  };

  return (
    <div className="grahmos-theme min-h-screen">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-grahmos-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            GrahmOS<span className="text-grahmos-gold">✦</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/mall" className="transition-colors hover:text-foreground">Mall</Link>
            <Link to="/mall/aisles" className="transition-colors hover:text-foreground">Aisles</Link>
            <Link to="/mall/quotes" className="transition-colors hover:text-foreground">Quotes</Link>
            <a href="#how" className="transition-colors hover:text-foreground">For Sellers</a>
            <a href="#plans" className="transition-colors hover:text-foreground">Pricing</a>
            <Link to="/os" className="transition-colors hover:text-foreground">Mall OS</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/os">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    {user.firstName ? `Hi, ${user.firstName}` : "Console"}
                  </Button>
                </Link>
                <Button onClick={() => signOut()} variant="outline">Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button onClick={() => openConcierge()}>
                  Tell GrahmOS what you need <ArrowRight />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Buyer story ─────────────────────────────────── */}
      <Hero onApply={() => openApply()} />
      <ValueBand />
      <div className="pt-12">
        <MarqueeStrip />
      </div>
      <AislesSection />
      <ConciergeSection />

      {/* ── Seller story ────────────────────────────────── */}
      <SellersSection onApply={openApply} />

      {/* ── CTA ─────────────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-grahmos-purple-deep via-grahmos-purple to-grahmos-purple-light px-10 py-12 text-white md:flex-row">
            <div>
              <div className="font-display text-2xl font-bold md:text-3xl">
                Walk in. Say what you need. GrahmOS handles the rest.
              </div>
              <div className="mt-2 text-white/75">
                Buying or selling, the BNY Digital Mall opens with one concierge at the door.
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Button size="lg" variant="gold" onClick={() => openConcierge()}>
                <Headset /> Tell GrahmOS what you need
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => openApply()}
              >
                <Store /> Open a Storefront
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      <SiteFooter />

      <ApplyStorefrontModal open={applyOpen} onClose={() => setApplyOpen(false)} tier={applyTier} />
      <Concierge surface="landing" />
    </div>
  );
}
