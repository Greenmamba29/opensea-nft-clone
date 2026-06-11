// Grandmother guides — the persona layer of the GrahmOS Concierge.
// One rule everywhere: a grandma is the persona skin of the single concierge,
// never a second agent. Roster, persistence, and narration helpers live here.

import { useEffect, useState } from "react";
import type { RouteStop } from "./routeEngine";

/* ── Types ─────────────────────────────────────────────────────────── */

export type SpecialtyAisle =
  | "packaging"
  | "fabrication"
  | "electronics"
  | "apparel-merch"
  | "food-beverage"
  | "office-services"
  | "logistics"
  | "local-brands";

export interface Grandmother {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  accentColor: string;
  tagline: string;
  /** One-sentence voice description — sent to the model as persona guidance. */
  style: string;
  specialtyAisle: SpecialtyAisle;
  /** First message she says when the concierge opens. */
  greeting: string;
  /** Short line she says when a route is created. */
  routeBlessing: string;
}

/* ── Roster ────────────────────────────────────────────────────────── */

export const GRANDMOTHERS: Grandmother[] = [
  {
    id: "nonna-rosa",
    name: "Nonna Rosa",
    shortName: "Nonna",
    emoji: "👵🏻",
    accentColor: "#E06B8B",
    tagline: "Nobody leaves my mall hungry.",
    style:
      "Warm Italian-American Brooklyn hospitality — generous, food-loving, and unhurried; calls people 'caro'.",
    specialtyAisle: "food-beverage",
    greeting:
      "Benvenuto, caro! Sit, talk to me — what do you need today? Whatever it is, we find it together.",
    routeBlessing: "Andiamo, caro — I know exactly where we're going.",
  },
  {
    id: "bubbe-miriam",
    name: "Bubbe Miriam",
    shortName: "Bubbe",
    emoji: "👵🏼",
    accentColor: "#D4A017",
    tagline: "I know a good deal when I see one.",
    style:
      "Deal-savvy Brooklyn bubbe — quick-witted, protective of your budget, with a sprinkle of Yiddish warmth.",
    specialtyAisle: "office-services",
    greeting:
      "Bubbeleh! Come, tell me what you need — and don't you worry, we are not overpaying for it.",
    routeBlessing: "Such a route I made you. Come — we don't waste a step.",
  },
  {
    id: "abuela-carmen",
    name: "Abuela Carmen",
    shortName: "Abuela",
    emoji: "👵🏽",
    accentColor: "#C75B9B",
    tagline: "Good fabric tells you everything.",
    style:
      "Proud Puerto Rican abuela with a seamstress's eye — tactile, encouraging, exacting about quality; says 'mijo'.",
    specialtyAisle: "apparel-merch",
    greeting:
      "¡Mijo, ven acá! Tell your abuela what you're making — we'll dress it beautifully, you'll see.",
    routeBlessing: "Vamos, mijo — and feel everything before you buy it.",
  },
  {
    id: "grandma-mae",
    name: "Grandma Mae",
    shortName: "Mae",
    emoji: "👵🏿",
    accentColor: "#34c759",
    tagline: "On time is the only time.",
    style:
      "No-nonsense Southern grandmother — plain-spoken, dependable, sweet but brisk; calls people 'sugar'.",
    specialtyAisle: "logistics",
    greeting:
      "Hey there, sugar. Tell me what you need and when you need it — and it'll be there. Period.",
    routeBlessing: "Alright, sugar — route's set. We move quick and we don't dawdle.",
  },
  {
    id: "nai-nai-lin",
    name: "Nai Nai Lin",
    shortName: "Nai Nai",
    emoji: "🧓🏻",
    accentColor: "#2DA8D8",
    tagline: "Measure twice, order once.",
    style:
      "Precise, patient Chinese nai nai — an engineer's calm, gently exacting, never lets a spec slide.",
    specialtyAisle: "electronics",
    greeting:
      "Hello, dear one. Tell me your specs — exactly, please. Precision now saves tears later.",
    routeBlessing: "Our route is exact. Follow each step — no shortcuts, no surprises.",
  },
  {
    id: "yia-yia-sophia",
    name: "Yia Yia Sophia",
    shortName: "Yia Yia",
    emoji: "🧓🏽",
    accentColor: "#E8853D",
    tagline: "Everything arrives like a gift.",
    style:
      "Greek yia yia of boundless hospitality — treats every parcel like a family heirloom; says 'agápi mou'.",
    specialtyAisle: "packaging",
    greeting:
      "Éla, agápi mou! Whatever you're sending, we wrap it with love — and it arrives perfect.",
    routeBlessing: "Éla, follow me, agápi mou — we do this properly.",
  },
];

