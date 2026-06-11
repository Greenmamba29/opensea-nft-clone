import { openGrandmaPicker, useGrandma } from "@/lib/grandmothers";
import { openConcierge } from "./use-motion";

/** Desktop-only landing corner card: the visitor's grandmother guide with a
 *  phone-style "Call" CTA. Docks bottom-left so it never collides with the
 *  Concierge orb (bottom-right). Hidden below lg — the orb covers it there. */
export default function GrandmaCorner() {
  const grandma = useGrandma();

  return (
    <div className="fixed bottom-5 left-5 z-[60] hidden lg:flex">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card py-3 pl-3 pr-4 shadow-xl">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
          style={{
            backgroundColor: `${grandma.accentColor}1f`,
            boxShadow: `inset 0 0 0 2px ${grandma.accentColor}`,
          }}
          aria-hidden
        >
          {grandma.emoji}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight">{grandma.name}</div>
          <div className="text-xs text-muted-foreground">Your mall guide</div>
        </div>
        <button
          onClick={() => openConcierge()}
          className="ml-2 flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-grahmos-purple-deep to-grahmos-purple px-4 py-2 text-xs font-bold text-white shadow transition-transform hover:scale-105"
        >
          <span aria-hidden>📞</span> Call {grandma.shortName}
        </button>
        <button
          onClick={() => openGrandmaPicker()}
          className="shrink-0 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline"
        >
          change
        </button>
      </div>
    </div>
  );
}
