// Fidelity level 2 generators (DESIGN §8.4, STYLING §8): seeded, varied, edge-to-edge density.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, W } from "./kit";

// deterministic RNG so every render/frame matches
export const rng = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// hex colour helpers
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (v: number[]) => "#" + v.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((x, i) => x + (B[i] - x) * t));
};
export const shade = (c: string, t: number) => (t < 0 ? mix(c, "#000000", -t) : mix(c, "#FFFFFF", t));

// ---- grain overlay (STYLING §8.5) ----
export const Grain: React.FC<{ o?: number }> = ({ o = 0.05 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "overlay" }}>
      <filter id={`grain${f % 4}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 4} />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.2 0" />
      </filter>
      <rect width={W} height={H} filter={`url(#grain${f % 4})`} opacity={o * 6} />
    </svg>
  );
};

// ---- gradient helper: one shape with its own light→shadow gradient + rim ----
export const Grad: React.FC<{ id: string; c: string; angle?: number }> = ({ id, c, angle = 35 }) => {
  const r = (angle * Math.PI) / 180;
  return (
    <linearGradient id={id} x1={0.5 - Math.cos(r) / 2} y1={0.5 - Math.sin(r) / 2} x2={0.5 + Math.cos(r) / 2} y2={0.5 + Math.sin(r) / 2}>
      <stop offset="0" stopColor={shade(c, 0.28)} />
      <stop offset="0.3" stopColor={shade(c, 0.1)} />
      <stop offset="0.55" stopColor={c} />
      <stop offset="0.8" stopColor={shade(c, -0.18)} />
      <stop offset="1" stopColor={shade(c, -0.35)} />
    </linearGradient>
  );
};

// ---- foliage: 4 leaf silhouettes, gradient + midrib + veins ----
const LEAVES = [
  // monstera-ish with splits
  "M0 0 C -120 -40 -150 -200 -40 -300 C 0 -330 40 -330 80 -300 C 190 -200 150 -40 0 0 Z M-30 -150 L -110 -170 M-20 -220 L -90 -250 M30 -150 L 110 -170 M20 -220 L 90 -250",
  // palm frond blade
  "M0 0 C -30 -120 -20 -260 0 -360 C 20 -260 30 -120 0 0 Z",
  // round leaf
  "M0 0 C -140 -60 -140 -260 0 -280 C 140 -260 140 -60 0 0 Z",
  // fern / long pointy
  "M0 0 C -60 -100 -70 -240 0 -380 C 70 -240 60 -100 0 0 Z",
];
export const Foliage: React.FC<{ seed: number; base: string; y0: number; y1: number; count?: number; scale?: [number, number]; sway?: number; light?: string }> = ({
  seed, base, y0, y1, count = 26, scale = [0.6, 1.2], sway = 3, light = "#E8FF7A",
}) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: count }, (_, i) => {
    const kind = Math.floor(r() * LEAVES.length);
    const x = r() * (W + 200) - 100;
    const y = y0 + r() * (y1 - y0);
    const s = scale[0] + r() * (scale[1] - scale[0]);
    const rot = r() * 120 - 60;
    const hue = r() * 0.16 - 0.08;
    const c = hue > 0 ? shade(base, hue) : mix(base, "#1A3A8A", -hue * 1.5);
    const sw = Math.sin(f / 30 + i) * sway;
    const gid = `lf${seed}_${i}`;
    return (
      <g key={i} transform={`translate(${x},${y}) rotate(${rot + sw}) scale(${s})`}>
        <defs><Grad id={gid} c={c} angle={60} /></defs>
        <path d={LEAVES[kind].split(" M")[0]} fill={shade(c, -0.3)} transform="translate(6,8)" opacity={0.5} />
        <path d={LEAVES[kind].split(" M")[0]} fill={`url(#${gid})`} />
        <path d="M0 0 C 0 -100 0 -200 0 -290" stroke={shade(c, 0.35)} strokeWidth={6} fill="none" opacity={0.7} strokeLinecap="round" />
        {kind === 0 && <path d={"M" + LEAVES[0].split(" M").slice(1).join(" M")} stroke={shade(c, -0.25)} strokeWidth={10} strokeLinecap="round" />}
        <path d="M-6 -60 C -40 -110 -50 -170 -30 -230" stroke={light} strokeWidth={5} fill="none" opacity={0.25} strokeLinecap="round" />
      </g>
    );
  });
  return <g>{items}</g>;
};

