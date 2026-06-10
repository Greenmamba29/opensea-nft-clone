# design.md — The GrahmOS Design System

> The visual constitution. Two themes coexist; every new surface inherits one of them.
> Source of truth: `src/styles/globals.css`, `tailwind.config.ts`, `src/components/ui/`.

---

## 1. Two themes, one codebase

| Theme | Where | Class | Mood |
|---|---|---|---|
| **GrahmOS (light)** | `/` landing, `/os` dashboard | `.grahmos-theme` | Premium retail — cream, royal purple, gold |
| **OpenSea (dark)** | `/mall/*` shopping scaffold | (default `os.*`) | Onchain marketplace — near-black, electric blue |

The GrahmOS theme is the **brand**. The dark theme is preserved for the legacy mall
shopping flow and will migrate to GrahmOS light over time. Never mix the two on one screen.

## 2. Tokens (HSL CSS variables, shadcn-compatible)

Defined under `.grahmos-theme` in `src/styles/globals.css`, surfaced to Tailwind via
semantic color names in `tailwind.config.ts`.

```
Brand        purple #5B21B6   purple-deep #3B1680   purple-light #7C3AED
             gold   #C9A227   gold-light  #E5C963
Canvas       background = warm cream #FAF9F7   foreground = ink #171221
Semantic     primary / secondary / muted / accent / card / border / ring
Radius       --radius: 0.75rem   (md = -2px, sm = -4px)
```

**Rule:** Components reference *semantic* tokens (`bg-primary`, `text-muted-foreground`),
never raw hex. Re-skinning is a token change, not a component edit.

## 3. Typography

- **Display:** `Playfair Display` (serif) — headlines, the `GrahmOS✦` wordmark. Editorial,
  premium. Loaded in `index.html`.
- **Body/UI:** `Inter` — everything else.
- Scale is Tailwind default; display headings use `font-display`.

## 4. Motion

| Mechanism | Use | Source |
|---|---|---|
| **Remotion** | The hero "video" — storefront cards spring in, gold dust, concierge types | `src/remotion/MallHero.tsx` via `@remotion/player` |
| **Scroll reveal** | Section fade-and-rise on enter | `src/components/grahmos/Reveal.tsx` (IntersectionObserver) |
| **Tailwind keyframes** | `fade-up`, `float`, `shimmer` | `tailwind.config.ts` |
| **Micro** | Hover lifts, transitions | utility classes |

**Principle:** Motion communicates state and hierarchy; it is never decorative noise.
The hero loops because it is a storefront *demo*, not an animation for its own sake.

## 5. The component library (`src/components/ui/`)

Hand-written, **Tailwind-3 compatible**, shadcn-shaped (so the shadcn MCP/registry stays
usable) but with zero Radix runtime dependency where avoidable. Each is a pure,
token-driven primitive:

| Component | Contract |
|---|---|
| `button.tsx` | `variant` (default/gold/outline/secondary/ghost/link/destructive) × `size`, via CVA |
| `card.tsx` | `Card`/`Header`/`Title`/`Description`/`Content`/`Footer` — composition, not config |
| `badge.tsx` | status pills (success/warning/info/gold/...) |
| `table.tsx` | semantic table primitives |
| `switch.tsx`, `progress.tsx`, `avatar.tsx` | controlled, accessible primitives |

**Invariant:** No feature introduces a bespoke button/card. If a primitive is missing,
add it here, themed — never inline a one-off.

## 6. Layout grammar

- **Landing** (`src/pages/grahmos/LandingPage.tsx`): max-w-7xl, generous vertical rhythm,
  alternating full-bleed bands, sticky translucent nav.
- **Dashboard** (`src/pages/grahmos/MallOSPage.tsx`): fixed dark sidebar + content grid;
  KPI row → charts row → tables row → zoning map. recharts for all data viz.
- **Mall** (`src/components/Layout.tsx`): hover-expand icon rail + header + content.

## 7. The concierge surface

`src/components/grahmos/Concierge.tsx` — a floating launcher present on landing + mall.
It is the *visible* soul of the white-glove layer. Design constraints: minimal,
non-intrusive, brand-gradient header, suggested-prompt chips, typing indicator,
never blocks the page. See `agents.md` for its brain.

## 8. Accessibility & responsiveness baseline

- Mobile-first; every page collapses gracefully (grids → stacks at `lg`/`md`).
- Semantic HTML, `role`/`aria` on interactive primitives (`switch`, dialogs).
- Color is never the sole signal (icons + text on every status).

## 9. Extension checklist (read before adding any UI)

1. Which theme? (GrahmOS light unless it's inside `/mall`.)
2. Does a `ui/` primitive exist? Reuse it. If not, add it *there*, themed.
3. Semantic tokens only — no raw hex.
4. Role-gate anything beyond consumer scope.
5. Motion must mean something.
