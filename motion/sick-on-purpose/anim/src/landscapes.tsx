// Landscape sets: one engine, many presets (DESIGN §1 stack + §8 density: atmospheric ridges, textured ground, approved objects).
// Ground line for actors: GROUND_Y (feet at y ≈ 930–1000, scale 0.5–0.7 for Doc/avatars).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Thing } from "./objects";
import { mix, rng, shade } from "./gen";

const W = 1920, H = 1080;
export const GROUND_Y = 900;

// ---------- generators ----------
type RidgeKind = "hills" | "peaks" | "dunes" | "pines" | "ice";
const ridgePath = (seed: number, base: number, amp: number, kind: RidgeKind) => {
  const r = rng(seed);
  const n = kind === "peaks" ? 9 : kind === "pines" ? 30 : kind === "ice" ? 12 : 7;
  const step = (W + 400) / n;
  let d = `M-200 ${H} L -200 ${base}`;
  for (let i = 0; i <= n; i++) {
    const x = -200 + i * step;
    const y = base - r() * amp;
    if (kind === "peaks" || kind === "ice") d += ` L ${x + step / 2} ${y - amp * 0.4} L ${x + step} ${base - r() * amp * 0.3}`;
    else if (kind === "pines") d += ` L ${x + step * 0.15} ${y - amp * 0.35} L ${x + step / 2} ${y - amp * (0.7 + r() * 0.5)} L ${x + step * 0.85} ${y - amp * 0.35} L ${x + step} ${base - r() * 20}`;
    else d += ` Q ${x + step / 2} ${y - amp * (kind === "dunes" ? 0.7 : 0.5)} ${x + step} ${base - r() * amp * 0.4}`;
  }
  return d + ` L ${W + 200} ${H} Z`;
};

export const Ridge: React.FC<{ seed: number; base: number; amp: number; kind: RidgeKind; c: string; snow?: boolean; drift?: number }> = ({ seed, base, amp, kind, c, snow, drift = 0 }) => {
  const f = useCurrentFrame();
  const d = ridgePath(seed, base, amp, kind);
  const id = `rg${seed}`;
  return (
    <g transform={`translate(${-f * drift},0)`}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(c, 0.12)} /><stop offset="1" stopColor={shade(c, -0.15)} /></linearGradient></defs>
      <path d={d} fill={`url(#${id})`} />
      {snow && <path d={d} fill="#F4F8FF" clipPath={`url(#${id}c)`} />}
      {snow && <defs><clipPath id={`${id}c`}><rect x={-300} y={0} width={W + 600} height={base - amp * 0.55} /></clipPath></defs>}
      <path d={d} fill="none" stroke={shade(c, 0.35)} strokeWidth={3} opacity={0.35} />
    </g>
  );
};

export const Sky: React.FC<{ top: string; mid: string; low: string; sun?: { x: number; y: number; r: number; c: string }; moon?: boolean }> = ({ top, mid, low, sun, moon }) => (
  <g>
    <defs><linearGradient id={`sky${top}${low}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.6" stopColor={mid} /><stop offset="1" stopColor={low} /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#sky${top}${low})`} />
    {sun && (
      <g>
        <defs><radialGradient id={`sun${sun.c}`}><stop offset="0" stopColor={sun.c} stopOpacity="0.7" /><stop offset="1" stopColor={sun.c} stopOpacity="0" /></radialGradient></defs>
        <circle cx={sun.x} cy={sun.y} r={sun.r * 4} fill={`url(#sun${sun.c})`} />
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill={shade(sun.c, 0.4)} />
        {moon && <circle cx={sun.x + sun.r * 0.4} cy={sun.y - sun.r * 0.2} r={sun.r * 0.85} fill={mid} opacity={0.0} />}
      </g>
    )}
  </g>
);

export const Clouds: React.FC<{ seed: number; c?: string; n?: number; y0?: number; y1?: number }> = ({ seed, c = "#FFFFFF", n = 5, y0 = 80, y1 = 360 }) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = ((r() * (W + 600) + f * (0.3 + i * 0.08)) % (W + 600)) - 300, y = y0 + r() * (y1 - y0), s = 0.4 + r() * 0.6;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={0.9}>
            {[[-120, 20, 70], [-40, -20, 100], [70, 0, 85], [150, 30, 60]].map(([cx, cy, rr], k) => <circle key={k} cx={cx} cy={cy} r={rr} fill={c} />)}
            <rect x={-190} y={20} width={400} height={70} rx={35} fill={c} />
            <ellipse cx={-30} cy={-60} rx={70} ry={20} fill="#FFFFFF" opacity={0.5} />
            <rect x={-190} y={60} width={400} height={30} rx={15} fill={shade(c, -0.12)} opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

