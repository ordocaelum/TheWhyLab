// Shared kit for landscape long-form. Follows motion/DESIGN.md (layer stack) + motion/STYLING.md (tokens).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const sp = (f: number, delay = 0, damping = 12) => spring({ frame: f - delay, fps: FPS, config: { damping } });
export const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// STYLING §2 palette keys: [edge, mid, centre], light, accent
export const KEYS = {
  dusk: { bg: ["#1A0B3D", "#4A1470", "#B52E7A"], light: "#FFD27A", accent: "#3FD1C4" },
  deep: { bg: ["#05030F", "#14205A", "#3A2A8F"], light: "#CFD8FF", accent: "#FF4FD8" },
  jungle: { bg: ["#0B1A40", "#123B2A", "#1E6B4A"], light: "#E8FF7A", accent: "#FF8A1F" },
  alarm: { bg: ["#2A0508", "#7A0F1A", "#FF4D3D"], light: "#FFE066", accent: "#3FE0E8" },
  lab: { bg: ["#0B1033", "#13406B", "#3FC1C9"], light: "#B8FFFA", accent: "#FFD23F" },
  verdict: { bg: ["#0B1033", "#0E3A2B", "#1E6B4A"], light: "#B8FFD8", accent: "#2FE08A" },
  morning: { bg: ["#1B1440", "#3A2A6B", "#7A5AA8"], light: "#FFE2A8", accent: "#FF9EB0" },
};
export type Key = keyof typeof KEYS;
export const INK = "#2A0F5A";

// Layers 1–2 (backdrop + light source with rays) and 9 (vignette). Children = layers 3–8.
export const Stage: React.FC<{
  k: Key; lx?: number; ly?: number; rays?: boolean; head?: React.ReactNode; children?: React.ReactNode; zoom?: number;
}> = ({ k, lx = W / 2, ly = H * 0.45, rays = true, head, children, zoom = 0.012 }) => {
  const f = useCurrentFrame();
  const P = KEYS[k];
  const id = `g${k}`;
  return (
    <AbsoluteFill style={{ background: P.bg[0], overflow: "hidden" }}>
      <svg width={W} height={H} style={{ transform: `scale(${1 + (f / 150) * zoom})`, transformOrigin: `${(lx / W) * 100}% ${(ly / H) * 100}%` }}>
        <defs>
          <radialGradient id={id} cx={lx / W} cy={ly / H} r="0.85">
            <stop offset="0" stopColor={P.bg[2]} />
            <stop offset="0.5" stopColor={P.bg[1]} />
            <stop offset="1" stopColor={P.bg[0]} />
          </radialGradient>
          <radialGradient id={`${id}l`}>
            <stop offset="0" stopColor={P.light} stopOpacity="0.55" />
            <stop offset="1" stopColor={P.light} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <radialGradient id="bloom">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#${id})`} />
        {rays && (
          <g transform={`translate(${lx},${ly}) rotate(${f * 0.08})`}>
            {Array.from({ length: 14 }, (_, i) => (
              <polygon key={i} points="0,0 -90,-1600 90,-1600" fill={P.light} opacity={i % 2 ? 0.05 : 0.09}
                transform={`rotate(${(360 / 14) * i})`} />
            ))}
          </g>
        )}
        <circle cx={lx} cy={ly} r={520} fill={`url(#${id}l)`} />
        {children}
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
      {head}
    </AbsoluteFill>
  );
};

// Layer 9 type: headline + pill (STYLING §6), landscape sizes
export const Headline: React.FC<{ big: string; small?: string; top?: number; align?: "center" | "left" }> = ({ big, small, top = 70, align = "center" }) => {
  const f = useCurrentFrame();
  const s = sp(f, 3);
  const s2 = sp(f, 12);
  return (
    <div style={{ position: "absolute", top, left: align === "left" ? 110 : 0, width: align === "left" ? "auto" : "100%", textAlign: align, fontFamily: "Arial Black, Arial, sans-serif" }}>
      <div style={{ fontSize: 130, color: "#FFFFFF", lineHeight: 1, transform: `translateY(${(1 - s) * -50}px)`, opacity: s, textShadow: `0 10px 0 ${INK}, 0 18px 40px rgba(0,0,0,0.5)` }}>{big}</div>
      {small && (
        <div style={{ display: "inline-block", marginTop: 22, padding: "12px 34px", borderRadius: 40, background: "#FF8A1F", color: INK, fontSize: 48, letterSpacing: 2, transform: `scale(${s2})`, boxShadow: "0 8px 0 #B5480A" }}>{small}</div>
      )}
    </div>
  );
};

// Layer 8: hand-placed sparkle (pop, twinkle, fade). Use 3–8 per frame, never a field.
export const Sparkle: React.FC<{ x: number; y: number; at: number; size?: number; color?: string }> = ({ x, y, at, size = 40, color = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const s = t < 10 ? t / 10 : t < 25 ? 1 - Math.sin((t - 10) / 5) * 0.15 : (40 - t) / 15;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${t * 2})`}>
      <circle r={size} fill={color} opacity={0.18} />
      <path d={`M0 ${-size} L${size * 0.16} 0 L0 ${size} L${-size * 0.16} 0 Z M${-size} 0 L0 ${size * 0.16} L${size} 0 L0 ${-size * 0.16} Z`} fill={color} />
    </g>
  );
};

// Layer 7: dark, slightly blurred foreground framer blob
export const Framer: React.FC<{ d: string; color?: string; drift?: number }> = ({ d, color = "#05030F", drift = 1 }) => {
  const f = useCurrentFrame();
  return <path d={d} fill={color} opacity={0.85} transform={`translate(${Math.sin(f / 40) * 6 * drift},0)`} style={{ filter: "blur(3px)" }} />;
};
