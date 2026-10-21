// City & urban sets: seeded Building generator + presets (Street, Alley, Highway, Downtown, Rooftop).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Thing } from "./objects";
import { mix, rng, shade } from "./gen";

const W = 1920, H = 1080;

// ---------- generators ----------
// one building facade: base gradient, side shadow, rim, window grid (some lit), roof details
export const Building: React.FC<{ x: number; base: number; w: number; h: number; c: string; seed: number; lit?: number; haze?: number; hazeC?: string; roof?: boolean }> = ({
  x, base, w, h, c, seed, lit = 0.35, haze = 0, hazeC = "#9FB8E8", roof = true,
}) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  const col = mix(c, hazeC, haze);
  const cols = Math.max(2, Math.floor(w / 46)), rows = Math.max(2, Math.floor(h / 56));
  const gx = w / cols, gy = (h - 30) / rows;
  const id = `bd${seed}`;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={shade(col, 0.12)} /><stop offset="0.75" stopColor={col} /><stop offset="1" stopColor={shade(col, -0.25)} /></linearGradient></defs>
      <rect x={x} y={base - h} width={w} height={h} fill={`url(#${id})`} />
      <rect x={x} y={base - h} width={w} height={8} fill={shade(col, 0.3)} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const on = r() < lit;
        const flick = on && (i * 13 + seed) % 29 === 0 ? 0.6 + 0.4 * Math.sin(f / 7 + i) : 1;
        return <rect key={i} x={x + 8 + (i % cols) * gx} y={base - h + 22 + Math.floor(i / cols) * gy} width={gx - 16} height={gy * 0.55} rx={2} fill={on ? mix("#FFD27A", hazeC, haze * 0.6) : shade(col, -0.25)} opacity={on ? 0.9 * flick : 0.8} />;
      })}
      {roof && r() > 0.4 && <rect x={x + w * 0.2} y={base - h - 24} width={w * 0.3} height={24} fill={shade(col, -0.1)} />}
      {roof && r() > 0.6 && <g><rect x={x + w * 0.7} y={base - h - 70} width={4} height={70} fill={shade(col, -0.3)} /><circle cx={x + w * 0.7 + 2} cy={base - h - 72} r={5} fill="#FF4D6D" opacity={0.4 + 0.6 * ((Math.floor(f / 20) + seed) % 2)} /></g>}
    </g>
  );
};

// a whole row of buildings across the frame
export const Skyline: React.FC<{ seed: number; base: number; minH: number; maxH: number; c: string; haze?: number; hazeC?: string; lit?: number }> = ({ seed, base, minH, maxH, c, haze = 0, hazeC, lit }) => {
  const r = rng(seed);
  const out: React.ReactNode[] = [];
  let x = -40;
  let i = 0;
  while (x < W + 40) {
    const w = 110 + r() * 170, h = minH + r() * (maxH - minH);
    out.push(<Building key={i} x={x} base={base} w={w} h={h} c={shade(c, r() * 0.16 - 0.08)} seed={seed * 100 + i} haze={haze} hazeC={hazeC} lit={lit} />);
    x += w + 6; i++;
  }
  return <g>{out}</g>;
};