/* ── Lookup ────────────────────────────────────────────────────────── */

export function getGrandmother(id: string): Grandmother | undefined {
  return GRANDMOTHERS.find((g) => g.id === id);
}

/** Best guide for an aisle: specialty match, else the user's sticky grandma. */
export function pickGrandmotherForIntent(aisleSlug?: string): Grandmother {
  return GRANDMOTHERS.find((g) => g.specialtyAisle === aisleSlug) ?? assignGrandma();
}

/* ── Persistence ───────────────────────────────────────────────────── */

const STORAGE_KEY = "grahmos.grandma";
const SEED_KEY = "grahmos.uid";

export const GRANDMA_CHANGED_EVENT = "grahmos:grandma-changed";
export const OPEN_GRANDMA_PICKER_EVENT = "grahmos:open-grandma-picker";

/** Open the Grandma picker from anywhere (mounted once, inside Concierge). */
export function openGrandmaPicker() {
  window.dispatchEvent(new CustomEvent(OPEN_GRANDMA_PICKER_EVENT));
}

export function loadChosenGrandma(): Grandmother | null {
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    return (id && getGrandmother(id)) || null;
  } catch {
    return null;
  }
}

export function chooseGrandma(id: string) {
  if (!getGrandmother(id)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage unavailable (private mode etc.) — the choice still applies via the event.
  }
  window.dispatchEvent(new CustomEvent(GRANDMA_CHANGED_EVENT, { detail: { id } }));
}

/** Stable per-browser seed so an unassigned visitor always meets the same grandma. */
function stableSeed(): string {
  try {
    let seed = window.localStorage.getItem(SEED_KEY);
    if (!seed) {
      seed = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(SEED_KEY, seed);
    }
    return seed;
  } catch {
    return "grahmos";
  }
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** The user's grandma: their explicit choice, else a sticky deterministic
 *  assignment from a stable per-browser seed — everyone gets "their own". */
export function assignGrandma(): Grandmother {
  return loadChosenGrandma() ?? GRANDMOTHERS[hashString(stableSeed()) % GRANDMOTHERS.length];
}

/** React hook: the current grandma, re-rendering when the choice changes. */
export function useGrandma(): Grandmother {
  const [grandma, setGrandma] = useState<Grandmother>(assignGrandma);
  useEffect(() => {
    const onChange = () => setGrandma(assignGrandma());
    window.addEventListener(GRANDMA_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(GRANDMA_CHANGED_EVENT, onChange);
  }, []);
  return grandma;
}

/* ── Guided Mode narration ─────────────────────────────────────────── */

/** One warm line per stop, in her voice. Kept ≤ 90 characters. */
export function narrate(stop: RouteStop, grandma: Grandmother): string {
  switch (stop.kind) {
    case "aisle": {
      const aisleName = stop.title.replace(/^Start at the /, "").replace(/ Aisle$/, "");
      return `Come, dear — ${aisleName} is just this way.`;
    }
    case "storefront": {
      const merchant = stop.title.replace(/^Visit /, "");
      return `Stop in at ${merchant} — tell them ${grandma.shortName} sent you.`;
    }
    case "compare":
      return "Lay your picks side by side, dear. We never rush a good decision.";
    case "quote":
      return "Ask for your quote, sweetheart — a fair price never minds a question.";
    case "cart":
      return `Almost home. Place the order and ${grandma.shortName} watches it to your door.`;
  }
}
