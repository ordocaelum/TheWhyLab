// Moon episode assets: a level-2 Moon, star field, Orion, and moonrise sets with the moon BEHIND the skyline/ridges.
// Sets take moon={{x,y,r,tint}} and children = actor layer (in front of the scenery, behind foreground framers).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W } from "./kit";
import { mix, rng, shade } from "./gen";
import { Skyline } from "./urban";
import { Ground, Ridge } from "./landscapes";
import { Thing } from "./objects";

export type MoonSpec = { x: number; y: number; r: number; tint?: number; glow?: number };

// Full moon. tint 0 = silver-white (high), 1 = deep orange (on the horizon). Recognisable maria layout (near side).
export const Moon: React.FC<MoonSpec & { id?: string; squash?: number }> = ({ x, y, r, tint = 0, glow = 1, id = "mn", squash = 1 }) => {
  const base = mix("#F4F1E6", "#FFB060", tint);
  const dark = mix("#B8B4A8", "#C8703A", tint);
  const halo = mix("#DDE6FF", "#FF9A4A", tint);
  const R = rng(17);
  const craters = Array.from({ length: 18 }, () => {
    const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 0.88;
    return { cx: Math.cos(a) * d, cy: Math.sin(a) * d, cr: 0.025 + R() * 0.07 };
  });
  return (
    <g transform={`translate(${x},${y}) scale(${r},${r * squash})`}>
      <defs>
        <radialGradient id={`${id}h`}><stop offset="0.35" stopColor={halo} stopOpacity={0.45 * glow} /><stop offset="1" stopColor={halo} stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}d`} cx="0.42" cy="0.4" r="0.65"><stop offset="0" stopColor={shade(base, 0.25)} /><stop offset="0.75" stopColor={base} /><stop offset="1" stopColor={shade(base, -0.18)} /></radialGradient>
        <clipPath id={`${id}c`}><circle r={1} /></clipPath>
      </defs>
      <circle r={3.2} fill={`url(#${id}h)`} />
      <circle r={1} fill={`url(#${id}d)`} />
      <g clipPath={`url(#${id}c)`} fill={dark}>
        {/* maria: Imbrium, Serenitatis, Tranquillitatis, Crisium, Procellarum, Nubium */}
        <ellipse cx={-0.28} cy={-0.38} rx={0.3} ry={0.22} opacity={0.55} />
        <ellipse cx={0.12} cy={-0.3} rx={0.17} ry={0.15} opacity={0.5} />
        <ellipse cx={0.22} cy={-0.05} rx={0.22} ry={0.17} opacity={0.5} />
        <ellipse cx={0.62} cy={-0.22} rx={0.12} ry={0.1} opacity={0.55} />
        <ellipse cx={-0.55} cy={0.02} rx={0.25} ry={0.42} opacity={0.45} />
        <ellipse cx={-0.12} cy={0.32} rx={0.2} ry={0.13} opacity={0.42} />
        <ellipse cx={0.32} cy={0.28} rx={0.15} ry={0.1} opacity={0.38} />
        {craters.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={c.cr * 0.7} fill={shade(base, -0.1)} opacity={0.3} />
            <path d={`M${c.cx - c.cr * 0.7} ${c.cy} a ${c.cr * 0.7} ${c.cr * 0.7} 0 0 1 ${c.cr * 1.4} 0`} fill="none" stroke={shade(base, 0.3)} strokeWidth={0.008} opacity={0.5} />
          </g>
        ))}
        {/* Tycho with rays */}
        <circle cx={-0.12} cy={0.68} r={0.04} fill={shade(base, 0.4)} />
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={-0.12} y1={0.68} x2={-0.12 + Math.cos(a) * 0.5} y2={0.68 + Math.sin(a) * 0.5} stroke={shade(base, 0.35)} strokeWidth={0.012} opacity={0.35} />; })}
        {/* limb darkening */}
        <circle r={1} fill="none" stroke={shade(base, -0.25)} strokeWidth={0.12} opacity={0.35} />
      </g>
    </g>
  );
};

export const Stars: React.FC<{ seed?: number; n?: number; y1?: number; o?: number }> = ({ seed = 3, n = 120, y1 = 700, o = 1 }) => {
  const f = useCurrentFrame();
  const R = rng(seed);
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x = R() * W, y = R() * y1, r = 0.8 + R() * 2.2, ph = R() * 6;
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={(0.35 + 0.4 * Math.sin(f / 18 + ph)) * (1 - y / (y1 * 1.3))} />;
      })}
    </g>
  );
};