// ---- dense cell field for the micro world: 3 depth bands, cooler/darker at the back ----
export const CellField: React.FC<{ seed: number; base?: string; far?: string; count?: number }> = ({
  seed, base = "#F27A9A", far = "#5A1A5A", count = 70,
}) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  const layers = [0, 1, 2].map((layer) => {
    const n = Math.round(count * [0.45, 0.35, 0.2][layer]);
    const depth = [0.75, 0.4, 0][layer]; // mix toward far colour
    const size = [[40, 80], [80, 140], [160, 260]][layer];
    return Array.from({ length: n }, (_, i) => {
      const x = r() * (W + 300) - 150, y = r() * (H + 300) - 150;
      const rr = size[0] + r() * (size[1] - size[0]);
      const c = mix(shade(base, r() * 0.14 - 0.07), far, depth);
      const gid = `cf${seed}_${layer}_${i}`;
      const drift = Math.sin(f / (60 + layer * 20) + i) * (4 + layer * 6);
      return (
        <g key={`${layer}-${i}`} transform={`translate(${x + drift},${y + drift * 0.6})`} opacity={layer === 2 ? 0.55 : 1}>
          <defs>
            <radialGradient id={gid} cx="0.38" cy="0.35" r="0.7">
              <stop offset="0" stopColor={shade(c, 0.3)} />
              <stop offset="0.6" stopColor={c} />
              <stop offset="1" stopColor={shade(c, -0.3)} />
            </radialGradient>
          </defs>
          <circle r={rr} fill={`url(#${gid})`} />
          <circle r={rr} fill="none" stroke={shade(c, 0.35)} strokeWidth={Math.max(3, rr * 0.05)} opacity={0.5} />
          <circle cx={rr * 0.12} cy={rr * 0.1} r={rr * 0.36} fill={shade(c, -0.22)} opacity={0.8} />
          {/* membrane micro-texture: tiny dots */}
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={Math.cos(k * 1.3 + i) * rr * 0.6} cy={Math.sin(k * 1.7 + i) * rr * 0.6} r={Math.max(2, rr * 0.04)} fill={shade(c, -0.15)} opacity={0.6} />
          ))}
          <ellipse cx={-rr * 0.35} cy={-rr * 0.4} rx={rr * 0.22} ry={rr * 0.12} fill="#FFFFFF" opacity={0.35} />
        </g>
      );
    });
  });
  // draw back (layer 0) first
  return <g>{layers[0]}{layers[1]}{layers[2]}</g>;
};

// ---- dappled light patches (not particles): large soft irregular blobs ----
export const Dapple: React.FC<{ seed: number; color?: string; o?: number; n?: number }> = ({ seed, color = "#FFF2C4", o = 0.12, n = 9 }) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * W, y = r() * H, rx = 120 + r() * 220, ry = 60 + r() * 120;
        return <ellipse key={i} cx={x + Math.sin(f / 80 + i) * 20} cy={y} rx={rx} ry={ry} fill={color} opacity={o * (0.6 + 0.4 * Math.sin(f / 50 + i))} style={{ filter: "blur(30px)" }} />;
      })}
    </g>
  );
};

// ---- machine wall: dense gauges, cables, monitors (control rooms, labs) ----
export const MachineWall: React.FC<{ seed: number; base?: string }> = ({ seed, base = "#2A1A5A" }) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < 34; i++) {
    const x = r() * W, y = r() * H, k = Math.floor(r() * 4), s = 0.6 + r() * 0.9;
    const c = shade(base, r() * 0.2 - 0.05);
    if (k === 0) {
      // gauge
      const ang = -100 + ((Math.sin(f / 20 + i) + 1) / 2) * 200;
      parts.push(
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <circle r={52} fill={shade(c, -0.3)} />
          <circle r={44} fill="#F4EEE2" />
          <rect x={-3} y={-38} width={6} height={40} rx={3} fill="#FF4D3D" transform={`rotate(${ang})`} />
          <circle r={8} fill="#2A0F5A" />
        </g>,
      );
    } else if (k === 1) {
      // monitor with waveform
      parts.push(
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <rect x={-80} y={-55} width={160} height={110} rx={14} fill={shade(c, -0.35)} />
          <rect x={-70} y={-45} width={140} height={90} rx={8} fill="#0B2A3A" />
          <path d={`M-62 0 ${Array.from({ length: 12 }, (_, j) => `L ${-62 + j * 11} ${Math.sin(j + f / 4 + i) * 22}`).join(" ")}`} stroke="#3FE0B0" strokeWidth={4} fill="none" />
        </g>,
      );
    } else if (k === 2) {
      // pipe
      parts.push(
        <g key={i} transform={`translate(${x},${y}) rotate(${r() > 0.5 ? 0 : 90}) scale(${s})`}>
          <rect x={-200} y={-16} width={400} height={32} rx={16} fill={shade(c, -0.1)} />
          <rect x={-200} y={-16} width={400} height={10} rx={5} fill={shade(c, 0.25)} />
          <rect x={-30} y={-24} width={20} height={48} rx={6} fill="#D9A23F" />
        </g>,
      );
    } else {
      // blinking light cluster
      parts.push(
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <rect x={-60} y={-24} width={120} height={48} rx={12} fill={shade(c, -0.3)} />
          {[-36, -12, 12, 36].map((lx, j) => (
            <circle key={j} cx={lx} cy={0} r={8} fill={["#2FE08A", "#FFD23F", "#FF4D6D", "#3FC1C9"][j]} opacity={0.4 + 0.6 * ((Math.floor(f / 8) + i + j) % 2)} />
          ))}
        </g>,
      );
    }
  }
  return <g opacity={0.55}>{parts}</g>;
};
