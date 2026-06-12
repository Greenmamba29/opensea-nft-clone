// Unclaimed-profile treatments for the BNY 50-storefronts program.
// The consent gate, visible: every unclaimed profile is badged, attributed,
// and linked out to the business's own site (PLAN-50-STORES.md §consent gate).

/** "Unclaimed" pill for aisle cards, profile pages, and route stops. */
export function UnclaimedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--os-gold)]/40 bg-[var(--os-gold)]/15 text-[var(--os-gold)]"
      title="This profile was built from public directory information and has not been claimed by the business."
    >
      ⚑ {compact ? "Unclaimed" : "Unclaimed — is this your business?"}
    </span>
  );
}

/** Attribution + link-out block required on every unclaimed profile. */
export function AttributionBlock({
  name,
  website,
  attribution,
}: {
  name: string;
  website: string;
  attribution: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface)] p-5 text-sm">
      <p className="font-medium text-[var(--os-text-secondary)]">{attribution}</p>
      <p className="mt-2 text-[var(--os-text-secondary)]">
        This profile is informational only — nothing here is for sale, and no
        pricing, partnership, or endorsement is implied. {name} runs its own
        business at{" "}
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[var(--os-blue)] hover:underline"
        >
          {website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
        </a>
        .
      </p>
      <p className="mt-2 text-xs text-[var(--os-text-tertiary)]">
        Own this business?{" "}
        <a
          href={`mailto:support@grahmos.com?subject=${encodeURIComponent(`Remove listing: ${name}`)}`}
          className="font-bold underline hover:text-[var(--os-text-secondary)]"
        >
          Remove this listing
        </a>{" "}
        — honored immediately, no questions.
      </p>
    </div>
  );
}