// Orion: 7 main stars + belt. s scales the whole constellation (to show the horizon effect).
export const Orion: React.FC<{ x: number; y: number; s?: number; lines?: boolean }> = ({ x, y, s = 1, lines = true }) => {
  const P = { bet: [-90, -150], bel: [80, -140], a: [-20, 0], b: [10, -6], c: [40, -12], sai: [-80, 150], rig: [100, 140] } as Record<string, number[]>;
  const L = [["bet", "a"], ["bel", "c"], ["a", "b"], ["b", "c"], ["a", "sai"], ["c", "rig"], ["bet", "bel"]];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {lines && L.map(([p, q], i) => <line key={i} x1={P[p][0]} y1={P[p][1]} x2={P[q][0]} y2={P[q][1]} stroke="#9FB8FF" strokeWidth={2 / s} opacity={0.45} />)}
      {Object.entries(P).map(([k, [px, py]]) => <circle key={k} cx={px} cy={py} r={(k === "bet" ? 9 : k === "rig" ? 8 : 6) / Math.sqrt(s)} fill={k === "bet" ? "#FFB27A" : "#CFE0FF"} />)}
    </g>
  );
};

const Sky: React.FC<{ id: string; stops: string[] }> = ({ id, stops }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}</linearGradient></defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </g>
);
const Vig: React.FC<{ o?: number }> = ({ o = 0.5 }) => (
  <g><defs><radialGradient id="mvg" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs><rect width={W} height={H} fill="url(#mvg)" /></g>
);

// DUSK CITY: moon rises between two skyline layers; optional rooftop deck for actors (feet y≈920, s≈0.62)
export const MoonCity: React.FC<{ moon?: MoonSpec; roof?: boolean; children?: React.ReactNode }> = ({ moon, roof = true, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Sky id="mcs" stops={["#0B0F3A", "#2A2A6A", "#6A3A7A", "#E07A5A"]} />
        <Stars seed={9} n={90} y1={520} />
        {moon && <Moon id="mcm" {...moon} />}
        <Skyline seed={21} base={roof ? 780 : 860} minH={160} maxH={420} c="#3A2E6A" haze={0.55} hazeC="#C86A6A" lit={0.25} />
        <Skyline seed={22} base={roof ? 830 : 920} minH={80} maxH={300} c="#1E1A44" haze={0.2} hazeC="#8A4A6A" lit={0.5} />
        {roof && (
          <g>
            <path d={`M0 800 L ${W} 800 L ${W} ${H} L 0 ${H} Z`} fill="#3A3A4A" />
            {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 131) % W} y={830 + ((i * 47) % 200)} width={60} height={4} fill="#2E2E3C" />)}
            <rect x={0} y={772} width={W} height={34} fill="#5A5A6A" /><rect x={0} y={772} width={W} height={7} fill="#7A7A8A" />
            <g transform="translate(1720,800)">{[-60, 0, 60].map((x) => <line key={x} x1={x} y1={0} x2={x * 0.6} y2={-160} stroke="#2A2030" strokeWidth={9} />)}<rect x={-90} y={-330} width={180} height={180} rx={12} fill="#6A4A3A" /><path d="M-96 -330 L 0 -390 L 96 -330 Z" fill="#4A3228" /></g>
            <rect x={140} y={600} width={9} height={200} fill="#20202C" /><circle cx={144} cy={596} r={7} fill="#FF4D6D" opacity={0.4 + 0.6 * (Math.floor(f / 20) % 2)} />
          </g>
        )}
        {children}
        {roof && <g><path d={`M0 ${H} L 0 995 L ${W} 1012 L ${W} ${H} Z`} fill="#22222E" /><rect x={0} y={988} width={W} height={9} fill="#4A4A5A" /></g>}
        <Vig o={0.55} />
      </svg>
    </AbsoluteFill>
  );
};

