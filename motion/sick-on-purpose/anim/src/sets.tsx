// Scene templates ("sets"), level 2 (DESIGN §1 layer stack + §8 density, STYLING §8).
// Every set: 1920×1080, children = actor layer (Doc, avatars, props), drawn between midground and foreground framers.
// Each set documents its SLOTS: where actors/props stand so they sit correctly in perspective and light.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Thing } from "./objects";
import { Dapple, Grad, rng, shade } from "./gen";

const W = 1920, H = 1080;
const NAVY = ["#0B1228", "#16224A", "#24345E", "#33477A"];
const BRASS = ["#A8721F", "#D9A23F", "#F4CF7A"];

// ---------- shared set pieces ----------
const Vignette: React.FC<{ o?: number }> = ({ o = 0.6 }) => (
  <g>
    <defs>
      <radialGradient id="setvig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={o} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#setvig)" />
  </g>
);

const LampPool: React.FC<{ x: number; y: number; r: number; c?: string; o?: number }> = ({ x, y, r, c = "#FFE2A8", o = 0.35 }) => (
  <g>
    <defs><radialGradient id={`lp${x}${y}`}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#lp${x}${y})`} />
  </g>
);

// back wall with panels + brass wainscot rail at y=rail
const Wall: React.FC<{ rail?: number }> = ({ rail = 700 }) => (
  <g>
    <defs>
      <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NAVY[1]} /><stop offset="1" stopColor={NAVY[2]} /></linearGradient>
      <linearGradient id="wains" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A2550" /><stop offset="1" stopColor={NAVY[0]} /></linearGradient>
    </defs>
    <rect width={W} height={rail} fill="url(#wallg)" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={4} height={rail} fill="#000" opacity={0.1} />)}
    {/* subtle wallpaper micro-texture */}
    {Array.from({ length: 220 }, (_, i) => <circle key={`d${i}`} cx={(i * 97) % W} cy={(i * 53) % rail} r={2} fill="#3A4A8A" opacity={0.35} />)}
    <rect x={0} y={rail} width={W} height={H - rail} fill="url(#wains)" />
    {Array.from({ length: 10 }, (_, i) => <rect key={`p${i}`} x={30 + i * 192} y={rail + 40} width={160} height={120} rx={8} fill="none" stroke="#2A3A70" strokeWidth={4} opacity={0.6} />)}
    <rect x={0} y={rail - 8} width={W} height={22} fill={BRASS[1]} /><rect x={0} y={rail - 8} width={W} height={7} fill={BRASS[2]} opacity={0.7} />
  </g>
);

// plank floor in perspective (horizon above the frame)
const Floor: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <defs><linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2418" /><stop offset="1" stopColor="#1E120C" /></linearGradient></defs>
    <rect x={0} y={y} width={W} height={H - y} fill="url(#floorg)" />
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={W / 2 + (i - 8) * 60} y1={y} x2={W / 2 + (i - 8) * 260} y2={H} stroke="#2A1810" strokeWidth={4} />)}
    {[0.25, 0.55, 0.85].map((t) => <line key={t} x1={0} y1={y + (H - y) * t} x2={W} y2={y + (H - y) * t} stroke="#2A1810" strokeWidth={3} opacity={0.6} />)}
    <rect x={0} y={y} width={W} height={10} fill="#000" opacity={0.3} />
  </g>
);

const NightWindow: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const f = useCurrentFrame();
  const r = rng(77);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-16} y={-16} width={w + 32} height={h + 32} rx={20} fill={BRASS[0]} />
      <defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120A33" /><stop offset="1" stopColor="#4A1A6A" /></linearGradient></defs>
      <rect width={w} height={h} rx={10} fill="url(#nsky)" />
      <circle cx={w * 0.72} cy={h * 0.25} r={38} fill="#FFF2C4" /><circle cx={w * 0.72} cy={h * 0.25} r={80} fill="#FFF2C4" opacity={0.08} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={r() * w} cy={r() * h * 0.5} r={2.5} fill="#CFD8FF" opacity={0.4 + 0.4 * Math.sin(f / 20 + i)} />)}
      {/* city skyline with lit windows (micro-detail) */}
      {Array.from({ length: 9 }, (_, i) => {
        const bw = 30 + r() * 40, bh = 60 + r() * 140, bx = i * (w / 9);
        return (
          <g key={`b${i}`}>
            <rect x={bx} y={h - bh} width={bw} height={bh} fill="#0B0A26" />
            {Array.from({ length: 10 }, (_, k) => <rect key={k} x={bx + 5 + (k % 3) * 9} y={h - bh + 8 + Math.floor(k / 3) * 14} width={5} height={7} fill="#FFD27A" opacity={(i * 3 + k) % 4 === 0 ? 0.9 : 0.15} />)}
          </g>
        );
      })}
      <rect x={w / 2 - 6} y={0} width={12} height={h} fill={BRASS[0]} /><rect x={0} y={h / 2 - 6} width={w} height={12} fill={BRASS[0]} />
      <path d={`M10 10 L ${w * 0.4} 10 L 10 ${h * 0.5} Z`} fill="#FFFFFF" opacity={0.06} />
    </g>
  );
};

