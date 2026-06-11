import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  GRANDMOTHERS,
  OPEN_GRANDMA_PICKER_EVENT,
  assignGrandma,
  chooseGrandma,
  loadChosenGrandma,
} from "@/lib/grandmothers";
import { aisleBySlug } from "@/lib/mallData";
import { cn } from "@/lib/utils";

/** "Meet your guide" — pick the grandmother who fronts the GrahmOS Concierge.
 *  Mounted once (inside Concierge) and opened from anywhere via
 *  window.dispatchEvent(new CustomEvent("grahmos:open-grandma-picker")). */
export default function GrandmaPicker() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_GRANDMA_PICKER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GRANDMA_PICKER_EVENT, onOpen);
  }, []);

  const chosen = loadChosenGrandma();

  function select(id: string) {
    chooseGrandma(id);
    setOpen(false);
  }

  return (
    <div className="grahmos-theme">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Meet your guide"
        description="Your personal concierge — she remembers what you need."
        className="max-w-2xl"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {GRANDMOTHERS.map((g) => {
            const isCurrent = chosen?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => select(g.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-secondary",
                  isCurrent ? "border-grahmos-purple bg-secondary" : "border-border bg-card"
                )}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl"
                  style={{
                    backgroundColor: `${g.accentColor}1f`,
                    boxShadow: `inset 0 0 0 1.5px ${g.accentColor}`,
                  }}
                  aria-hidden
                >
                  {g.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{g.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">“{g.tagline}”</span>
                  <span
                    className="mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    style={{ borderColor: `${g.accentColor}80`, color: g.accentColor }}
                  >
                    {aisleBySlug(g.specialtyAisle)?.name ?? g.specialtyAisle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => select(assignGrandma().id)}
            className="text-sm font-bold text-grahmos-purple hover:underline"
          >
            ✦ Surprise me
          </button>
          <span className="text-xs text-muted-foreground">
            One concierge, many faces — your grandma is GrahmOS.
          </span>
        </div>
      </Modal>
    </div>
  );
}
