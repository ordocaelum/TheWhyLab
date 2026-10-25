// Episode: "There's Plastic in Your Brain. Or Is There?" Narrator-only, Infographics-style beats on the cinema layer.
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { H, INK, lerp, sp, W } from "./kit";
import { LinesCtx, Line, makeTiming, OffsetCtx } from "./timing";
import { Grain, rng } from "./gen";
import { Presenter } from "./lab";
import { LabWide } from "./sets";
import { Kitchen } from "./interiors";
import { DocV2 } from "./doc2";
import { AVATARS, Human2 } from "./human2";
import { Brain } from "./anatomy";
import { Artery, BloodTunnel, Bottle, Courthouse, Fingerprint, Gauge, Memo, Particle, ParticleField, PLASTIC, StatCard } from "./plastic";
import { BloomDefs, Cine, Dust, Flare, GodRays, Grade, Haze, Plane, useCam, ZoomIn } from "./cinema";
import MICRO_LINES from "./micro_lines.json";

const LINES = MICRO_LINES as Line[];
const T = makeTiming(LINES);
const AV = (n: string) => AVATARS.find((a) => a.name === n)!.L;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------- shot scaffolding ----------
type CamKind = "push" | "pull" | "left" | "right" | "rise" | "still";
const CAMS: Record<CamKind, { a: { z: number; x: number; y: number }; b: { z: number; x: number; y: number } }> = {
  push: { a: { z: 1.02, x: 0, y: 0 }, b: { z: 1.16, x: 0, y: -10 } },
  pull: { a: { z: 1.18, x: 0, y: -10 }, b: { z: 1.03, x: 0, y: 0 } },
  left: { a: { z: 1.08, x: 60, y: 0 }, b: { z: 1.1, x: -60, y: 0 } },
  right: { a: { z: 1.08, x: -60, y: 0 }, b: { z: 1.1, x: 60, y: 0 } },
  rise: { a: { z: 1.08, x: 0, y: 50 }, b: { z: 1.12, x: 0, y: -50 } },
  still: { a: { z: 1.04, x: 0, y: 0 }, b: { z: 1.06, x: 0, y: 0 } },
};
const BG: Record<string, [string, string, string]> = {
  lab: ["#05081E", "#101C44", "#1E2E66"], body: ["#1A0308", "#4A0A16", "#8A1A2A"], sea: ["#020A1A", "#06244A", "#0E4A7A"],
  dark: ["#020208", "#0A0A1A", "#141430"], court: ["#05081A", "#121A3A", "#2A2A4A"], warn: ["#120308", "#3A0A12", "#6A1A1A"], green: ["#02100A", "#0A2A1E", "#1A4A3A"],
};
const Back: React.FC<{ k: string; seed?: number; parts?: number }> = ({ k, seed = 1, parts = 40 }) => {
  const [a, b, c] = BG[k];
  return (
    <>
      <Plane depth={0.05}>
        <defs><radialGradient id={`bg${k}`} cx="0.5" cy="0.45" r="0.85"><stop offset="0" stopColor={c} /><stop offset="0.6" stopColor={b} /><stop offset="1" stopColor={a} /></radialGradient></defs>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill={`url(#bg${k})`} />
      </Plane>
      {parts > 0 && <Plane depth={0.3} blur={4}><ParticleField seed={seed} n={parts} size={[3, 10]} speed={0.4} glow={0.8} /></Plane>}
    </>
  );
};
const Shot: React.FC<{ k?: string; cam?: CamKind; seed?: number; parts?: number; children?: React.ReactNode; near?: React.ReactNode; dust?: boolean; ox?: number; oy?: number; warm?: string }> = ({ k = "lab", cam = "push", seed = 1, parts = 40, children, near, dust = true, ox, oy, warm }) => {
  const C = CAMS[cam];
  const c = useCam([{ at: 0, ...C.a }, { at: 300, ...C.b }], { ox, oy });
  return (
    <Cine cam={c}>
      <Back k={k} seed={seed} parts={parts} />
      <Plane depth={1}>{children}</Plane>
      {dust && <Plane depth={1.25} blur={1.5}><Dust seed={seed + 3} n={36} c="#CFE8FF" size={2.6} o={0.35} rise={0.2} /></Plane>}
      {near && <Plane depth={1.7} blur={9}>{near}</Plane>}
      <Grade warm={warm} vig={0.6} leak={0.07} />
    </Cine>
  );
};
// big punchy caption (SVG, inside a plane)
const Cap: React.FC<{ t: string; y?: number; x?: number; size?: number; c?: string; at?: number }> = ({ t, y = 170, x = W / 2, size = 96, c = "#FFFFFF", at = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [at, at + 6, at + 11], [1.8, 0.94, 1], clamp);
  if (f < at) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={INK} dy={9}>{t}</text>
      <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={c} style={{ filter: `drop-shadow(0 0 18px ${c}66)` }}>{t}</text>
    </g>
  );
};
const Pill: React.FC<{ t: string; x: number; y: number; at?: number; c?: string; size?: number }> = ({ t, x, y, at = 0, c = "#FFD23F", size = 40 }) => {
  const f = useCurrentFrame();
  const s = sp(f, at, 10);
  const w = t.length * size * 0.7 + 60;
  return <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-w / 2} y={-size} width={w} height={size * 1.55} rx={size * 0.77} fill={c} /><text textAnchor="middle" y={size * 0.18} fontFamily="Arial Black" fontSize={size} fill={INK}>{t}</text></g>;
};
const Head: React.FC<{ x: number; y: number; s?: number; f: number; spoon?: number }> = ({ x, y, s = 1, f, spoon = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-230 260 C -260 120 -300 -60 -220 -200 C -150 -330 120 -350 220 -230 C 300 -130 280 0 250 60 L 290 120 L 240 140 L 250 200 Q 230 260 150 250 L 120 330 L -150 330 Z" fill="#1E2E66" opacity={0.85} stroke="#5A8AD8" strokeWidth={6} />
    <g transform="translate(10,-110)"><Brain id="hd" x={0} y={0} s={0.55} f={f} /></g>
    {spoon > 0 && (
      <g transform={`translate(20,-110) rotate(-30) scale(${spoon})`} style={{ filter: "drop-shadow(0 0 20px #3FD1FF)" }}>
        <ellipse cx={0} cy={-70} rx={46} ry={62} fill="#7FE8FF" opacity={0.85} />
        <rect x={-10} y={-10} width={20} height={150} rx={10} fill="#7FE8FF" opacity={0.85} />
      </g>
    )}
  </g>
);
const Vials: React.FC<{ lit: number; at?: number }> = ({ lit, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>{Array.from({ length: 22 }, (_, i) => {
      const x = 260 + (i % 11) * 140, y = 470 + Math.floor(i / 11) * 300;
      const on = i < lit && f > at + i * 3;
      return <g key={i} transform={`translate(${x},${y})`}><rect x={-26} y={-120} width={52} height={200} rx={24} fill="#E8F4FF" opacity={0.25} /><rect x={-20} y={-40} width={40} height={114} rx={18} fill="#B81A2E" />{on && <><circle cy={10} r={52} fill="#FF5FA2" opacity={0.25} /><Particle x={0} y={10} r={10} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={f * 3} /></>}<rect x={-30} y={-140} width={60} height={26} rx={6} fill="#4A5A8A" /></g>;
    })}</g>
  );
};
const Recycle: React.FC<{ x: number; y: number; s?: number; crack?: number; c?: string }> = ({ x, y, s = 1, crack = 0, c = "#2FE08A" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 120, 240].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M-40 -150 L 70 -150 L 110 -80 L 140 -98 L 120 -10 L 40 -30 L 70 -46 L 46 -88 L -10 -88 Z" fill={c} /></g>)}
    {crack > 0 && <path d={`M-20 -170 l 30 60 l -40 40 l 50 60 l -30 70 l 40 60`} stroke="#0B0B18" strokeWidth={14} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - crack)} />}
  </g>
);
const People: React.FC<{ n: number; x: number; y: number; c?: string; w?: number }> = ({ n, x, y, c = "#9FB0D8", w = 60 }) => (
  <g>{Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${x + i * w},${y})`}><circle cy={-60} r={18} fill={c} /><rect x={-18} y={-38} width={36} height={56} rx={14} fill={c} /></g>)}</g>
);

// =========================== COLD OPEN ===========================
const S1: React.FC = () => { const f = useCurrentFrame(); return <Shot k="lab" cam="push" oy={430}><BloomDefs id="b1" r={22} /><g filter="url(#b1)"><Head x={W / 2} y={560} s={1.1} f={f} spoon={sp(f, 50, 12)} /></g><Cap t="A SPOONFUL OF PLASTIC?" y={950} size={72} c="#7FE8FF" at={70} /></Shot>; };
const S2: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push"><ellipse cx={W / 2} cy={760} rx={520} ry={70} fill="#C8D0E8" opacity={0.25} /><Brain id="s2" x={W / 2} y={560} s={0.9} f={f} /><g opacity={lerp(f, 40, 80, 0, 1)}><ParticleField seed={4} n={40} size={[4, 9]} area={[W / 2 - 300, 380, 600, 330]} speed={0} /></g><Pill t="NATURE MEDICINE, 2025" x={W / 2} y={170} at={10} c="#FFFFFF" /><GodRays x={W / 2} y={-100} c="#BFD8FF" n={8} len={1300} o={0.05} spread={0.9} dir={Math.PI / 2} /></Shot>; };
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const part = f < 90 ? 0 : f < 180 ? 1 : 2;
  return (
    <AbsoluteFill>
      {part === 0 && <Shot k="body" cam="push" parts={0} dust={false}><BloodTunnel plastic={0.7} speed={1.4} /><Cap t="BLOOD" y={940} c="#FFD0D8" /></Shot>}
      {part === 1 && <Shot k="body" cam="push"><Artery x={W / 2} y={560} s={1.25} /><Cap t="ARTERIES" y={940} c="#FFD27A" /></Shot>}
      {part === 2 && <Shot k="sea" cam="push"><Bottle x={W / 2} y={960} s={1.9} specks={1} /><Cap t="WATER" y={940} c="#7FE8FF" /></Shot>}
    </AbsoluteFill>
  );
};
const S4: React.FC = () => { const f = useCurrentFrame(); return <Shot k="court" cam="pull"><rect x={300} y={700} width={1320} height={60} rx={20} fill="#2A1A14" />{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${460 + i * 250},700)`}><circle cy={-150} r={46} fill="#0B0B18" /><path d="M-70 0 Q -70 -110 0 -110 Q 70 -110 70 0 Z" fill="#0B0B18" /></g>)}<Recycle x={W / 2} y={360} s={1} crack={lerp(f, 60, 110, 0, 1)} /><Pill t="ACCUSED. IT DENIES IT." x={W / 2} y={960} at={120} c="#FF8A7A" /></Shot>; };
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const glitch = f > 120 && f < 160 ? Math.sin(f * 5) * 14 : 0;
  return (
    <Shot k="warn" cam="push">
      <g transform={`translate(${glitch},0)`}><Fingerprint x={510} y={300} overlap={lerp(f, 20, 110, 0, 1)} /></g>
      {f > 120 && <Cap t="IT'S IN YOU" y={880} size={170} c="#FF3B4A" at={150} />}
      {f > 110 && f < 150 && <rect x={0} y={0} width={W} height={H} fill="#FF2D3D" opacity={0.12} />}
    </Shot>
  );
};