export const Ground: React.FC<{ c: string; texture: "grass" | "sand" | "snow" | "rock"; seed: number }> = ({ c, texture, seed }) => {
  const r = rng(seed);
  const id = `gnd${seed}`;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(c, 0.1)} /><stop offset="1" stopColor={shade(c, -0.3)} /></linearGradient></defs>
      <path d={`M0 ${GROUND_Y - 20} Q ${W / 2} ${GROUND_Y - 60} ${W} ${GROUND_Y - 10} L ${W} ${H} L 0 ${H} Z`} fill={`url(#${id})`} />
      {/* micro-texture */}
      {Array.from({ length: 140 }, (_, i) => {
        const x = r() * W, y = GROUND_Y + r() * (H - GROUND_Y);
        if (texture === "grass") return <path key={i} d={`M${x} ${y} q -4 -16 -2 -26 M${x} ${y} q 4 -14 8 -22`} stroke={shade(c, 0.25)} strokeWidth={3} fill="none" opacity={0.6} />;
        if (texture === "sand") return <path key={i} d={`M${x} ${y} q 20 -6 40 0`} stroke={shade(c, -0.15)} strokeWidth={3} fill="none" opacity={0.5} />;
        if (texture === "snow") return <ellipse key={i} cx={x} cy={y} rx={14} ry={4} fill="#FFFFFF" opacity={0.5} />;
        return <circle key={i} cx={x} cy={y} r={3 + r() * 4} fill={shade(c, -0.25)} opacity={0.5} />;
      })}
    </g>
  );
};

export const Haze: React.FC<{ y: number; c: string; o?: number }> = ({ y, c, o = 0.35 }) => (
  <g>
    <defs><linearGradient id={`hz${y}${c}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity="0" /><stop offset="0.5" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
    <rect x={0} y={y - 120} width={W} height={240} fill={`url(#hz${y}${c})`} />
  </g>
);

export const Frame: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint = "#000" }) => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <svg width={W} height={H}>
      {children}
      <defs><radialGradient id="lvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor={tint} stopOpacity="0" /><stop offset="1" stopColor={tint} stopOpacity="0.5" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#lvig)" />
    </svg>
  </AbsoluteFill>
);

// =================== PRESETS ===================
// Each takes children = actor layer (placed on the ground line, before foreground framers).

export const Forest: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#0B1A2A">
      <Sky top="#2A4A7A" mid="#7AA8B8" low="#F2C8A0" sun={{ x: 1400, y: 380, r: 70, c: "#FFE2A8" }} />
      <Ridge seed={1} base={640} amp={140} kind="pines" c={mix("#2A4A5A", "#7AA8B8", 0.55)} />
      <Haze y={640} c="#C8DCE0" o={0.5} />
      <Ridge seed={2} base={720} amp={170} kind="pines" c={mix("#1E4A3A", "#7AA8B8", 0.3)} />
      <Haze y={730} c="#B8D0D0" o={0.35} />
      <Ridge seed={3} base={820} amp={90} kind="hills" c="#2E6A3A" />
      <Ground c="#3A7A3A" texture="grass" seed={4} />
      {[[160, 900, 1.1], [420, 880, 0.9], [1620, 890, 1.0], [1820, 910, 1.2]].map(([x, y, s], i) => <Thing key={i} name="pine" x={x} y={y} s={s} />)}
      <Thing name="oak" x={1250} y={890} s={0.9} f={f} />
      {[[600, 930], [1080, 920], [1480, 940]].map(([x, y], i) => <Thing key={i} name={i % 2 ? "bush-flowering" : "bush-round"} x={x} y={y} s={0.55} />)}
      <Thing name="mushroom" x={760} y={960} s={0.35} /><Thing name="log" x={360} y={990} s={0.6} />
      {[[880, 980], [1350, 990], [200, 1010]].map(([x, y], i) => <Thing key={i} name="grass-tuft" x={x} y={y} s={0.45} f={f} shadow={false} />)}
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="pine" x={-40} y={1250} s={2.4} shadow={false} /><Thing name="bush-round" x={1900} y={1140} s={1.4} shadow={false} /></g>
    </Frame>
  );
};

