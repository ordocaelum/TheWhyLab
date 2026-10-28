// YouTube thumbnails (1280x720 stills). Formula: one terrified face + 2–3 word caps phrase + red glow + the "thing".
import React from "react";
import { AbsoluteFill } from "remotion";
import { AVATARS, Human2 } from "./human2";
import { Brain } from "./anatomy";
import { Particle, PLASTIC } from "./plastic";
import { rng } from "./gen";

const TW = 1280, TH = 720;
const Outline: React.FC<{ t: string; x: number; y: number; size: number; fill: string; glow?: string; anchor?: "start" | "middle" | "end"; rot?: number }> = ({ t, x, y, size, fill, glow, anchor = "middle", rot = 0 }) => (
  <g transform={`rotate(${rot},${x},${y})`}>
    <text x={x} y={y} textAnchor={anchor} fontFamily="Arial Black" fontSize={size} fill={fill} stroke="#0A0A14" strokeWidth={size * 0.16} strokeLinejoin="round" paintOrder="stroke" style={glow ? { filter: `drop-shadow(0 0 ${size * 0.25}px ${glow})` } : undefined}>{t}</text>
  </g>
);

export const ThumbMicro: React.FC = () => {
  const R = rng(77);
  const L = AVATARS.find((a) => a.name === "Ethan")!.L;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={TW} height={TH}>
        <defs>
          <radialGradient id="tbg" cx="0.72" cy="0.55" r="0.75"><stop offset="0" stopColor="#FF3A3A" /><stop offset="0.45" stopColor="#8A0A1A" /><stop offset="1" stopColor="#14020A" /></radialGradient>
          <radialGradient id="tglow"><stop offset="0" stopColor="#FFB0B0" stopOpacity="0.9" /><stop offset="1" stopColor="#FF2D3D" stopOpacity="0" /></radialGradient>
          <filter id="tbl"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <rect width={TW} height={TH} fill="url(#tbg)" />
        {/* light rays */}
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M920 400 L ${920 + Math.cos(a - 0.08) * 1200} ${400 + Math.sin(a - 0.08) * 1200} L ${920 + Math.cos(a + 0.08) * 1200} ${400 + Math.sin(a + 0.08) * 1200} Z`} fill="#FFFFFF" opacity={0.05} />; })}
        {/* background particles, blurred */}
        <g filter="url(#tbl)">{Array.from({ length: 40 }, (_, i) => <Particle key={i} x={R() * TW} y={R() * TH} r={4 + R() * 9} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={R() * 360} glow={0.6} />)}</g>
        {/* the brain, packed with glowing plastic */}
        <circle cx={920} cy={420} r={300} fill="url(#tglow)" opacity={0.6} />
        <g transform="translate(920,430)"><Brain id="tb" x={0} y={0} s={0.82} f={0} /></g>
        {Array.from({ length: 34 }, (_, i) => { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 200; return <Particle key={i} x={920 + Math.cos(a) * d * 1.25} y={380 + Math.sin(a) * d * 0.8} r={6 + R() * 8} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={R() * 360} glow={1.3} />; })}
        {/* terrified face, hands on cheeks */}
        <g transform="translate(330,1250) scale(1.25)">
          <Human2 L={L} x={0} y={0} s={1} f={0} expr="terrified" look={1} />
        </g>
        {[-1, 1].map((k) => (
          <g key={k} transform={`translate(${330 + k * 150},${560}) rotate(${k * 14}) scale(${k},1)`}>
            {/* fingers fanned up the cheek */}
            {[-30, -10, 10, 30].map((fx, q) => <rect key={q} x={fx - 11} y={-120 + Math.abs(fx) * 0.8} width={22} height={90} rx={11} fill="#E6B48E" stroke="#C99470" strokeWidth={3} />)}
            <path d="M-46 -40 Q -50 40 0 56 Q 50 40 46 -40 Z" fill="#E6B48E" stroke="#C99470" strokeWidth={3} />
            <path d="M46 -10 Q 74 -40 70 -70" stroke="#E6B48E" strokeWidth={22} strokeLinecap="round" fill="none" />
          </g>
        ))}
        {/* sweat drops */}
        <path d="M470 230 q 14 26 0 40 q -14 -14 0 -40 Z" fill="#BFF6FF" />
        <path d="M200 260 q 10 20 0 30 q -10 -10 0 -30 Z" fill="#BFF6FF" />
        {/* title */}
        <Outline t="IT'S IN YOU" x={TW / 2 + 30} y={130} size={128} fill="#FFFFFF" glow="#FF2D3D" rot={-2} />
        {/* warning badge */}
        <g transform="translate(1170,610)"><path d="M0 -70 L 66 50 L -66 50 Z" fill="#FFD23F" stroke="#0A0A14" strokeWidth={10} strokeLinejoin="round" /><rect x={-7} y={-34} width={14} height={48} rx={7} fill="#0A0A14" /><circle cy={32} r={8} fill="#0A0A14" /></g>
      </svg>
    </AbsoluteFill>
  );
};