const Chalkboard: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-16} y={-16} width={w + 32} height={h + 32} rx={16} fill="#6A4228" />
    <rect width={w} height={h} rx={8} fill="#1E3A34" />
    <rect width={w} height={h} rx={8} fill="#FFFFFF" opacity={0.03} />
    <g stroke="#E8F2EC" strokeWidth={5} fill="none" opacity={0.75} strokeLinecap="round">
      <path d={`M40 70 q 40 -50 80 0 t 80 0`} /><circle cx={w - 110} cy={90} r={46} /><path d={`M${w - 136} 90 h 52 M${w - 110} 64 v 52`} />
      <path d="M50 230 h 150 M50 230 l 30 -20 M50 230 l 30 20" /><path d={`M${w - 160} 220 l 40 60 l -80 0 z`} />
    </g>
    <text x={w / 2} y={h * 0.62} textAnchor="middle" fontFamily="Arial Black" fontSize={64} fill="#E8F2EC" opacity={0.8}>WHY?</text>
    <rect x={20} y={h - 8} width={w - 40} height={18} rx={6} fill="#5A3A26" /><rect x={60} y={h - 18} width={40} height={12} rx={4} fill="#F4EEE2" />
  </g>
);

const Pipes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={0} y={40} width={W} height={26} fill={BRASS[0]} /><rect x={0} y={40} width={W} height={8} fill={BRASS[2]} opacity={0.5} />
      {[320, 980, 1500].map((x) => <rect key={x} x={x} y={32} width={26} height={42} rx={6} fill={BRASS[1]} />)}
      {[640, 1700].map((x, i) => (
        <g key={x} transform={`translate(${x},53)`}>
          <circle r={34} fill={BRASS[0]} /><circle r={26} fill="#F4EEE2" />
          <rect x={-2} y={-22} width={4} height={24} fill="#FF4D3D" transform={`rotate(${-60 + 120 * ((Math.sin(f / 25 + i) + 1) / 2)})`} />
        </g>
      ))}
      <rect x={1160} y={66} width={22} height={260} fill={BRASS[0]} opacity={0.9} /><rect x={1160} y={66} width={7} height={260} fill={BRASS[2]} opacity={0.4} />
    </g>
  );
};

const Bench: React.FC<{ x: number; y: number; w: number; depth?: number; floor?: number }> = ({ x, y, w, depth = 50, floor = H }) => (
  <g>
    <defs><Grad id="benchtop" c="#B5802A" angle={90} /></defs>
    <rect x={x} y={y} width={w} height={depth} rx={12} fill="url(#benchtop)" />
    <rect x={x} y={y} width={w} height={10} rx={5} fill={BRASS[2]} opacity={0.6} />
    <rect x={x + 10} y={y + depth} width={w - 20} height={floor - y - depth} fill="#2A1A14" />
    <rect x={x + 10} y={floor - 12} width={w - 20} height={12} fill="#000" opacity={0.4} />
    {Array.from({ length: Math.floor(w / 220) }, (_, i) => (
      <g key={i}>
        <rect x={x + 30 + i * 220} y={y + depth + 30} width={180} height={110} rx={10} fill="#3A2418" />
        <rect x={x + 100 + i * 220} y={y + depth + 76} width={40} height={14} rx={7} fill={BRASS[1]} />
      </g>
    ))}
    <rect x={x} y={y + depth} width={w} height={14} fill="#000" opacity={0.35} />
  </g>
);

const Framers: React.FC<{ left?: boolean; right?: boolean }> = ({ left = true, right = true }) => (
  <g style={{ filter: "blur(4px)" }}>
    {left && <g opacity={0.95}><Thing name="houseplant" x={60} y={1140} s={1.9} shadow={false} /></g>}
    {right && <path d={`M${W} ${H} L ${W} 760 Q ${W - 120} 800 ${W - 200} ${H} Z`} fill="#05030F" opacity={0.85} />}
  </g>
);