export const Desert: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#3A1A0A">
      <Sky top="#E86A3A" mid="#F4A85A" low="#FFE2A8" sun={{ x: 1300, y: 420, r: 120, c: "#FFD27A" }} />
      <Ridge seed={11} base={650} amp={120} kind="peaks" c={mix("#B85A3A", "#F4A85A", 0.55)} />
      <Haze y={660} c="#FFD8A8" o={0.45} />
      <Ridge seed={12} base={760} amp={110} kind="dunes" c="#E0A060" />
      <Ridge seed={13} base={850} amp={90} kind="dunes" c="#D08A4A" />
      <Ground c="#E0A868" texture="sand" seed={14} />
      {[[260, 920, 1.0], [1560, 930, 1.2], [700, 900, 0.6]].map(([x, y, s], i) => <g key={i}><Thing name="cactus" x={x} y={y} s={s} /><ellipse cx={x} cy={y - 40 * s} rx={130 * s} ry={70 * s} fill="#E8B478" /><ellipse cx={x - 20 * s} cy={y - 70 * s} rx={70 * s} ry={20 * s} fill="#F4C890" opacity={0.7} /></g>)}
      {[[620, 960, 0.7], [1780, 980, 0.9]].map(([x, y, s], i) => <Thing key={i} name="rocks" x={x} y={y} s={s} />)}
      <rect x={0} y={GROUND_Y - 30} width={W} height={20} fill="#FFFFFF" opacity={0.05 + 0.03 * Math.sin(f / 6)} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="rocks" x={-60} y={1150} s={2.2} shadow={false} /></g>
    </Frame>
  );
};

export const Mountains: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#0B1A3A">
      <Sky top="#2A5AA8" mid="#7FB8E8" low="#E8F4FF" />
      <Clouds seed={21} n={4} y0={60} y1={240} />
      <Ridge seed={22} base={560} amp={260} kind="peaks" c={mix("#4A5A8A", "#B8D0F0", 0.45)} snow />
      <Haze y={600} c="#E8F4FF" o={0.45} />
      <Ridge seed={23} base={700} amp={200} kind="peaks" c="#4A5A7A" snow />
      <Ridge seed={24} base={800} amp={120} kind="pines" c="#2A5A4A" />
      <Ground c="#4A8A4A" texture="grass" seed={25} />
      {/* river */}
      <path d={`M780 ${GROUND_Y - 30} Q 700 960 860 1000 Q 1040 1050 900 ${H} L 1180 ${H} Q 1200 1020 1040 980 Q 900 940 900 ${GROUND_Y - 30} Z`} fill="#4A9AD8" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${850 + i * 40} ${940 + i * 40} q 30 ${-6 + Math.sin(f / 8 + i) * 4} 60 0`} stroke="#CFE8FF" strokeWidth={4} fill="none" opacity={0.7} />)}
      {[[180, 910, 1.0], [1700, 900, 1.1], [1500, 930, 0.8]].map(([x, y, s], i) => <Thing key={i} name="pine" x={x} y={y} s={s} />)}
      <Thing name="rocks" x={480} y={970} s={0.7} /><Thing name="flower" x={1320} y={990} s={0.4} f={f} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="pine" x={1960} y={1240} s={2.2} shadow={false} /></g>
    </Frame>
  );
};

export const Beach: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#0A2A3A">
      <Sky top="#2A8AD8" mid="#7FD0F0" low="#E8FAFF" sun={{ x: 520, y: 260, r: 70, c: "#FFF2C4" }} />
      <Clouds seed={31} n={3} y0={80} y1={260} />
      {/* ocean bands with moving waves */}
      <rect x={0} y={560} width={W} height={300} fill="#1E7AB8" />
      <rect x={0} y={560} width={W} height={60} fill="#3A9AD8" opacity={0.8} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-200 + ((f * (1 + i * 0.2) + i * 300) % 600)} ${620 + i * 40} ${Array.from({ length: 12 }, (_, k) => `q 40 -10 80 0`).join(" ")}`} stroke="#CFF0FF" strokeWidth={4} fill="none" opacity={0.5} />)}
      <g transform={`translate(${(f * 0.6) % 400 + 1200},${560 + Math.sin(f / 15) * 4})`}><Thing name="sailboat" x={0} y={0} s={0.3} shadow={false} /></g>
      <path d={`M0 ${820 + Math.sin(f / 12) * 8} Q 480 ${800 + Math.sin(f / 12) * 8} 960 ${830} T ${W} ${815 + Math.sin(f / 10) * 8} L ${W} 860 L 0 860 Z`} fill="#F4FAFF" opacity={0.85} />
      <Ground c="#F0D49A" texture="sand" seed={32} />
      {[[300, 930, 1.3], [1650, 920, 1.1]].map(([x, y, s], i) => <Thing key={i} name="palm" x={x} y={y} s={s} f={f} />)}
      <Thing name="seashell" x={900} y={990} s={0.35} /><Thing name="rocks" x={1300} y={970} s={0.5} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="palm" x={-80} y={1300} s={2.0} f={f} shadow={false} /></g>
    </Frame>
  );
};

