import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Immersive page transitions — every route change zooms INTO the new page.
 *
 * The zoom originates from the user's last click/tap, so tapping an aisle
 * card feels like diving into that aisle. Zero dependencies: a keyed
 * remount plays the `page-zoom-enter` animation (globals.css), with the
 * transform-origin set via CSS custom properties. Respects
 * prefers-reduced-motion (the CSS disables the animation entirely).
 */

// Module-level: remember where the user last pointed, in viewport %.
let lastPointer = { x: 50, y: 38 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (e) => {
      if (e.clientX || e.clientY) {
        const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
        lastPointer = {
          x: clamp((e.clientX / window.innerWidth) * 100),
          y: clamp((e.clientY / window.innerHeight) * 100),
        };
      }
    },
    { capture: true, passive: true }
  );
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const originRef = useRef(lastPointer);

  // Capture the origin for THIS navigation at the moment the path changes,
  // so later mouse movement doesn't shift an in-flight animation.
  const pathRef = useRef(pathname);
  if (pathRef.current !== pathname) {
    pathRef.current = pathname;
    originRef.current = lastPointer;
  }

  // Scroll to top on navigation — zooming into a page starts at its top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div
      key={pathname}
      className="page-zoom-enter"
      style={
        {
          "--zoom-x": `${originRef.current.x}%`,
          "--zoom-y": `${originRef.current.y}%`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