// =====================================================================
// LAB WIDE: establishing shot. SLOTS: doc {x: 1290, y: 1010, s: 0.62} (on the rug, right of the bench)
// =====================================================================
export const LabWide: React.FC<{ children?: React.ReactNode; lights?: number }> = ({ children, lights = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NAVY[0], overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Wall rail={700} />
        <Pipes />
        <Chalkboard x={110} y={130} w={560} h={330} />
        {/* WW gear crest */}
        <g transform="translate(960,200)">
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-12} y={-92} width={24} height={30} rx={5} fill={BRASS[1]} transform={`rotate(${i * 30 + f * 0.2})`} />)}
          <circle r={70} fill={BRASS[1]} /><circle r={56} fill={NAVY[0]} />
          <text y={18} textAnchor="middle" fontFamily="Arial Black" fontSize={48} fill="#F4EEE2">WW</text>
        </g>
        <NightWindow x={1340} y={130} w={420} h={330} />
        <Thing name="wall-clock" x={960} y={480} s={0.45} f={f} shadow={false} />
        <Thing name="bookshelf" x={1210} y={700} s={0.95} />
        <Thing name="filing-cabinet" x={1830} y={760} s={0.7} />
        <LampPool x={480} y={260} r={460} o={0.3 * lights} />
        <LampPool x={1500} y={300} r={380} c="#9FD8FF" o={0.18} />
        <Floor y={880} />
        <Thing name="rug" x={960} y={1030} s={1.6} shadow={false} />
        {/* the long workbench full of gear */}
        <Bench x={120} y={690} w={980} floor={900} />
        <Thing name="microscope" x={280} y={694} s={0.62} />
        <Thing name="test-tube-rack" x={460} y={694} s={0.55} />
        <Thing name="beaker" x={590} y={694} s={0.5} f={f} />
        <Thing name="flask" x={680} y={694} s={0.5} f={f} />
        <Thing name="desk-thermostat" x={800} y={694} s={0.5} />
        <Thing name="monitor" x={960} y={694} s={0.55} f={f} />
        <Thing name="desk-lamp" x={1060} y={694} s={0.55} />
        <Thing name="robot" x={1500} y={930} s={0.45} f={f} />
        <Thing name="globe" x={1640} y={930} s={0.5} />
        <Dapple seed={4} color="#FFE2A8" o={0.08 * lights} n={6} />
        {children}
        <Framers />
        <rect width={W} height={H} fill="#05030F" opacity={(1 - lights) * 0.6} />
        <Vignette />
      </svg>
    </AbsoluteFill>
  );
};