export const Farm: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#0B2A1A">
      <Sky top="#3A8AE0" mid="#9FD0F4" low="#E8F8FF" sun={{ x: 1600, y: 200, r: 70, c: "#FFF2A8" }} />
      <Clouds seed={41} n={5} />
      <Ridge seed={42} base={640} amp={100} kind="hills" c={mix("#4A9A5A", "#9FD0F4", 0.5)} />
      <Ridge seed={43} base={740} amp={110} kind="hills" c="#5AAA4A" />
      {/* crop rows on the mid hill */}
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${1100 + i * 30} 760 L ${700 + i * 120} 880`} stroke="#4A8A3A" strokeWidth={8} opacity={0.6} />)}
      <Thing name="barn" x={1450} y={760} s={0.55} /><Thing name="wind-turbine" x={300} y={700} s={0.5} f={f} />
      <Ridge seed={44} base={850} amp={60} kind="hills" c="#4A9A3A" />
      <Ground c="#5AAA4A" texture="grass" seed={45} />
      {/* fence */}
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={40 + i * 90} y={900} width={14} height={80} rx={4} fill="#A8724A" />)}
      <rect x={40} y={918} width={1004} height={12} rx={5} fill="#C8945A" /><rect x={40} y={948} width={1004} height={12} rx={5} fill="#C8945A" />
      {[[1250, 980], [1500, 1000], [1700, 970]].map(([x, y], i) => <Thing key={i} name={i === 1 ? "sunflower" : "flower"} x={x} y={y} s={0.4} f={f} />)}
      <Thing name="oak" x={1820} y={900} s={0.9} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="grass-tuft" x={60} y={1120} s={1.8} f={f} shadow={false} /></g>
    </Frame>
  );
};

export const Arctic: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#05102A">
      <Sky top="#05082A" mid="#1A2A6A" low="#5A7AB8" />
      {/* aurora ribbons */}
      {[["#3FE0B0", 0], ["#7A5AD8", 1], ["#3FC1C9", 2]].map(([c, i]) => (
        <path key={i as number} d={`M-100 ${260 + (i as number) * 50} ${Array.from({ length: 8 }, (_, k) => `Q ${150 + k * 280} ${200 + Math.sin(f / 30 + k + (i as number)) * 80 + (i as number) * 40} ${280 + k * 280} ${260 + (i as number) * 50}`).join(" ")}`}
          stroke={c as string} strokeWidth={60} fill="none" opacity={0.25} style={{ filter: "blur(12px)" }} />
      ))}
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % W} cy={(i * 97) % 420} r={2} fill="#FFFFFF" opacity={0.6} />)}
      <Ridge seed={51} base={640} amp={200} kind="ice" c={mix("#8AA8D8", "#1A2A6A", 0.4)} />
      <Haze y={660} c="#B8D0F0" o={0.3} />
      <Ridge seed={52} base={760} amp={120} kind="ice" c="#C8DCF4" />
      <rect x={0} y={790} width={W} height={120} fill="#2A4A8A" />
      {[[300, 830, 160], [900, 860, 220], [1500, 820, 140]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y + Math.sin(f / 20 + i) * 3} rx={w} ry={22} fill="#E8F4FF" />)}
      <Ground c="#E8F0FA" texture="snow" seed={53} />
      <Thing name="rocks" x={1600} y={980} s={0.6} />
      {children}
      <g style={{ filter: "blur(5px)" }}><path d={`M${W} ${H} L ${W} 820 Q ${W - 200} 860 ${W - 360} ${H} Z`} fill="#C8DCF4" /></g>
    </Frame>
  );
};

import { Canyon, Jungle, Savanna, Swamp, VolcanoIsland } from "./landscapes2";
export const LANDSCAPES = { Forest, Desert, Mountains, Beach, Farm, Arctic, Jungle, Canyon, Swamp, VolcanoIsland, Savanna };