const SkyG: React.FC<{ id: string; stops: string[] }> = ({ id, stops }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}</linearGradient></defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </g>
);
const Vig: React.FC<{ o?: number }> = ({ o = 0.55 }) => (
  <g><defs><radialGradient id="uvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs><rect width={W} height={H} fill="url(#uvig)" /></g>
);
const Glow: React.FC<{ x: number; y: number; r: number; c?: string; o?: number }> = ({ x, y, r, c = "#FFE2A8", o = 0.35 }) => (
  <g><defs><radialGradient id={`gl${x}${y}`}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#gl${x}${y})`} /></g>
);
const Lamp: React.FC<{ x: number; y: number; h?: number; on?: boolean }> = ({ x, y, h = 360, on = true }) => (
  <g>
    {on && <Glow x={x + 60} y={y - h + 20} r={180} o={0.4} />}
    <rect x={x - 7} y={y - h} width={14} height={h} fill="#2A2F4A" />
    <path d={`M${x} ${y - h} Q ${x + 10} ${y - h - 30} ${x + 60} ${y - h - 20}`} stroke="#2A2F4A" strokeWidth={10} fill="none" />
    <path d={`M${x + 30} ${y - h - 16} L ${x + 90} ${y - h - 16} L ${x + 76} ${y - h + 6} L ${x + 44} ${y - h + 6} Z`} fill="#3A3F6A" />
    {on && <ellipse cx={x + 60} cy={y - h + 8} rx={18} ry={6} fill="#FFF2C4" />}
  </g>
);

// =================== PRESETS ===================
// STREET: storefronts, sidewalk (actor slot: sidewalk, feet y≈930, s≈0.6), road with traffic
export const Street: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const shops = ["#C2384A", "#3A8A8A", "#E0A83A", "#7A4AA8", "#2E6A9A"];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <SkyG id="ssky" stops={["#4A90E0", "#9FD0F4", "#E8F6FF"]} />
        <Skyline seed={1} base={520} minH={200} maxH={420} c="#7A8AB8" haze={0.55} hazeC="#CFE6FF" lit={0.05} />
        {/* storefront row */}
        {shops.map((c, i) => {
          const x = -20 + i * 400, w = 390;
          return (
            <g key={i}>
              <Building x={x} base={760} w={w} h={520 - (i % 2) * 60} c={shade(c, -0.15)} seed={20 + i} lit={0.1} roof={false} />
              <rect x={x + 20} y={600} width={w - 40} height={160} fill="#2A3A5A" />
              <rect x={x + 30} y={610} width={w * 0.55} height={140} fill="#7FC8E8" opacity={0.55} />
              <path d={`M${x + 34} 614 L ${x + 130} 614 L ${x + 34} 700 Z`} fill="#FFFFFF" opacity={0.15} />
              <rect x={x + w * 0.65} y={630} width={70} height={130} fill={shade(c, -0.35)} />
              {/* awning with stripes */}
              <path d={`M${x + 10} 560 L ${x + w - 10} 560 L ${x + w + 10} 610 L ${x - 10} 610 Z`} fill={c} />
              {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${x + 10 + k * (w / 8)} 560 l ${w / 16} 0 l 6 50 l ${-w / 16} 0 Z`} fill="#FFFFFF" opacity={0.7} />)}
              <rect x={x + w / 2 - 90} y={510} width={180} height={40} rx={8} fill="#F4EEE2" /><rect x={x + w / 2 - 70} y={524} width={140} height={12} rx={6} fill={c} />
            </g>
          );
        })}
        {/* sidewalk + curb */}
        <rect x={0} y={760} width={W} height={200} fill="#B8B4AC" />
        {Array.from({ length: 13 }, (_, i) => <line key={i} x1={i * 160} y1={760} x2={i * 160 - 40} y2={960} stroke="#9A968E" strokeWidth={3} />)}
        <rect x={0} y={950} width={W} height={18} fill="#D8D4CC" />
        {/* road */}
        <rect x={0} y={968} width={W} height={112} fill="#3A3A44" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={((i * 280 - f * 6) % (W + 280) + W + 280) % (W + 280) - 140} y={1022} width={120} height={8} fill="#F4CF7A" />)}
        <g transform={`translate(${((f * 9) % (W + 700)) - 400},0)`}><Thing name="car" x={0} y={1060} s={0.55} /></g>
        <g transform={`translate(${W + 300 - ((f * 5) % (W + 900))},0)`}><Thing name="bus" x={0} y={1060} s={0.42} /></g>
        <Lamp x={340} y={940} /><Lamp x={1300} y={940} />
        <Thing name="traffic-light" x={1820} y={950} s={0.55} f={f} />
        <Thing name="trash-bin" x={560} y={940} s={0.32} />
        <Thing name="bicycle" x={1080} y={940} s={0.4} />
        {children}
        <Vig o={0.4} />
      </svg>
    </AbsoluteFill>
  );
};

// ALLEY: narrow brick walls in perspective, fire escape, dumpster, steam, puddles (actor slot: centre, feet y≈960, s≈0.65)
export const Alley: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const brick = (x0: number, x1: number, side: 1 | -1) => (
    <g>
      <path d={`M${x0} 0 L ${x1} 260 L ${x1} 860 L ${x0} ${H} Z`} fill={side < 0 ? "#6A3A3A" : "#5A3030"} />
      {Array.from({ length: 22 }, (_, i) => { const t = i / 22; const y0 = t * H, y1 = 260 + t * 600; return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#3A1E1E" strokeWidth={3} opacity={0.7} />; })}
      {Array.from({ length: 10 }, (_, i) => { const xx = x0 + (x1 - x0) * (i / 10); return <line key={`v${i}`} x1={xx} y1={(260 * (xx - x0)) / (x1 - x0)} x2={xx} y2={H - (220 * (xx - x0)) / (x1 - x0)} stroke="#3A1E1E" strokeWidth={2} opacity={0.4} />; })}
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <SkyG id="asky" stops={["#1A1440", "#4A2A6A", "#C86A6A"]} />
        <Skyline seed={3} base={600} minH={220} maxH={480} c="#2A2450" haze={0.3} hazeC="#C86A6A" lit={0.4} />
        <rect x={0} y={600} width={W} height={480} fill="#1A1626" />
        {/* far wall at the end of the alley */}
        <rect x={700} y={260} width={520} height={600} fill="#4A2A3A" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={700} y1={300 + i * 48} x2={1220} y2={300 + i * 48} stroke="#2A1626" strokeWidth={3} />)}
        <rect x={880} y={620} width={160} height={240} fill="#1A0E1A" /><rect x={900} y={560} width={120} height={40} fill="#FFD27A" opacity={0.85} />
        {brick(0, 700, -1)}{brick(W, 1220, 1)}
        {/* fire escape on the left wall: 3 landings in perspective, railings, stairs between */}
        {[0, 1, 2].map((k) => {
          const y = 330 + k * 190, x0 = 150 + k * 20, x1 = 520 + k * 10, d = 34;
          const yAt = (x: number) => y + ((x - x0) / (x1 - x0)) * 70;
          return (
            <g key={k}>
              <path d={`M${x0} ${y} L ${x1} ${y + 70} L ${x1 + d} ${y + 70 + 10} L ${x0 + d} ${y + 10} Z`} fill="#22222C" />
              <path d={`M${x0} ${y} L ${x1} ${y + 70}`} stroke="#3A3A48" strokeWidth={6} />
              {Array.from({ length: 9 }, (_, j) => { const x = x0 + j * ((x1 - x0) / 8); return <line key={j} x1={x} y1={yAt(x)} x2={x} y2={yAt(x) - 70} stroke="#22222C" strokeWidth={5} />; })}
              <path d={`M${x0} ${y - 70} L ${x1} ${y}`} stroke="#22222C" strokeWidth={7} />
              {k < 2 && <g>
                <path d={`M${x1 - 120} ${yAt(x1 - 120)} L ${x1 - 20} ${yAt(x1 - 20) + 190 - 10}`} stroke="#22222C" strokeWidth={8} />
                {Array.from({ length: 6 }, (_, j) => { const t = j / 6; const sx = x1 - 120 + t * 100, sy = yAt(x1 - 120) + t * 180; return <line key={j} x1={sx - 26} y1={sy + 6} x2={sx + 6} y2={sy} stroke="#2E2E3A" strokeWidth={5} />; })}
              </g>}
              <rect x={x0 + 60} y={y - 150} width={110} height={130} fill="#1A1626" /><rect x={x0 + 70} y={y - 140} width={90} height={110} fill={k === 1 ? "#FFD27A" : "#2A2440"} opacity={0.85} />
            </g>
          );
        })}
        {/* ground: wet asphalt + puddles reflecting the lamp */}
        <path d={`M0 ${H} L 700 860 L 1220 860 L ${W} ${H} Z`} fill="#2A2632" />
        {[[860, 960, 160], [1180, 1020, 120], [600, 1040, 140]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y} rx={w} ry={16} fill="#6A5A8A" opacity={0.6 + 0.1 * Math.sin(f / 10 + i)} />)}
        <ellipse cx={960} cy={966} rx={50} ry={6} fill="#FFE2A8" opacity={0.6} />
        {/* dumpster */}
        <g transform="translate(1380,980)">
          <rect x={-170} y={-200} width={340} height={200} rx={8} fill="#2E6A4A" />
          <rect x={-180} y={-220} width={360} height={30} rx={6} fill="#245A3E" />
          <rect x={-150} y={-170} width={300} height={10} fill="#1E4A32" />
          <path d="M-60 -220 Q -20 -270 30 -230 Z" fill="#F4EEE2" />
          {[-140, 140].map((x) => <circle key={x} cx={x} cy={0} r={14} fill="#1A1A22" />)}
        </g>
        <Thing name="trash-bin" x={480} y={1000} s={0.4} />
        {/* hanging lamp + steam */}
        <line x1={960} y1={0} x2={960} y2={180} stroke="#1A1A22" strokeWidth={4} />
        <path d="M920 180 L 1000 180 L 980 220 L 940 220 Z" fill="#3A3F6A" /><Glow x={960} y={230} r={300} o={0.45} />
        <polygon points="940,220 980,220 1100,860 820,860" fill="#FFE2A8" opacity={0.06} />
        {[0, 1, 2].map((i) => <circle key={i} cx={300 + i * 30 + Math.sin(f / 20 + i) * 20} cy={820 - i * 70 - ((f * 1.5) % 70)} r={50 + i * 20} fill="#B8B0C8" opacity={0.18 - i * 0.04} />)}
        <rect x={270} y={830} width={90} height={30} rx={6} fill="#1A1A22" />
        {children}
        <Vig o={0.65} />
      </svg>
    </AbsoluteFill>
  );
};

// HIGHWAY: elevated view, lanes in perspective, traffic both ways, overpass, skyline (actor slot: overpass walkway or Doc presenter corner)
export const Highway: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const lane = (k: number) => k * 150;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <SkyG id="hsky" stops={["#E86A5A", "#F4A87A", "#FFE2B8"]} />
        <circle cx={1500} cy={360} r={90} fill="#FFE8B8" />
        <Skyline seed={5} base={460} minH={140} maxH={340} c="#6A4A7A" haze={0.5} hazeC="#F4B88A" lit={0.25} />
        <rect x={0} y={460} width={W} height={620} fill="#5A6A4A" />
        {/* road in perspective: vanishing point (960, 460) */}
        <path d={`M880 460 L 1040 460 L ${W + 600} ${H} L -600 ${H} Z`} fill="#3A3A44" />
        {[-2, -1, 0, 1, 2].map((k) => (
          <g key={k}>{Array.from({ length: 10 }, (_, i) => { const t = ((i / 10 + f / 160) % 1); const t2 = Math.min(1, t + 0.035); const y = 460 + t * t * 620, y2 = 460 + t2 * t2 * 620; const x = 960 + k * 30 + (k * 300) * t * t, x2 = 960 + k * 30 + (k * 300) * t2 * t2; return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke={k === 0 ? "#F4CF7A" : "#F4F4F4"} strokeWidth={2 + t * 10} />; })}</g>
        ))}
        {/* cars: outbound (left) shrink away, inbound (right) grow toward camera */}
        {[0, 1, 2].map((i) => { const t = ((f / 120 + i / 3) % 1); const s = 0.6 * (1 - t) + 0.05; return <g key={`o${i}`} transform={`translate(${960 - 200 * (1 - t) * (1 - t) - 40},${460 + (1 - t) * (1 - t) * 620})`}><Thing name="car" x={0} y={0} s={s} shadow={false} /></g>; })}
        {[0, 1].map((i) => { const t = ((f / 140 + i / 2) % 1); const s = 0.05 + 0.6 * t * t; return <g key={`i${i}`} transform={`translate(${980 + 380 * t * t},${460 + t * t * 620})`}><Thing name={i ? "truck" : "car"} x={0} y={0} s={s} shadow={false} /></g>; })}
        {/* overpass */}
        <rect x={0} y={560} width={W} height={70} fill="#8A8A9A" /><rect x={0} y={560} width={W} height={14} fill="#B8B8C8" />
        {[300, 960, 1620].map((x) => <rect key={x} x={x - 30} y={630} width={60} height={200} fill="#6A6A7A" />)}
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50} y={530} width={6} height={30} fill="#5A5A6A" />)}
        <rect x={0} y={526} width={W} height={8} fill="#5A5A6A" />
        <rect x={1300} y={470} width={260} height={56} rx={6} fill="#2E8A5A" /><text x={1430} y={508} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#FFFFFF">CITY ↑</text>
        {children}
        <Vig o={0.4} />
      </svg>
    </AbsoluteFill>
  );
};

// DOWNTOWN: wide skyline at dusk, 3 depth layers, helicopter (actor: presenter overlay or small on the waterfront)
export const Downtown: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <SkyG id="dsky" stops={["#1A1A4A", "#6A3A8A", "#F48A6A", "#FFD2A0"]} />
        <circle cx={960} cy={760} r={140} fill="#FFE2A8" opacity={0.9} />
        <Skyline seed={7} base={800} minH={260} maxH={560} c="#4A3A7A" haze={0.6} hazeC="#F4A88A" lit={0.2} />
        <Skyline seed={8} base={860} minH={300} maxH={680} c="#2A2456" haze={0.3} hazeC="#F48A6A" lit={0.4} />
        <Thing name="skyscraper" x={420} y={900} s={1.2} />
        <Skyline seed={9} base={900} minH={160} maxH={360} c="#14123A" lit={0.55} />
        {/* waterfront */}
        <rect x={0} y={900} width={W} height={180} fill="#1A1A4A" />
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 67) % W} y={920 + (i * 23) % 140} width={40 + (i % 3) * 30} height={4} fill="#FFD27A" opacity={0.25 + 0.15 * Math.sin(f / 10 + i)} />)}
        <rect x={0} y={900} width={W} height={6} fill="#6A5AA8" />
        <g transform={`translate(${((f * 3) % (W + 600)) - 300},260)`}><Thing name="helicopter" x={0} y={0} s={0.35} f={f} shadow={false} /></g>
        {children}
        <Vig o={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// ROOFTOP: ledge in the foreground, water tower, vents, antenna, night city below (actor slot: roof deck, feet y≈920, s≈0.62)
export const Rooftop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <SkyG id="rsky" stops={["#05082A", "#1A2A6A", "#4A3A8A"]} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % W} cy={(i * 97) % 420} r={2} fill="#FFFFFF" opacity={0.4 + 0.3 * Math.sin(f / 20 + i)} />)}
        <circle cx={1550} cy={170} r={60} fill="#FFF2C4" /><circle cx={1550} cy={170} r={130} fill="#FFF2C4" opacity={0.08} />
        {/* city far below: buildings start low in frame */}
        <Skyline seed={11} base={760} minH={120} maxH={360} c="#3A3A7A" haze={0.5} hazeC="#6A5AA8" lit={0.45} />
        <Skyline seed={12} base={820} minH={60} maxH={260} c="#1E1E4A" haze={0.2} hazeC="#6A5AA8" lit={0.55} />
        <rect x={0} y={700} width={W} height={160} fill="#6A5AA8" opacity={0.15} />
        {/* roof deck */}
        <path d={`M0 790 L ${W} 790 L ${W} ${H} L 0 ${H} Z`} fill="#4A4A5A" />
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 131) % W} y={820 + ((i * 47) % 220)} width={60} height={4} fill="#3A3A4A" />)}
        {/* parapet edge at the back of the deck */}
        <rect x={0} y={760} width={W} height={40} fill="#6A6A7A" /><rect x={0} y={760} width={W} height={8} fill="#8A8A9A" />
        {/* water tower */}
        <g transform="translate(320,790)">
          {[-80, -20, 40, 100].map((x) => <line key={x} x1={x} y1={0} x2={x * 0.7 + 10} y2={-200} stroke="#3A2A2A" strokeWidth={10} />)}
          <rect x={-110} y={-420} width={240} height={230} rx={14} fill="#8A5A3A" />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-110 + i * 40} y1={-420} x2={-110 + i * 40} y2={-190} stroke="#6A4228" strokeWidth={5} />)}
          {[-380, -260].map((y) => <rect key={y} x={-114} y={y} width={248} height={10} fill="#3A2A2A" />)}
          <path d="M-120 -420 L 10 -500 L 140 -420 Z" fill="#6A4228" />
        </g>
        {/* AC units + vents + antenna */}
        {[[1100, 0], [1340, 1]].map(([x, i]) => (
          <g key={x} transform={`translate(${x},900)`}>
            <rect x={-110} y={-130} width={220} height={130} rx={8} fill="#9FA8C8" />
            <circle cx={0} cy={-65} r={46} fill="#6A6E8A" />
            <g transform={`translate(0,-65) rotate(${f * (8 + i * 3)})`}>{[0, 120, 240].map((a) => <rect key={a} x={-5} y={-40} width={10} height={40} fill="#3A3E5A" transform={`rotate(${a})`} />)}</g>
          </g>
        ))}
        <rect x={1700} y={600} width={10} height={200} fill="#2A2A3A" /><line x1={1705} y1={600} x2={1660} y2={660} stroke="#2A2A3A" strokeWidth={5} /><line x1={1705} y1={600} x2={1750} y2={660} stroke="#2A2A3A" strokeWidth={5} />
        <circle cx={1705} cy={596} r={8} fill="#FF4D6D" opacity={0.4 + 0.6 * (Math.floor(f / 20) % 2)} />
        <Thing name="solar-panel" x={1560} y={900} s={0.5} />
        {children}
        {/* foreground ledge (closest to camera) */}
        <path d={`M0 ${H} L 0 990 L ${W} 1010 L ${W} ${H} Z`} fill="#2A2A36" />
        <rect x={0} y={984} width={W} height={10} fill="#5A5A6A" />
        <Vig o={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

export const URBAN = { Street, Alley, Highway, Downtown, Rooftop };