// =====================================================================
// LAB BENCH: close on the workbench; Doc stands behind it, waist-up.
// SLOTS: doc {x: 760, y: 960, s: 1.0} (behind the bench; bench top at his waist) · prop A {x: 1180, y: 704} · prop B {x: 1500, y: 704}
// =====================================================================
export const LabBench: React.FC<{ children?: React.ReactNode; props?: React.ReactNode; actor?: React.ReactNode }> = ({ children, props, actor }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NAVY[0], overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Wall rail={760} />
        {/* pegboard with tools */}
        <rect x={980} y={90} width={820} height={420} rx={16} fill="#2A3A70" />
        {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={1010 + (i % 20) * 40} cy={120 + Math.floor(i / 20) * 50} r={4} fill="#1A2550" />)}
        <Thing name="wrench" x={1090} y={420} s={0.6} shadow={false} />
        <Thing name="magnifier" x={1260} y={430} s={0.55} shadow={false} />
        <Thing name="clipboard" x={1440} y={460} s={0.65} shadow={false} />
        <Thing name="gear" x={1650} y={440} s={0.55} f={f} shadow={false} />
        <Chalkboard x={60} y={110} w={460} h={300} />
        <LampPool x={760} y={300} r={560} o={0.32} />
        {actor}
        <Bench x={-20} y={700} w={W + 40} depth={70} />
        <Thing name="microscope" x={260} y={704} s={0.85} />
        <Thing name="beaker" x={470} y={704} s={0.7} f={f} />
        {props ?? (
          <>
            <Thing name="desk-thermostat" x={1180} y={704} s={0.85} />
            <Thing name="flask" x={1500} y={704} s={0.75} f={f} />
          </>
        )}
        <Thing name="petri-dish" x={1740} y={704} s={0.6} />
        {children}
        <Vignette o={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// =====================================================================
// LAB SCREEN: big wall monitor for graphs/diagrams. `screen` content is drawn in a 1100×600 box (origin top-left).
// SLOTS: doc {x: 300, y: 1260, s: 1.0} (left, waist-up) · screen box at (700, 150)
// =====================================================================
export const LabScreen: React.FC<{ children?: React.ReactNode; screen?: React.ReactNode; actor?: React.ReactNode }> = ({ children, screen, actor }) => {
  const f = useCurrentFrame();
  const sx = 700, sy = 150, sw = 1100, sh = 600;
  return (
    <AbsoluteFill style={{ background: NAVY[0], overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Wall rail={860} />
        <Pipes />
        {/* cables + side monitors */}
        <path d={`M${sx + sw / 2} ${sy + sh} Q ${sx + sw / 2} ${sy + sh + 120} ${sx + sw - 60} 860`} stroke="#0B1228" strokeWidth={14} fill="none" />
        <path d={`M${sx + 200} ${sy + sh} Q ${sx + 160} ${sy + sh + 140} ${sx + 40} 860`} stroke="#0B1228" strokeWidth={10} fill="none" />
        {[[560, 300], [560, 520]].map(([x, y], i) => (
          <g key={i}><rect x={x - 90} y={y - 70} width={180} height={130} rx={12} fill="#2A2F5A" /><rect x={x - 78} y={y - 58} width={156} height={106} rx={6} fill="#0B2A3A" />
            <path d={`M${x - 70} ${y} ${Array.from({ length: 10 }, (_, k) => `L ${x - 70 + k * 15} ${y + Math.sin(k + f / 5 + i) * 26}`).join(" ")}`} stroke={i ? "#FFD23F" : "#3FE0B0"} strokeWidth={4} fill="none" /></g>
        ))}
        {/* main screen: brass bezel, glass, scanline sheen */}
        <rect x={sx - 24} y={sy - 24} width={sw + 48} height={sh + 48} rx={30} fill={BRASS[0]} />
        <rect x={sx - 14} y={sy - 14} width={sw + 28} height={sh + 28} rx={24} fill="#1B1240" />
        <defs>
          <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E2A44" /><stop offset="1" stopColor="#081A2E" /></linearGradient>
          <clipPath id="scrClip"><rect x={sx} y={sy} width={sw} height={sh} rx={14} /></clipPath>
        </defs>
        <rect x={sx} y={sy} width={sw} height={sh} rx={14} fill="url(#scr)" />
        <g clipPath="url(#scrClip)">
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={sx} y1={sy + i * 50} x2={sx + sw} y2={sy + i * 50} stroke="#1E4A6A" strokeWidth={2} opacity={0.5} />)}
          {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} x1={sx + i * 50} y1={sy} x2={sx + i * 50} y2={sy + sh} stroke="#1E4A6A" strokeWidth={2} opacity={0.5} />)}
          <g transform={`translate(${sx},${sy})`}>{screen}</g>
          <rect x={sx} y={sy + ((f * 4) % sh)} width={sw} height={30} fill="#7FE8FF" opacity={0.05} />
          <path d={`M${sx} ${sy} L ${sx + 380} ${sy} L ${sx} ${sy + 260} Z`} fill="#FFFFFF" opacity={0.05} />
        </g>
        <circle cx={sx + sw - 30} cy={sy + sh + 4} r={6} fill="#2FE08A" />
        <LampPool x={300} y={500} r={500} o={0.25} />
        <LampPool x={sx + sw / 2} y={sy + sh / 2} r={700} c="#3FE0E8" o={0.12} />
        <Floor y={860} />
        {actor}
        {children}
        <Vignette o={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// demo screen content: a rising line graph with axes (any episode passes its own)
export const DemoGraph: React.FC = () => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 11 }, (_, i) => [80 + i * 95, 500 - (i * i * 3.6 + Math.sin(i + f / 20) * 10)]);
  return (
    <g>
      <path d="M80 60 V 500 H 1040" stroke="#CFE8FF" strokeWidth={6} fill="none" />
      <path d={`M${pts.map((p) => p.join(" ")).join(" L ")}`} stroke="#3FE0B0" strokeWidth={10} fill="none" strokeLinejoin="round" />
      <path d={`M80 500 L ${pts.map((p) => p.join(" ")).join(" L ")} L 1030 500 Z`} fill="#3FE0B0" opacity={0.15} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#FFD23F" />)}
      <text x={110} y={110} fontFamily="Arial Black" fontSize={44} fill="#F4EEE2">ENERGY USED</text>
      <text x={110} y={160} fontFamily="Arial" fontSize={30} fill="#9FB0FF">per °C of fever</text>
    </g>
  );
};

export { shade };
