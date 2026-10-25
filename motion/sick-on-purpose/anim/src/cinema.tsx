// Cinema layer: a moving camera with parallax depth + depth of field, and VFX (bloom, god rays, haze, dust, flare, grade).
// Usage: <Cine cam={cam}> <Plane depth={0.3} blur={2}>...far stuff...</Plane> <Plane depth={1}>subject</Plane> ... </Cine>
// depth: 0 = infinitely far (doesn't move), 1 = subject plane, >1 = foreground (moves faster, should be blurred).
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { H, W } from "./kit";
import { rng } from "./gen";

export type Cam = { z: number; x: number; y: number; ox?: number; oy?: number }; // zoom, pan (px), zoom origin
type Key = { at: number; z: number; x: number; y: number };

// Keyframed camera with eased moves + a tiny handheld drift so it never sits dead still.
export const useCam = (keys: Key[], { ox = W / 2, oy = H / 2, drift = 1 } = {}): Cam => {
  const f = useCurrentFrame();
  const t = keys.map((k) => k.at);
  const e = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const pick = (k: "z" | "x" | "y") => (keys.length === 1 ? keys[0][k] : interpolate(f, t, keys.map((q) => q[k]), e));
  return {
    z: pick("z") + Math.sin(f / 90) * 0.004 * drift,
    x: pick("x") + Math.sin(f / 53) * 6 * drift,
    y: pick("y") + Math.cos(f / 61) * 4 * drift,
    ox, oy,
  };
};

const CamCtx = createContext<Cam>({ z: 1, x: 0, y: 0 });
export const Cine: React.FC<{ cam: Cam; children: React.ReactNode; bg?: string }> = ({ cam, children, bg = "#000" }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
    <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>
  </AbsoluteFill>
);

// One depth plane. Parallax: pan and zoom scale with depth; blur = depth of field.
export const Plane: React.FC<{ depth: number; blur?: number; children: React.ReactNode; html?: boolean; blend?: React.CSSProperties["mixBlendMode"]; opacity?: number }> = ({ depth, blur = 0, children, html, blend, opacity = 1 }) => {
  const c = useContext(CamCtx);
  const z = 1 + (c.z - 1) * depth;
  const tx = -c.x * depth, ty = -c.y * depth;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px,${ty}px) scale(${z})`, transformOrigin: `${c.ox ?? W / 2}px ${c.oy ?? H / 2}px`, filter: blur ? `blur(${blur}px)` : undefined, mixBlendMode: blend, opacity }}>
      {html ? children : <svg width={W} height={H} style={{ overflow: "visible" }}>{children}</svg>}
    </div>
  );
};

// SVG filter defs: bloom (soft glow around bright things)
export const BloomDefs: React.FC<{ id?: string; r?: number }> = ({ id = "bloom", r = 16 }) => (
  <defs>
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={r} result="b" />
      <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.6 0" result="bb" />
      <feMerge><feMergeNode in="bb" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

// Volumetric light rays fanning out from a source
export const GodRays: React.FC<{ x: number; y: number; c?: string; n?: number; len?: number; o?: number; spread?: number; dir?: number }> = ({ x, y, c = "#FFE2A8", n = 9, len = 1400, o = 0.12, spread = Math.PI * 2, dir = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs><radialGradient id={`gr${x}${y}`} cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={c} stopOpacity={o * 2} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
      {Array.from({ length: n }, (_, i) => {
        const a = dir + (i / n) * spread + Math.sin(f / 80 + i) * 0.04 - spread / 2 + (spread === Math.PI * 2 ? spread / 2 : 0);
        const w = 0.05 + (i % 3) * 0.025;
        return <path key={i} d={`M${x} ${y} L ${x + Math.cos(a - w) * len} ${y + Math.sin(a - w) * len} L ${x + Math.cos(a + w) * len} ${y + Math.sin(a + w) * len} Z`} fill={`url(#gr${x}${y})`} opacity={0.6 + 0.4 * Math.sin(f / 30 + i * 1.7)} />;
      })}
    </g>
  );
};

// Floating dust / motes catching the light
export const Dust: React.FC<{ seed?: number; n?: number; c?: string; size?: number; o?: number; rise?: number }> = ({ seed = 1, n = 50, c = "#FFF2D0", size = 3, o = 0.5, rise = 0.4 }) => {
  const f = useCurrentFrame();
  const R = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x0 = R() * W, y0 = R() * H, sp = 0.3 + R(), ph = R() * 6, r = size * (0.4 + R());
        const x = (x0 + Math.sin(f / 70 + ph) * 30 + f * sp * 0.2) % W;
        const y = ((y0 - f * rise * sp) % H + H) % H;
        return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(f / 40 + ph)))} />;
      })}
    </g>
  );
};

// Horizon haze / fog band
export const Haze: React.FC<{ y: number; h?: number; c?: string; o?: number }> = ({ y, h = 260, c = "#C88AA8", o = 0.4 }) => (
  <g>
    <defs><linearGradient id={`hz${y}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity="0" /><stop offset="0.5" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
    <rect x={-200} y={y - h / 2} width={W + 400} height={h} fill={`url(#hz${y})`} />
  </g>
);

// Lens flare: ghosts along the line from the light through frame centre (screen space)
export const Flare: React.FC<{ x: number; y: number; c?: string; o?: number }> = ({ x, y, c = "#FFD8A8", o = 0.5 }) => {
  const dx = W / 2 - x, dy = H / 2 - y;
  const ghosts = [[0.4, 40, 0.18], [0.8, 18, 0.25], [1.25, 70, 0.1], [1.6, 26, 0.2], [2.0, 120, 0.07]];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
      <defs><radialGradient id="flg"><stop offset="0" stopColor={c} stopOpacity="1" /><stop offset="0.7" stopColor={c} stopOpacity="0.4" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={x} cy={y} rx={520} ry={10} fill={c} opacity={o * 0.35} />
      {ghosts.map(([t, r, a], i) => <circle key={i} cx={x + dx * t} cy={y + dy * t} r={r} fill="url(#flg)" opacity={a * o * 2} />)}
    </svg>
  );
};

// Final grade: colour wash, soft vignette, light leak, and a touch of chromatic edge (screen space, HTML)
export const Grade: React.FC<{ warm?: string; cool?: string; vig?: number; leak?: number }> = ({ warm = "#FF9A5A", cool = "#2A3A8A", vig = 0.55, leak = 0.12 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${cool}33 0%, transparent 45%, ${warm}22 100%)`, mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${30 + Math.sin(f / 120) * 10}% 20%, ${warm} 0%, transparent 45%)`, opacity: leak, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,${vig}) 100%)` }} />
    </>
  );
};

// Transition: zoom-blur dip between shots (place at the start of a shot)
export const ZoomIn: React.FC<{ dur?: number }> = ({ dur = 14 }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, 1 - f / dur);
  if (t <= 0) return null;
  return <AbsoluteFill style={{ background: "#05030F", opacity: t * t, backdropFilter: `blur(${t * 24}px)` }} />;
};
