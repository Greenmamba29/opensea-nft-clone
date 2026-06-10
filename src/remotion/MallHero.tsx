import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Accio Mall hero composition — a looping cinematic of the virtual mall:
 * storefront cards spring into the atrium, the concierge greets, gold dust drifts.
 * Rendered in-browser via @remotion/player on the landing page.
 */

const STOREFRONTS = [
  { name: "Terra Home", tag: "Home & Living", badge: "Premium", delay: 20, x: 8, y: 18, tint: "#EDE7F8" },
  { name: "Crafted by India", tag: "Local Makers", badge: "New", delay: 38, x: 38, y: 8, tint: "#FBF3DC" },
  { name: "Brewed Culture", tag: "Food & Beverage", badge: "Top Rated", delay: 56, x: 68, y: 20, tint: "#E8F4EE" },
];

const CATEGORIES = ["All Categories", "Local Makers", "Office Supplies", "Food & Beverage", "Corporate Gifting", "B2B Sourcing"];

function GoldDust() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => {
        const seed = (i * 137) % 100;
        const x = (seed * 9.7) % 100;
        const drift = ((frame + i * 23) % durationInFrames) / durationInFrames;
        const y = 100 - drift * 120;
        const opacity = Math.sin(drift * Math.PI) * 0.7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: 999,
              background: "#E5C963",
              opacity,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </>
  );
}

function StorefrontCard({ s }: { s: (typeof STOREFRONTS)[number] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - s.delay, fps, config: { damping: 14, mass: 0.8 } });
  const hover = Math.sin((frame - s.delay) / 35) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: `${s.x}%`,
        top: `${s.y}%`,
        width: "24%",
        transform: `translateY(${(1 - entrance) * 120 + hover}px) scale(${0.7 + entrance * 0.3})`,
        opacity: entrance,
        background: "rgba(255,255,255,0.96)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(43, 16, 90, 0.35)",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ height: 86, background: s.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
        🏬
      </div>
      <div style={{ padding: "10px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#171221" }}>{s.name}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#5B21B6", background: "#EDE7F8", borderRadius: 999, padding: "3px 8px" }}>
            {s.badge}
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#6F6885", marginTop: 3 }}>{s.tag}</div>
      </div>
    </div>
  );
}

export function MallHero() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sidebarIn = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const conciergeIn = spring({ frame: frame - 84, fps, config: { damping: 14 } });
  const msg = "Hello! I'm your Accio Concierge. I can help you find suppliers, compare quotes, or lease the perfect storefront.";
  const typed = msg.slice(0, Math.max(0, Math.round(interpolate(frame, [100, 220], [0, msg.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Atrium backdrop */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 90% at 50% 0%, #7C3AED 0%, #4C1D95 45%, #2A1057 100%)",
        }}
      />
      {/* Atrium floor glow */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: "-30%",
          height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(229,201,99,0.35), transparent)",
        }}
      />
      <GoldDust />

      {/* Wordmark */}
      <div
        style={{
          position: "absolute",
          top: "7%",
          width: "100%",
          textAlign: "center",
          fontFamily: "'Playfair Display', serif",
          color: "white",
          opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 1 }}>
          Accio<span style={{ color: "#E5C963" }}>✦</span>
        </div>
        <div style={{ fontSize: 12, letterSpacing: 6, color: "#E5C963", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
          VIRTUAL MALL
        </div>
      </div>

      {/* Category rail */}
      <div
        style={{
          position: "absolute",
          left: "3.5%",
          top: "30%",
          width: "20%",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 14,
          padding: 12,
          transform: `translateX(${(1 - sidebarIn) * -160}px)`,
          opacity: sidebarIn,
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 20px 50px rgba(43,16,90,0.3)",
        }}
      >
        {CATEGORIES.map((c, i) => (
          <div
            key={c}
            style={{
              fontSize: 11.5,
              fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? "#5B21B6" : "#4A4458",
              background: i === 0 ? "#EDE7F8" : "transparent",
              borderRadius: 8,
              padding: "7px 10px",
              marginBottom: 2,
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Storefronts */}
      {STOREFRONTS.map((s) => (
        <StorefrontCard key={s.name} s={s} />
      ))}

      {/* Concierge bubble */}
      <div
        style={{
          position: "absolute",
          right: "4%",
          bottom: "8%",
          width: "38%",
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          transform: `translateY(${(1 - conciergeIn) * 80}px)`,
          opacity: conciergeIn,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: "linear-gradient(135deg, #E5C963, #C9A227)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          💁‍♀️
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: "16px 16px 4px 16px",
            padding: "12px 16px",
            boxShadow: "0 18px 44px rgba(43,16,90,0.35)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5B21B6", marginBottom: 4 }}>
            Accio Concierge <span style={{ color: "#34a065" }}>● Live</span>
          </div>
          <div style={{ fontSize: 13, color: "#171221", minHeight: 36, lineHeight: 1.45 }}>
            {typed}
            <span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>▌</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const MALL_HERO_DURATION = 360;
export const MALL_HERO_FPS = 30;