// DUSK FIELDS: autumn hills, barn, moon rising behind the far ridge (actors feet y≈980, s≈0.6)
export const MoonFields: React.FC<{ moon?: MoonSpec; children?: React.ReactNode; night?: number }> = ({ moon, children, night = 0.5 }) => {
  const f = useCurrentFrame();
  const top = mix("#2A3A8A", "#0B0F3A", night), low = mix("#F4A86A", "#8A4A6A", night);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Sky id="mfs" stops={[top, mix(top, low, 0.5), low]} />
        <Stars seed={5} n={70} y1={460} o={night} />
        {moon && <Moon id="mfm" {...moon} />}
        <Ridge seed={71} base={700} amp={70} kind="hills" c={mix("#5A3A5A", low, 0.35)} />
        <Ridge seed={72} base={790} amp={90} kind="hills" c="#4A3A3A" />
        <Thing name="barn" x={1480} y={800} s={0.5} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${1000 + i * 30} 800 L ${640 + i * 110} 900`} stroke="#3A2A20" strokeWidth={7} opacity={0.5} />)}
        <Ridge seed={73} base={880} amp={50} kind="hills" c="#3A2E24" />
        <Ground c="#4A3A28" texture="grass" seed={74} />
        {[[260, 900, 0.9], [1780, 910, 1.0]].map(([x, y, s], i) => <Thing key={i} name="oak" x={x} y={y} s={s} f={f} />)}
        {/* dusk grade over the scenery (not the actors) */}
        <rect width={W} height={H} fill={mix("#3A2A6A", "#0B0F3A", night)} opacity={0.38} style={{ mixBlendMode: "multiply" }} />
        {Array.from({ length: 16 }, (_, i) => { const lx = (i * 157 + f * 2) % W, ly = 300 + ((i * 83 + f * 1.5) % 700); return <ellipse key={i} cx={lx} cy={ly} rx={8} ry={4} fill={i % 2 ? "#E0782A" : "#C8502A"} transform={`rotate(${f * 3 + i * 40},${lx},${ly})`} opacity={0.8} />; })}
        {children}
        <Vig o={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// NIGHT SEA: flat ocean horizon (no landmarks), moon path on the water (actors on a small dock, feet y≈990)
export const MoonSea: React.FC<{ moon?: MoonSpec; children?: React.ReactNode }> = ({ moon, children }) => {
  const f = useCurrentFrame();
  const hz = 640;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <Sky id="mss" stops={["#060A2A", "#1A2A5A", "#5A4A7A", "#C87A6A"]} />
        <Stars seed={13} n={110} y1={560} />
        {moon && <Moon id="msm" {...moon} />}
        <rect x={0} y={hz} width={W} height={H - hz} fill="#0E1A3A" />
        <rect x={0} y={hz} width={W} height={6} fill="#3A4A7A" />
        {moon && Array.from({ length: 22 }, (_, i) => {
          const yy = hz + 14 + i * 20, w = 30 + i * 9 + Math.sin(f / 6 + i) * 10;
          return <rect key={i} x={moon.x - w / 2 + Math.sin(f / 9 + i * 1.3) * 14} y={yy} width={w} height={5} rx={2.5} fill={mix("#FFF2D0", "#FFB060", moon.tint ?? 0)} opacity={0.55 - i * 0.018} />;
        })}
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${((i * 173 + f * 1.2) % (W + 200)) - 100} ${hz + 60 + (i * 41) % 380} q 30 -8 60 0`} stroke="#3A5A9A" strokeWidth={3} fill="none" opacity={0.5} />)}
        <g transform={`translate(${1500 + Math.sin(f / 40) * 20},${hz + 6 + Math.sin(f / 15) * 3})`}><Thing name="sailboat" x={0} y={0} s={0.28} shadow={false} /></g>
        {children}
        <Vig o={0.55} />
      </svg>
    </AbsoluteFill>
  );
};

// Ponzo illusion: converging rails with two identical bars. measure 0..1 slides a ruler to prove they match.
export const Ponzo: React.FC<{ x?: number; y?: number; s?: number; measure?: number }> = ({ x = W / 2, y = H / 2, s = 1, measure = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-420 380 L -40 -380 M420 380 L 40 -380" stroke="#C8B89A" strokeWidth={16} strokeLinecap="round" />
    {Array.from({ length: 12 }, (_, i) => { const t = i / 11, yy = 380 - t * 760, hw = 420 - t * 380 + 30; return <rect key={i} x={-hw} y={yy - 7} width={hw * 2} height={14} rx={5} fill="#6A4A2A" opacity={0.8} />; })}
    <rect x={-110} y={-260} width={220} height={36} rx={10} fill="#FF4D6D" />
    <rect x={-110} y={250} width={220} height={36} rx={10} fill="#FF4D6D" />
    {measure > 0 && (
      <g transform={`translate(0,${-242 + measure * 510})`}>
        <rect x={-110} y={-56} width={220} height={20} rx={4} fill="#FFD23F" opacity={0.95} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-110 + i * 20} y={-56} width={3} height={i % 2 ? 10 : 18} fill="#2A0F5A" />)}
      </g>
    )}
  </g>
);