// =========================== CH1: THE PLASTIC FLOOD ===========================
const S6: React.FC = () => { const R = rng(9); return <Shot k="lab" cam="rise">{Array.from({ length: 70 }, (_, i) => <Bottle key={i} x={100 + R() * 1720} y={1100 - R() * 120 - Math.floor(i / 14) * 60} s={0.35 + R() * 0.2} />)}<Cap t="HOW MUCH PLASTIC?" y={200} at={10} /></Shot>; };
const S7: React.FC = () => { const f = useCurrentFrame(); const v = Math.round(lerp(f, 10, 120, 234, 460, Easing.out(Easing.cubic))); return <Shot k="lab" cam="push"><StatCard y={500} big={`${v} Mt`} label="PLASTIC MADE PER YEAR" sub="2000 → 2019 (OECD)" c="#3FD1FF" at={4} /><rect x={560} y={860} width={800 * lerp(f, 10, 120, 0.5, 1)} height={30} rx={15} fill="#3FD1FF" opacity={0.7} /></Shot>; };
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const seg = [[0.09, "#2FE08A", "RECYCLED 9%"], [0.19, "#FF8A3D", "BURNED 19%"], [0.5, "#9FB0D8", "LANDFILL ~50%"], [0.22, "#FF4D6D", "DUMPED / LEAKED 22%"]] as const;
  let a0 = -Math.PI / 2;
  const grow = lerp(f, 10, 60, 0, 1);
  return (
    <Shot k="lab" cam="still">
      <g transform="translate(700,560)">
        {seg.map(([p, c], i) => { const a1 = a0 + p * Math.PI * 2 * grow; const large = p * grow > 0.5 ? 1 : 0; const d = `M0 0 L ${Math.cos(a0) * 330} ${Math.sin(a0) * 330} A 330 330 0 ${large} 1 ${Math.cos(a1) * 330} ${Math.sin(a1) * 330} Z`; const el = <path key={i} d={d} fill={c} transform={i === 0 ? `translate(${Math.cos(a0 + p * Math.PI) * 30},${Math.sin(a0 + p * Math.PI) * 30})` : undefined} />; a0 = a1; return el; })}
      </g>
      {seg.map(([, c, t], i) => <Pill key={t} t={t} x={1420} y={330 + i * 130} at={20 + i * 10} c={c} size={38} />)}
    </Shot>
  );
};
const S9: React.FC = () => { const f = useCurrentFrame(); const R = rng(3); const b = lerp(f, 40, 120, 0, 1); return <Shot k="sea" cam="push"><g opacity={1 - b}><Bottle x={W / 2} y={900} s={1.8} crack={lerp(f, 10, 40, 0, 1)} /></g>{Array.from({ length: 50 }, (_, i) => { const a = R() * Math.PI * 2, d = R() * 500 * b; return <Particle key={i} x={W / 2 + Math.cos(a) * d} y={620 + Math.sin(a) * d * 0.7} r={4 + R() * 16 * (1 - b * 0.7)} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={f * 2 + i * 20} glow={b} />; })}<Cap t="IT JUST GETS SMALLER" y={180} at={60} /></Shot>; };
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, 260, 0, 3, Easing.inOut(Easing.cubic));
  const items = [["BOTTLE", "#7FC8FF"], ["RICE GRAIN", "#F4EEDC"], ["HUMAN HAIR", "#C8946A"], ["NANOPLASTIC", "#FF5FA2"]];
  const i = Math.min(3, Math.floor(z + 0.5));
  return <Shot k="lab" cam="still"><g transform={`translate(${W / 2},560) scale(${Math.pow(3, z - i)})`}>{i === 0 && <Bottle x={0} y={300} s={1.4} />}{i === 1 && <ellipse rx={260} ry={100} fill="#F4EEDC" />}{i === 2 && <rect x={-1200} y={-60} width={2400} height={120} rx={60} fill="#C8946A" />}{i === 3 && <Particle x={0} y={0} r={120} c="#FF5FA2" kind={0} glow={1.4} />}</g><Pill t={items[i][0]} x={W / 2} y={950} c={items[i][1]} size={44} /><Cap t="SMALLER… AND SMALLER" y={160} size={80} at={0} /></Shot>;
};
const S11: React.FC = () => <Shot k="body" cam="push" seed={6}><ParticleField seed={7} n={80} size={[5, 16]} speed={2} glow={1.2} /><Cap t="EVERYWHERE" y={540} size={150} c="#FF8A9A" at={10} /></Shot>;
const S12: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shot k="lab" cam="right">
      <g transform={`translate(560,560) rotate(${f * 6})`}><circle r={230} fill="#1A1A22" /><circle r={140} fill="#5A5A6A" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-14} y={-232} width={28} height={50} fill="#2A2A34" transform={`rotate(${i * 30})`} />)}</g>
      {Array.from({ length: 24 }, (_, i) => { const t = ((f * 2 + i * 13) % 200) / 200; return <circle key={i} cx={560 - 240 - t * 300} cy={790 - t * 60 + Math.sin(i) * 30} r={6 - t * 4} fill="#8A8A9A" opacity={1 - t} />; })}
      <g transform="translate(1360,560)"><rect x={-230} y={-260} width={460} height={520} rx={40} fill="#E8ECF4" /><circle r={170} fill="#2A3A6A" /><circle r={140} fill="#7FB8FF" opacity={0.5} />{Array.from({ length: 30 }, (_, i) => { const a = i * 0.7 + f / 12; return <path key={i} d={`M${Math.cos(a) * (40 + i * 3)} ${Math.sin(a) * (40 + i * 3)} q 10 -8 20 0`} stroke={PLASTIC[i % 6]} strokeWidth={4} fill="none" />; })}</g>
      <Pill t="TYRES" x={560} y={900} at={10} c="#9FB0D8" /><Pill t="FLEECE FIBRES" x={1360} y={900} at={40} c="#9FB0D8" />
    </Shot>
  );
};
const S13: React.FC = () => <Shot k="sea" cam="rise" seed={11}><Haze y={200} h={300} c="#3FA8D8" o={0.3} /><ParticleField seed={12} n={70} size={[3, 9]} speed={0.6} area={[0, 100, W, 900]} /><StatCard y={480} big="~2/3" label="FROM CLOTHES + TYRES" sub="of plastic reaching the sea as tiny particles (IUCN, 2017)" c="#7FE8FF" at={20} /></Shot>;
const S14: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push" warm="#3FD1FF"><Bottle x={1150} y={950} s={1.8} specks={lerp(f, 40, 160, 0, 0.6)} /><line x1={300} y1={300} x2={1150} y2={600} stroke="#3FFF8A" strokeWidth={8} opacity={0.8} style={{ filter: "drop-shadow(0 0 16px #3FFF8A)" }} /><rect x={170} y={240} width={240} height={130} rx={20} fill="#2A2F5A" /><Pill t="2024 STUDY" x={500} y={170} at={10} c="#FFFFFF" /></Shot>; };
const S15: React.FC = () => { const f = useCurrentFrame(); const v = Math.round(lerp(f, 10, 150, 0, 240000, Easing.out(Easing.cubic))); return <Shot k="sea" cam="push"><Bottle x={460} y={960} s={1.9} specks={1} /><StatCard x={1240} y={500} big={v.toLocaleString("en-US")} label="PARTICLES PER LITRE" sub="average · mostly nanoplastics (PNAS 2024)" c="#7FE8FF" at={4} /></Shot>; };
const S16: React.FC = () => { const f = useCurrentFrame(); const R = rng(16); return <Shot k="sea" cam="right"><g transform={`rotate(${lerp(f, 0, 40, 0, -70)},${W / 2},700)`}><Bottle x={W / 2} y={900} s={1.6} specks={1} /></g>{Array.from({ length: 40 }, (_, i) => { const t = ((f * 1.5 + i * 9) % 120) / 120; return <Particle key={i} x={W / 2 + 200 + t * 1100} y={520 + Math.sin(t * 6 + i) * 60 + (R() - 0.5) * 200} r={6 + R() * 6} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={f * 3} />; })}</Shot>; };

