import React from "react";
import { AbsoluteFill } from "remotion";
import { Cell, Scientist } from "./chars";

const Gear: React.FC<{ x: number; y: number; r: number; color: string; rot?: number }> = ({ x, y, r, color, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={-r * 0.16} y={-r * 1.22} width={r * 0.32} height={r * 0.4} rx={r * 0.06} fill={color} transform={`rotate(${i * 36})`} />
    ))}
    <circle r={r} fill={color} />
    <circle r={r * 0.45} fill="#1A0B3D" />
  </g>
);

const Rays: React.FC<{ cx: number; cy: number; n?: number; color: string }> = ({ cx, cy, n = 16, color }) => (
  <g transform={`translate(${cx},${cy})`}>
    {Array.from({ length: n }, (_, i) => (
      <polygon key={i} points="0,0 -70,-2400 70,-2400" fill={color} opacity={i % 2 ? 0.06 : 0.11} transform={`rotate(${(360 / n) * i})`} />
    ))}
  </g>
);

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="bgL" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0" stopColor="#FF7A45" />
      <stop offset="0.35" stopColor="#B52E7A" />
      <stop offset="0.7" stopColor="#4A1470" />
      <stop offset="1" stopColor="#1A0B3D" />
    </radialGradient>
    <radialGradient id="glowL">
      <stop offset="0" stopColor="#FFD27A" stopOpacity="0.7" />
      <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// 800×800 profile picture: custom "WW" monogram (one zigzag, shared middle stroke) inside a single gear.
// Restrained palette: navy, brass, cream. Everything centred on (400,400).
const WW_PTS = [
  [-250, -105], [-187, 105], [-125, -20], [-62, 105], [0, -105], [62, 105], [125, -20], [187, 105], [250, -105],
];
const pts = (dx = 0, dy = 0) => WW_PTS.map(([x, y]) => `${x + dx},${y + dy}`).join(" ");

const BrandDefs: React.FC = () => (
  <defs>
    <radialGradient id="navy" cx="0.5" cy="0.42" r="0.7">
      <stop offset="0" stopColor="#24345E" />
      <stop offset="1" stopColor="#0B1228" />
    </radialGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F4CF7A" />
      <stop offset="0.55" stopColor="#D9A23F" />
      <stop offset="1" stopColor="#A8721F" />
    </linearGradient>
    <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#EADFC8" />
    </linearGradient>
  </defs>
);

export const LogoMark: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        {/* gear shadow */}
        <g transform="translate(0,10)" opacity={0.5}>
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={-26} y={-330} width={52} height={60} rx={10} fill="#050A18" transform={`rotate(${i * 22.5})`} />
          ))}
          <circle r={290} fill="#050A18" />
        </g>
        {/* gear: brass ring with teeth */}
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={-26} y={-330} width={52} height={60} rx={10} fill="url(#brass)" transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r={290} fill="url(#brass)" />
        <circle r={290} fill="none" stroke="#FFE6A8" strokeWidth={4} opacity={0.6} />
        {/* inner face */}
        <circle r={242} fill="#0B1228" />
        <circle r={236} fill="url(#navy)" />
        <circle r={236} fill="none" stroke="#000" strokeWidth={10} opacity={0.25} />
        {/* bolt holes on the ring */}
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={0} cy={-266} r={8} fill="#7A5214" transform={`rotate(${i * 45 + 22.5})`} />
        ))}
        {/* WW: drop shadow, cream first W, brass second W sharing the centre stroke */}
        <g transform="scale(0.68)">
        <polyline points={pts(0, 12)} fill="none" stroke="#050A18" strokeWidth={62} strokeLinejoin="round" strokeLinecap="round" opacity={0.6} />
        <polyline points={pts()} fill="none" stroke="url(#cream)" strokeWidth={62} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={WW_PTS.slice(4).map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="url(#brass)" strokeWidth={62} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </g>
);

export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: "#0E1630" }}>
    <svg width={800} height={800}>
      <BrandDefs />
      <rect width={800} height={800} fill="url(#navy)" />
      <LogoMark x={400} y={400} s={1} />
    </svg>
  </AbsoluteFill>
);

// 2560×1440 banner in the logo's navy/brass/cream. Safe area (all devices): x 507–2053, y 508–931.
const OutlineGear: React.FC<{ x: number; y: number; r: number; rot?: number; o?: number }> = ({ x, y, r, rot = 0, o = 0.12 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o} fill="none" stroke="#D9A23F" strokeWidth={6}>
    {Array.from({ length: 14 }, (_, i) => (
      <rect key={i} x={-r * 0.11} y={-r * 1.18} width={r * 0.22} height={r * 0.24} rx={r * 0.04} transform={`rotate(${(360 / 14) * i})`} />
    ))}
    <circle r={r} />
    <circle r={r * 0.62} />
    <circle r={r * 0.18} />
  </g>
);

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1228" }}>
    <svg width={2560} height={1440}>
      <BrandDefs />
      <radialGradient id="bannerBg" cx="0.5" cy="0.5" r="0.7">
        <stop offset="0" stopColor="#24345E" />
        <stop offset="1" stopColor="#0B1228" />
      </radialGradient>
      <rect width={2560} height={1440} fill="url(#bannerBg)" />
      {/* faint blueprint grid + outline gears for texture */}
      <g stroke="#D9A23F" strokeWidth={1.5} opacity={0.06}>
        {Array.from({ length: 33 }, (_, i) => <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={1440} />)}
        {Array.from({ length: 19 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 80} x2={2560} y2={i * 80} />)}
      </g>
      <OutlineGear x={260} y={1180} r={360} rot={10} />
      <OutlineGear x={2330} y={250} r={300} rot={-8} />
      <OutlineGear x={2440} y={1250} r={150} rot={20} o={0.08} />
      <OutlineGear x={140} y={180} r={130} o={0.08} />
      {/* lockup: logo + wordmark, centred in the safe area */}
      <LogoMark x={680} y={720} s={0.52} />
      <g fontFamily="Arial Black">
        <text x={880} y={728} fontSize={114} fill="#050A18" opacity={0.6} dy={8}>THE WHY WORKS</text>
        <text x={880} y={728} fontSize={114} fill="url(#cream)">THE <tspan fill="url(#brass)">WHY</tspan> WORKS</text>
        <rect x={884} y={765} width={1110} height={5} rx={3} fill="url(#brass)" opacity={0.8} />
        <text x={886} y={832} fontSize={42} fill="#D9A23F" letterSpacing={11}>THE WHY BEHIND EVERYTHING</text>
      </g>
    </svg>
  </AbsoluteFill>
);
