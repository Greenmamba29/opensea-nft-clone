import { Building2, LayoutGrid, MessageCircle, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useCountUp, useInView } from "./use-motion";

const ITEMS = [
  { icon: LayoutGrid, value: 8, suffix: "", label: "Curated aisles at launch" },
  { icon: Building2, value: 1, suffix: "", label: "Neighborhood: Brooklyn Navy Yard" },
  { icon: Timer, value: 24, suffix: "h", label: "Quote turnaround target" },
  { icon: MessageCircle, value: 1, suffix: "", label: "Concierge, end to end" },
];

/** Honest value-prop band — launch-cohort figures with a count-up ticker.
 *  No invented marketplace volume numbers. */
export default function ValueBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div
        ref={ref}
        className="relative rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="absolute -top-3 left-6">
          <Badge variant="gold">Launch cohort · Brooklyn Navy Yard</Badge>
        </div>
        <div className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {ITEMS.map((s) => (
            <Stat key={s.label} {...s} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  suffix,
  label,
  start,
}: (typeof ITEMS)[number] & { start: boolean }) {
  const n = useCountUp(value, start, 1100);
  return (
    <div className="flex items-center gap-4 px-7 py-6">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-2xl font-extrabold tracking-tight tabular-nums">
          {n}
          {suffix}
        </span>
        <span className="block text-xs text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}