// =========================== CH2: INSIDE YOU ===========================
const S17: React.FC = () => <Shot k="lab" cam="left"><Vials lit={0} /><Pill t="AMSTERDAM, 2022 · 22 HEALTHY ADULTS" x={W / 2} y={170} at={6} c="#FFFFFF" size={40} /></Shot>;
const S18: React.FC = () => <Shot k="lab" cam="push"><Vials lit={17} at={0} /><StatCard y={170} big="17 / 22" label="" c="#FF5FA2" at={40} /></Shot>;
const S19: React.FC = () => <Shot k="body" cam="push" ox={W / 2} oy={560}><Artery x={W / 2} y={560} s={1.3} glow={0.3} /><Pill t="ITALY · CAROTID ARTERY SURGERY" x={W / 2} y={150} at={10} c="#FFFFFF" /></Shot>;
const S20: React.FC = () => { const f = useCurrentFrame(); return <Shot k="body" cam="push"><Artery x={560} y={560} s={1.05} glow={1.4} /><g transform="translate(1180,800)"><rect x={0} y={-130 * lerp(f, 150, 210, 0, 1)} width={150} height={130 * lerp(f, 150, 210, 0, 1)} rx={14} fill="#9FB0D8" /><rect x={230} y={-585 * lerp(f, 160, 230, 0, 1)} width={150} height={585 * lerp(f, 160, 230, 0, 1)} rx={14} fill="#FF4D6D" /><text x={75} y={50} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2">NO PLASTIC</text><text x={305} y={50} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2">PLASTIC</text></g><Cap t="~4.5× RISK" x={1330} y={200} c="#FF4D6D" at={220} /><Pill t="HEART ATTACK · STROKE · DEATH (~3 YEARS)" x={1300} y={930} at={230} c="#FFFFFF" size={30} /></Shot>; };
const S21: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="pull"><circle cx={W / 2} cy={560} r={320} fill="#1E4A8A" /><circle cx={W / 2} cy={560} r={320} fill="none" stroke="#3FD1FF" strokeWidth={6} />{Array.from({ length: 8 }, (_, i) => { const a = i * 0.8; const p = ((f + i * 12) % 60) / 60; return <circle key={i} cx={W / 2 + Math.cos(a) * 200} cy={560 + Math.sin(a) * 160} r={10 + p * 80} fill="none" stroke="#FF4D6D" strokeWidth={5} opacity={1 - p} />; })}<g transform={`translate(${W / 2},180) rotate(-4) scale(${sp(f, 10, 10)})`}><rect x={-500} y={-70} width={1000} height={130} rx={18} fill="none" stroke="#FFD23F" strokeWidth={10} /><text textAnchor="middle" y={30} fontFamily="Arial Black" fontSize={70} fill="#FFD23F">CAN'T PROVE CAUSE</text></g></Shot>; };
const S22: React.FC = () => { const f = useCurrentFrame(); return <Shot k="body" cam="push" warm="#FF9ABA"><ellipse cx={W / 2} cy={560} rx={420} ry={330} fill="#FF9ABA" opacity={0.25} /><ellipse cx={W / 2 - 60} cy={580} rx={170} ry={130} fill="#C83A5A" /><path d={`M${W / 2 + 60} 520 q 120 -40 160 40`} stroke="#E86A8A" strokeWidth={30} fill="none" strokeLinecap="round" />{[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${560 + i * 160},930)`}><circle r={44} fill={i < 4 && f > 80 + i * 10 ? "#FF5FA2" : "#3A4A7A"} />{i < 4 && f > 80 + i * 10 && <Particle x={0} y={0} r={12} c="#FFFFFF" />}</g>)}<Pill t="4 OF 6 PLACENTAS" x={W / 2} y={170} at={90} c="#FF9ABA" /></Shot>; };
const S23: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push" oy={540}><BloomDefs id="b23" r={20} /><g filter="url(#b23)"><Brain id="s23" x={W / 2} y={560} s={1.1 + f * 0.003} f={f} /></g></Shot>; };
const S24: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="still"><Brain id="b16" x={600} y={560} s={0.6} f={f} /><Brain id="b24" x={1320} y={560} s={0.6} f={f} /><Pill t="DIED 2016" x={600} y={900} at={10} c="#9FB0D8" /><Pill t="DIED 2024" x={1320} y={900} at={30} c="#FF8A7A" /></Shot>; };
const S25: React.FC = () => {
  const f = useCurrentFrame();
  const bar = (x: number, v: number, c: string, l: string, at: number) => { const h = 520 * v * lerp(f, at, at + 30, 0, 1); return <g key={l}><rect x={x - 80} y={880 - h} width={160} height={h} rx={16} fill={c} /><text x={x} y={930} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2">{l}</text></g>; };
  return <Shot k="lab" cam="right">{bar(400, 0.55, "#9FB0D8", "2016", 0)}{bar(640, 0.83, "#FF8A7A", "2024", 15)}{bar(1100, 0.08, "#7FB8FF", "LIVER", 90)}{bar(1340, 0.83, "#FF8A7A", "BRAIN", 100)}{bar(1640, 1, "#FF4D6D", "DEMENTIA", 180)}<Cap t="+50%" x={640} y={250} c="#FF8A7A" at={50} /><Cap t="MORE IN BRAINS" x={1220} y={170} size={60} at={120} /></Shot>;
};
const S26: React.FC = () => { const f = useCurrentFrame(); const a = f / 20; return <Shot k="dark" cam="still"><Pill t="PLASTIC" x={560} y={540} c="#3FD1FF" size={50} /><Pill t="DAMAGE" x={1360} y={540} c="#FF4D6D" size={50} /><path d="M720 470 Q 960 330 1200 470" stroke="#FFD23F" strokeWidth={8} fill="none" markerEnd="url(#ar)" /><path d="M1200 610 Q 960 750 720 610" stroke="#FFD23F" strokeWidth={8} fill="none" strokeDasharray="20 14" strokeDashoffset={-f * 2} /><text x={960} y={560} textAnchor="middle" fontFamily="Arial Black" fontSize={110} fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(a)}>?</text></Shot>; };
const S27: React.FC = () => { const f = useCurrentFrame(); return <Shot k="court" cam="push" parts={10}><GodRays x={W / 2} y={-200} c="#FFE2A8" n={6} len={1400} o={0.1} spread={0.5} dir={Math.PI / 2} /><g transform={`translate(${W / 2},820)`} opacity={lerp(f, 20, 60, 0, 1)}><circle cy={-330} r={80} fill="#0B0B18" /><path d="M-170 0 Q -170 -230 0 -230 Q 170 -230 170 0 Z" fill="#0B0B18" /></g><Cap t="WHO LET THIS HAPPEN?" y={170} c="#FFE2A8" at={40} /></Shot>; };

// =========================== CH3: THE RECYCLING PROMISE ===========================
const S28: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill><Kitchen><Human2 L={AV("Sofia")} x={760} y={1000} s={0.66} f={f} pose="present" expr="happy" look={1} /><g transform="translate(1180,990)"><rect x={-90} y={-220} width={180} height={220} rx={16} fill="#2E8AD8" /><Recycle x={0} y={-110} s={0.35} c="#FFFFFF" /></g></Kitchen><AbsoluteFill><svg width={W} height={H}>{["RINSE.", "SORT.", "RECYCLE."].map((t, i) => <Cap key={t} t={t} x={560 + i * 400} y={170} size={80} c="#2FE08A" at={20 + i * 25} />)}</svg></AbsoluteFill><Grade /></AbsoluteFill>; };
const S29: React.FC = () => { const f = useCurrentFrame(); return <Shot k="court" cam="left"><Memo x={520} y={560} rot={-10} hi={lerp(f, 60, 100, 0, 1)} /><Memo x={960} y={540} rot={4} s={1.1} hi={lerp(f, 100, 140, 0, 1)} /><Memo x={1400} y={570} rot={12} /><Pill t="SINCE THE 1970s" x={W / 2} y={160} at={20} c="#FFD23F" /><Pill t="INDUSTRY: 'NEVER INTENTIONALLY MISLED'" x={W / 2} y={970} at={200} c="#FFFFFF" size={32} /></Shot>; };
const S30: React.FC = () => { const f = useCurrentFrame(); return <Shot k="court" cam="push"><Courthouse x={W / 2} y={1000} s={1.2} /><g transform={`translate(${W / 2},300) rotate(-6) scale(${interpolate(f, [90, 98, 104], [2.5, 0.9, 1], clamp)})`} opacity={f > 90 ? 1 : 0}><rect x={-480} y={-80} width={960} height={150} rx={18} fill="none" stroke="#FF4D6D" strokeWidth={12} /><text textAnchor="middle" y={28} fontFamily="Arial Black" fontSize={64} fill="#FF4D6D">ACCUSED, NOT PROVEN</text></g><Pill t="CALIFORNIA v. EXXONMOBIL · 2024" x={W / 2} y={140} at={10} c="#FFFFFF" /></Shot>; };
const S31: React.FC = () => <Shot k="court" cam="pull"><rect x={W / 2 - 160} y={620} width={320} height={420} rx={20} fill="#2A2A3A" /><circle cx={W / 2} cy={430} r={80} fill="#0B0B18" /><path d={`M${W / 2 - 170} 640 Q ${W / 2 - 170} 520 ${W / 2} 520 Q ${W / 2 + 170} 520 ${W / 2 + 170} 640 Z`} fill="#0B0B18" /><Pill t="EXXON DENIES IT" x={W / 2} y={170} at={6} c="#FFFFFF" size={50} /><Pill t="CASE ONGOING" x={W / 2} y={970} at={60} c="#FFD23F" /></Shot>;
const S32: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerp(f, 10, 200, 0, 1, Easing.inOut(Easing.cubic));
  const pts = Array.from({ length: 30 }, (_, i) => { const x = i / 29; return [200 + x * 1500, 900 - (0.37 + x * 0.63) ** 1.6 * 700] as const; }).slice(0, Math.max(2, Math.round(t * 30)));
  return <Shot k="lab" cam="right"><line x1={200} y1={900} x2={1720} y2={900} stroke="#9FB0D8" strokeWidth={4} /><path d={`M${pts.map(([x, y]) => `${x} ${y}`).join(" L ")}`} stroke="#FF8A3D" strokeWidth={12} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px #FF8A3D)" }} /><rect x={200} y={880} width={1500 * t} height={20} fill="#2FE08A" opacity={0.8} /><text x={200} y={960} fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">2019: 460 Mt</text><text x={1720} y={960} textAnchor="end" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">2060: ~1,231 Mt</text><Cap t="ALMOST 3× BY 2060" y={170} c="#FF8A3D" at={150} /><Pill t="RECYCLED: UNDER 1/5" x={1300} y={820} at={200} c="#2FE08A" size={32} /></Shot>;
};
const S33: React.FC = () => { const f = useCurrentFrame(); const k = lerp(f, 20, 60, 0, 1); return <Shot k="warn" cam="push"><Cap t="THEN THE SCIENCE CRACKED" y={540} size={96} c="#FFFFFF" at={0} /><path d={`M960 0 L 900 220 L 1010 400 L 930 560 L 1040 760 L 980 1080`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - k)} style={{ filter: "drop-shadow(0 0 10px #FFFFFF)" }} /></Shot>; };

// =========================== CH4: THE TWIST ===========================
const S34: React.FC = () => { const f = useCurrentFrame(); const heat = lerp(f, 20, 90, 0, 1); return <Shot k="lab" cam="push"><g transform="translate(520,640)"><rect x={-200} y={-260} width={400} height={420} rx={30} fill="#3A3A4A" /><rect x={-140} y={-180} width={280} height={240} rx={16} fill={`rgb(${120 + heat * 135},${60 + heat * 40},30)`} /><circle cy={-60} r={50 * (1 - heat) + 6} fill="#E8A0B0" /><GodRays x={0} y={-60} c="#FFB060" n={8} len={300} o={0.2 * heat} /></g><Fingerprint x={860} y={360} w={880} overlap={0} /><Pill t="HEAT IT · READ THE FINGERPRINT" x={W / 2} y={150} at={10} c="#FFFFFF" size={36} /></Shot>; };
const S35: React.FC = () => { const f = useCurrentFrame(); return <Shot k="warn" cam="push"><Fingerprint x={510} y={360} overlap={lerp(f, 20, 120, 0, 1)} /><Cap t="TOO SIMILAR" y={900} c="#FFB060" at={130} /></Shot>; };
const S36: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push"><Brain id="s36" x={W / 2} y={540} s={0.85} f={f} /><g transform={`translate(${W / 2},540) rotate(-8) scale(${interpolate(f, [30, 38, 44], [2.4, 0.9, 1], clamp)})`} opacity={f > 30 ? 1 : 0}><circle r={170} fill="#FFB060" opacity={0.9} /><text textAnchor="middle" y={20} fontFamily="Arial Black" fontSize={90} fill={INK}>60% FAT</text><text textAnchor="middle" y={80} fontFamily="Arial Black" fontSize={32} fill={INK}>(DRY WEIGHT)</text></g></Shot>; };
const S37: React.FC = () => { const f = useCurrentFrame(); const m = lerp(f, 30, 90, 0, 1); return <Shot k="dark" cam="push">{Array.from({ length: 12 }, (_, i) => { const x = 460 + (i % 6) * 200, y = 450 + Math.floor(i / 6) * 220; return i % 3 === 0 ? <g key={i}><g opacity={1 - m}><Particle x={x} y={y} r={30} c={PLASTIC[i % 6]} /></g><circle cx={x} cy={y} r={34 * m} fill="#FFD27A" opacity={m} /></g> : <Particle key={i} x={x} y={y} r={30} c={PLASTIC[i % 6]} />; })}<Cap t="NOT PLASTIC AT ALL?" y={180} c="#FFD27A" at={60} /></Shot>; };
const S38: React.FC = () => { const f = useCurrentFrame(); return <Shot k="lab" cam="left">{Array.from({ length: 18 }, (_, i) => { const x = 260 + (i % 9) * 175, y = 380 + Math.floor(i / 9) * 330; return <g key={i} transform={`translate(${x},${y}) rotate(${(i % 3) - 1})`}><rect x={-70} y={-110} width={140} height={200} rx={6} fill="#F4F0E4" />{Array.from({ length: 6 }, (_, k) => <rect key={k} x={-50} y={-80 + k * 26} width={100} height={8} rx={4} fill="#9A9AAA" />)}{f > 20 + i * 6 && <text x={30} y={60} fontFamily="Arial Black" fontSize={90} fill="#FF4D6D">?</text>}</g>; })}<Cap t="18 STUDIES · 7 CHALLENGED" y={170} size={72} c="#FF4D6D" at={150} /></Shot>; };
const S39: React.FC = () => { const f = useCurrentFrame(); const t = lerp(f, 20, 160, 0, 1); return <Shot k="lab" cam="right"><path d={`M300 850 ${Array.from({ length: 20 }, (_, i) => `L ${300 + i * 70 * t} ${850 - (i / 19) ** 1.4 * 420 * t}`).join(" ")}`} stroke="#FFB060" strokeWidth={10} fill="none" strokeLinecap="round" /><Pill t="RISING OBESITY = MORE FAT?" x={W / 2} y={170} at={10} c="#FFB060" size={44} /><Pill t="A SUGGESTION, NOT A FINDING" x={1320} y={930} at={80} c="#FFFFFF" size={30} /></Shot>; };
const S40: React.FC = () => { const f = useCurrentFrame(); return <Shot k="court" cam="pull"><rect x={260} y={760} width={1400} height={50} rx={20} fill="#3A2A20" />{["Arjun", "Kenji"].map((n, i) => <Human2 key={n} L={AV(n)} x={420 + i * 220} y={1000} s={0.5} f={f + i * 7} pose={i ? "crossed" : "point"} expr="serious" look={1} />)}{["Claire", "Mateo"].map((n, i) => <Human2 key={n} L={AV(n)} x={1300 + i * 220} y={1000} s={0.5} f={f + i * 9} pose={i ? "hips" : "present"} expr="skeptical" look={-1} />)}<Pill t="AUTHORS" x={530} y={170} at={10} c="#3FD1FF" /><Pill t="CRITICS" x={1410} y={170} at={20} c="#FFB060" /></Shot>; };
const S41: React.FC = () => { const f = useCurrentFrame(); const v = 0.5 + 0.45 * Math.sin(f / 9) * Math.sin(f / 23); return <Shot k="lab" cam="push"><Gauge x={W / 2} y={720} v={v} s={1.6} labels={["½×", "10×"]} /><Pill t="SHE'S CONVINCED IT'S THERE" x={W / 2} y={170} at={10} c="#FFFFFF" size={44} /><Pill t="THE AMOUNT? UNKNOWN" x={W / 2} y={950} at={80} c="#FFD23F" size={40} /></Shot>; };
const S42: React.FC = () => { const f = useCurrentFrame(); return <Shot k="lab" cam="push"><g transform="translate(960,620)"><rect x={-60} y={-300} width={120} height={420} rx={56} fill="#E8F4FF" opacity={0.35} stroke="#E8F4FF" strokeWidth={6} /><text y={-330} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#F4EEE2">BLANK</text>{f > 60 && Array.from({ length: 8 }, (_, i) => <Particle key={i} x={(i % 3 - 1) * 30} y={-40 + i * 18} r={8} c={PLASTIC[i % 6]} rot={f * 2 + i * 30} />)}</g><Pill t="CONTAMINATION CHECK" x={W / 2} y={170} at={10} c="#FFFFFF" size={44} /><Pill t="OFTEN SKIPPED, CRITICS SAY" x={W / 2} y={960} at={90} c="#FF8A7A" size={38} /></Shot>; };
const S43: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push"><Cap t="JUST HYPE?" y={480} size={170} c="#FFFFFF" at={0} />{f > 70 && <Cap t="NOT SO FAST." y={700} size={110} c="#FF4D6D" at={70} />}</Shot>; };

// =========================== CH5: WHAT'S ACTUALLY TRUE ===========================
const S44: React.FC = () => { const f = useCurrentFrame(); return <Shot k="green" cam="push"><BloomDefs id="b44" r={24} /><g filter="url(#b44)"><Particle x={W / 2} y={540} r={60} c="#7CFF8A" rot={f} glow={1.5} /></g><Pill t="PLASTIC IS INSIDE US" x={W / 2} y={170} at={10} c="#7CFF8A" size={50} /><Pill t="HOW MUCH? WHAT IT DOES? STILL DEBATED" x={W / 2} y={950} at={80} c="#FFFFFF" size={34} /></Shot>; };
const S45: React.FC = () => { const f = useCurrentFrame(); const R = rng(45); return <Shot k="sea" cam="push" warm="#3FD1FF"><Particle x={W / 2} y={540} r={110} c="#3FD1FF" rot={f / 2} glow={1.6} />{Array.from({ length: 16 }, (_, i) => { const t = ((f * 2 + i * 15) % 90) / 90; const a = R() * Math.PI * 2; return <g key={i} opacity={1 - t}><circle cx={W / 2 + Math.cos(a) * (130 + t * 400)} cy={540 + Math.sin(a) * (130 + t * 300)} r={10} fill="#FFFFFF" style={{ filter: "drop-shadow(0 0 10px #FFFFFF)" }} /><text x={W / 2 + Math.cos(a) * (130 + t * 400) + 14} y={540 + Math.sin(a) * (130 + t * 300) - 10} fontFamily="Arial Black" fontSize={22} fill="#BFF6FF">•OH</text></g>; })}<Pill t="NATURE · OCT 2026" x={W / 2} y={150} at={6} c="#FFFFFF" /><Pill t="REACTIVE MOLECULES THAT CAN DAMAGE CELLS" x={W / 2} y={960} at={60} c="#7FE8FF" size={34} /></Shot>; };
const S46: React.FC = () => <Shot k="sea" cam="pull"><circle cx={W / 2} cy={560} r={260} fill="#2A6A8A" opacity={0.6} /><circle cx={W / 2} cy={560} r={260} fill="none" stroke="#7FE8FF" strokeWidth={6} /><circle cx={W / 2 + 40} cy={540} r={70} fill="#3A4A9A" /><Pill t="IN THE LAB, NOT IN PEOPLE" x={W / 2} y={170} at={6} c="#FFD23F" size={46} /><Pill t="A POSSIBLE PATHWAY TO HARM" x={W / 2} y={960} at={60} c="#FFFFFF" size={38} /></Shot>;
const S47: React.FC = () => { const f = useCurrentFrame(); return <Shot k="lab" cam="push"><Particle x={W / 2} y={560} r={90} c="#FF8A3D" rot={f / 2} glow={1.3} />{["BPA", "PHTHALATES"].map((t, i) => { const a = f / 30 + i * Math.PI; return <Pill key={t} t={t} x={W / 2 + Math.cos(a) * 330} y={560 + Math.sin(a) * 200} at={10 + i * 10} c="#FF8A3D" size={36} />; })}<Pill t="CAN INTERFERE WITH HORMONES (AAP)" x={W / 2} y={960} at={60} c="#FFFFFF" size={34} /></Shot>; };
const S48: React.FC = () => { const f = useCurrentFrame(); const half = f > 230; return <Shot k="court" cam="right">{!half ? <g><rect x={460} y={220} width={1000} height={640} rx={20} fill="#F4F0E4" /><text x={960} y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill={INK}>DRINKING WATER WATCH LIST (DRAFT)</text>{["PFAS", "PHARMACEUTICALS", "MICROPLASTICS", "…"].map((t, i) => <g key={t}><rect x={520} y={360 + i * 110} width={880} height={80} rx={10} fill={t === "MICROPLASTICS" ? `rgba(255,210,63,${lerp(f, 60, 90, 0, 1)})` : "#E2DCCC"} /><text x={560} y={414 + i * 110} fontFamily="Arial Black" fontSize={40} fill={INK}>{t}</text></g>)}<Pill t="EPA · FIRST TIME · PROPOSED" x={960} y={140} at={10} c="#FFFFFF" /></g> : <StatCard y={500} big="$144M" label="TO STUDY THE HEALTH RISKS" sub="U.S. Department of Health and Human Services" c="#2FE08A" at={232} />}</Shot>; };
const S49: React.FC = () => { const f = useCurrentFrame(); return <Shot k="lab" cam="push" warm="#FF9AD8"><rect x={560} y={200} width={800} height={600} rx={30} fill="#F4F6FF" /><rect x={560} y={200} width={800} height={130} rx={30} fill="#FF7AC8" /><text x={960} y={290} textAnchor="middle" fontFamily="Arial Black" fontSize={56} fill="#FFFFFF">PLASTIC DETOX™</text><text x={960} y={460} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill={INK}>CLEAN YOUR BLOOD</text><g transform={`translate(1240,700) rotate(-12) scale(${sp(f, 30, 9)})`}><rect x={-150} y={-60} width={300} height={110} rx={16} fill="#FFD23F" /><text textAnchor="middle" y={22} fontFamily="Arial Black" fontSize={60} fill={INK}>$$$$</text></g><Cap t="?" x={1500} y={300} size={220} c="#FF4D6D" at={90} /></Shot>; };
const S50: React.FC = () => <Shot k="court" cam="pull"><ellipse cx={W / 2} cy={720} rx={700} ry={180} fill="#3A2A20" />{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <rect key={i} x={W / 2 + Math.cos(a) * 760 - 40} y={720 + Math.sin(a) * 210 - 90} width={80} height={110} rx={14} fill="#1A1A2A" />; })}<Pill t="GLOBAL PLASTICS TREATY: STALLED" x={W / 2} y={170} at={10} c="#FF8A7A" size={46} /><Pill t="SPLIT OVER LIMITING PRODUCTION" x={W / 2} y={960} at={60} c="#FFFFFF" size={34} /></Shot>;
const S51: React.FC = () => { const f = useCurrentFrame(); return <Shot k="dark" cam="push" parts={8}><Particle x={W / 2} y={540} r={40} c="#FFFFFF" rot={f} glow={1.6} /></Shot>; };

// =========================== OUTRO ===========================
const S52: React.FC = () => { const f = useCurrentFrame(); const sweep = lerp(f, 120, 220, 0, 1, Easing.inOut(Easing.cubic)); return <Shot k="court" cam="still">{["SPOONFUL OF PLASTIC IN YOUR BRAIN!", "PLASTIC TIED TO HEART ATTACKS!", "YOUR WATER IS FULL OF PLASTIC!"].map((t, i) => <g key={t} transform={`translate(${W / 2 + sweep * 1600},${330 + i * 190}) rotate(${(i - 1) * 3}) scale(${1 - lerp(f, 30, 100, 0, 0.25)})`}><rect x={-560} y={-70} width={1120} height={130} rx={8} fill="#F4F0E4" /><text textAnchor="middle" y={20} fontFamily="Arial Black" fontSize={46} fill={INK}>{t}</text></g>)}<g transform={`translate(${-200 + sweep * 2200},560)`}><path d="M0 -120 Q 140 -140 200 -40 Q 220 40 120 80 L -60 80 Z" fill="#2A2A3A" /></g></Shot>; };
const S53: React.FC = () => { const f = useCurrentFrame(); const z = lerp(f, 0, 200, 0, 1, Easing.inOut(Easing.cubic)); return <Shot k="dark" cam="pull" parts={0}><g opacity={1 - z}><BloodTunnel plastic={0.6} speed={0.6} /></g><g opacity={z}><circle cx={W / 2} cy={560} r={330} fill="#1E5AA8" /><path d={`M${W / 2 - 200} 470 q 80 -90 170 -30 t 160 40 q -40 120 -150 100 t -180 -110`} fill="#2FA06A" /><circle cx={W / 2} cy={560} r={380} fill="#FF8A9A" opacity={0.18} /><ParticleField seed={53} n={60} size={[3, 8]} area={[W / 2 - 420, 140, 840, 840]} /></g></Shot>; };
const S54: React.FC = () => { const f = useCurrentFrame(); const swap = f > 120; return <AbsoluteFill><Kitchen><Human2 L={AV("Priya")} x={720} y={1000} s={0.66} f={f} pose="present" expr="happy" look={1} />{swap ? <g transform="translate(980,770)"><rect x={-80} y={-60} width={160} height={70} rx={14} fill="#CFEFFF" opacity={0.8} stroke="#FFFFFF" strokeWidth={4} /><text y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#FFFFFF">GLASS</text></g> : <g transform="translate(980,770)"><rect x={-80} y={-60} width={160} height={70} rx={14} fill="#FF8A3D" /><text y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#FFFFFF">PLASTIC</text></g>}</Kitchen><AbsoluteFill><svg width={W} height={H}><g transform="translate(1500,330)"><rect x={-130} y={-90} width={260} height={180} rx={18} fill="#3A3A4A" /><rect x={-100} y={-60} width={150} height={120} rx={8} fill="#7FB8FF" opacity={0.5} /><line x1={-160} y1={-120} x2={160} y2={120} stroke="#FF4D6D" strokeWidth={18} strokeLinecap="round" opacity={lerp(f, 30, 40, 0, 1)} /></g><text x={1500} y={510} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">NO MICROWAVING IN PLASTIC</text><text x={1500} y={560} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF" opacity={lerp(f, 60, 70, 0, 1)}>NO PLASTIC IN THE DISHWASHER</text></svg></AbsoluteFill><Grade /></AbsoluteFill>; };
const S55: React.FC = () => { const f = useCurrentFrame(); const z = lerp(f, 60, 280, 1, 6, Easing.in(Easing.cubic)); return <Shot k="dark" cam="still" parts={0}><g transform={`translate(${W / 2},540) scale(${z})`}><Particle x={0} y={0} r={40} c="#3FD1FF" rot={f} glow={1.4} /></g><rect width={W} height={H} fill="#000" opacity={lerp(f, 230, 290, 0, 1)} /></Shot>; };
const S56: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill><LabWide><DocV2 x={1290} y={1010} s={0.62} f={f} talk={Math.floor(f / 6) % 3 !== 0 && f < 120} pose="present" expr="skeptical" look={-1} /><Bottle x={880} y={1010} s={0.6} specks={0.6} /></LabWide><AbsoluteFill><svg width={W} height={H}><Cap t="CHECKING YOUR BOTTLE?" y={170} c="#7FE8FF" at={10} /><Pill t="SUBSCRIBE" x={W / 2} y={300} at={60} c="#FF4D6D" /></svg></AbsoluteFill><Grade /></AbsoluteFill>; };

type Sc = { line: number; C: React.FC; doc?: "bl" | "br" };
const SCENES: Sc[] = [
  S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28,
  S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47, S48, S49, S50, S51, S52, S53, S54, S55, S56,
].map((C, i) => ({ line: i + 1, C }));
SCENES[5].doc = "br"; SCENES[33].doc = "bl"; SCENES[43].doc = "br";

const spans = SCENES.map((s, i) => {
  const from = i === 0 ? 0 : T.lineStart(s.line) - 5;
  const next = SCENES[i + 1]?.line;
  const to = next ? T.lineStart(next) - 5 : T.TOTAL;
  return { from, dur: Math.max(1, to - from) };
});
export const MICRO_FRAMES = spans[spans.length - 1].from + spans[spans.length - 1].dur;
const HAS_VO = !(LINES[0] as Line & { placeholder?: boolean }).placeholder;

export const MicroEpisode: React.FC = () => (
  <LinesCtx.Provider value={LINES}>
    <AbsoluteFill style={{ background: "#020208" }}>
      {HAS_VO && <Audio src={staticFile("micro_vo.wav")} />}
      {SCENES.map((s, i) => (
        <Sequence key={i} from={spans[i].from} durationInFrames={spans[i].dur}>
          <OffsetCtx.Provider value={spans[i].from}>
            <s.C />
            {s.doc && <Presenter side={s.doc} enter={spans[i].from} expr="serious" />}
            {i > 0 && <ZoomIn dur={8} />}
          </OffsetCtx.Provider>
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  </LinesCtx.Provider>
);
void Flare; void Haze;
