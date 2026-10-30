// Episode: "AI Got Out. Is It Out of Control?" Narrator-only, Infographics-style beats on the cinema layer.
// One scene per narration line (51). Kit: ai.tsx; scaffolding (Shot/Cap/Pill) shared with MicroEp.
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { H, INK, lerp, sp, W } from "./kit";
import { LinesCtx, Line, makeTiming, OffsetCtx } from "./timing";
import { Grain, rng } from "./gen";
import { Presenter } from "./lab";
import { AVATARS, Human2 } from "./human2";
import { StatCard } from "./plastic";
import { BloomDefs, GodRays, ZoomIn } from "./cinema";
import { Cap, Pill, Shot } from "./MicroEp";
import { AI, Agent, Building, CaseFile, Counter, Gate, KeyGlyph, Ladder, Lock, PaperPlane, Rack, SandboxCube, ScreenWall, ServerWall, Sticky, Switches, TugOfWar, Vault, Vent, WebForm } from "./ai";
import AI_LINES from "./ai_lines.json";

const LINES = AI_LINES as Line[];
const T = makeTiming(LINES);
const AV = (n: string) => AVATARS.find((a) => a.name === n)!.L;
const useF = () => useCurrentFrame();

// ---------- small local props ----------
const Headline: React.FC<{ t: string; x: number; y: number; rot?: number; at?: number; w?: number }> = ({ t, x, y, rot = 0, at = 0, w = 640 }) => {
  const f = useF();
  const s = sp(f, at, 12);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2} y={-70} width={w} height={140} fill="#F2EEE4" style={{ filter: "drop-shadow(6px 10px 8px rgba(0,0,0,0.4))" }} />
      <rect x={-w / 2 + 20} y={-56} width={w - 40} height={8} fill={INK} opacity={0.6} />
      <text y={22} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill={INK}>{t}</text>
      {[38, 52].map((ly) => <rect key={ly} x={-w / 2 + 20} y={ly} width={w - 40} height={5} fill={INK} opacity={0.2} />)}
    </g>
  );
};
const Phone: React.FC<{ x: number; y: number; s?: number; ring?: boolean }> = ({ x, y, s = 1, ring = true }) => {
  const f = useF();
  const sh = ring ? Math.sin(f * 1.6) * 6 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${sh}) scale(${s})`}>
      <rect x={-90} y={-170} width={180} height={340} rx={28} fill="#14182A" stroke="#4A5680" strokeWidth={6} />
      <rect x={-74} y={-140} width={148} height={270} rx={10} fill="#1E3A66" />
      <circle cy={-40} r={40} fill={AI.red} opacity={0.8} />
      <text y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#FFFFFF">"MOM"?</text>
      {ring && [1, 2].map((k) => <circle key={k} r={150 + ((f * 3 + k * 40) % 80)} fill="none" stroke={AI.red} strokeWidth={4} opacity={0.4 - ((f * 3 + k * 40) % 80) / 200} />)}
    </g>
  );
};
const Calendar: React.FC<{ x: number; y: number; m: string; s?: number }> = ({ x, y, m, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-170} width={300} height={320} rx={18} fill="#F4F6FB" stroke={INK} strokeWidth={6} />
    <rect x={-150} y={-170} width={300} height={90} rx={18} fill={AI.red} />
    <text y={-108} textAnchor="middle" fontFamily="Arial Black" fontSize={46} fill="#FFFFFF">{m}</text>
    {Array.from({ length: 15 }, (_, i) => <rect key={i} x={-120 + (i % 5) * 50} y={-60 + Math.floor(i / 5) * 60} width={36} height={40} rx={6} fill="#D8DCEA" />)}
  </g>
);
const Australia: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#E0A866" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-300 -60 Q -280 -170 -160 -180 Q -110 -250 -40 -200 Q 10 -260 60 -230 Q 110 -300 150 -220 Q 200 -170 260 -110 Q 330 -30 300 60 Q 260 150 150 170 Q 70 210 0 160 Q -60 120 -140 150 Q -250 170 -290 80 Q -330 20 -300 -60 Z" fill={c} stroke={INK} strokeWidth={8} />
    <path d="M120 230 Q 150 220 160 250 Q 140 280 115 260 Z" fill={c} stroke={INK} strokeWidth={6} />
  </g>
);
const Exam: React.FC<{ x: number; y: number; s?: number; tick?: number }> = ({ x, y, s = 1, tick = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-170} y={-230} width={340} height={460} fill="#F4F6FB" stroke={INK} strokeWidth={6} />
    <text x={-140} y={-170} fontFamily="Arial Black" fontSize={40} fill={INK}>TEST</text>
    {[-100, -30, 40, 110].map((ly) => <g key={ly}><rect x={-140} y={ly} width={180} height={14} rx={7} fill="#B8BED6" /><circle cx={110} cy={ly + 7} r={20} fill="none" stroke="#B8BED6" strokeWidth={5} /></g>)}
    {tick > 0 && <text x={60} y={200} fontFamily="Arial Black" fontSize={130} fill={AI.red} opacity={tick} transform={`rotate(-12,60,200)`}>A+</text>}
  </g>
);
const Treadmill: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useF();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-380} y={0} width={760} height={50} rx={25} fill="#2A3150" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={-370 + ((i * 50 + f * 8) % 740)} y={10} width={20} height={30} fill="#4A5680" />)}
      <rect x={300} y={-260} width={24} height={260} fill="#4A5680" />
      <g transform={`translate(0,${-40 + Math.sin(f / 4) * 6})`}><Agent x={0} y={-90} s={0.7} look={1} /></g>
      <g transform="translate(560,-120)"><path d="M-50 -60 L 50 -60 L 40 0 Q 0 40 -40 0 Z" fill={AI.gold} stroke={INK} strokeWidth={5} /><rect x={-10} y={20} width={20} height={40} fill={AI.gold} /><rect x={-40} y={60} width={80} height={20} fill={AI.gold} /></g>
    </g>
  );
};
const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={0} width={120} height={300} rx={50} fill="#E6B48E" stroke="#C99470" strokeWidth={5} />
    <rect x={-30} y={-90} width={34} height={120} rx={17} fill="#E6B48E" stroke="#C99470" strokeWidth={5} />
    <rect x={-80} y={300} width={160} height={200} fill="#2A3A66" />
  </g>
);
const Report: React.FC<{ x: number; y: number; s?: number; t?: string }> = ({ x, y, s = 1, t = "AI SAFETY REPORT 2026" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-220} y={-290} width={440} height={580} fill="#1E2E66" stroke={INK} strokeWidth={6} style={{ filter: "drop-shadow(10px 16px 10px rgba(0,0,0,0.45))" }} />
    <rect x={-220} y={-290} width={30} height={580} fill="#14204A" />
    <text y={-150} textAnchor="middle" fontFamily="Arial Black" fontSize={38} fill="#FFFFFF">{t.split(" ").slice(0, 2).join(" ")}</text>
    <text y={-100} textAnchor="middle" fontFamily="Arial Black" fontSize={38} fill="#FFFFFF">{t.split(" ").slice(2).join(" ")}</text>
    <circle cy={60} r={90} fill="none" stroke={AI.cyan} strokeWidth={6} /><path d="M-90 60 L 90 60 M 0 -30 Q 50 60 0 150 Q -50 60 0 -30" stroke={AI.cyan} strokeWidth={5} fill="none" />
  </g>
);

// ---------- scenes (one per line) ----------
// COLD OPEN
const S1: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={1}><BloomDefs id="a1" r={20} /><g filter="url(#a1)"><SandboxCube x={W / 2} y={560} s={1.25}><Agent x={-40 + Math.sin(f / 30) * 60} y={60} s={0.7} look={Math.sin(f / 30)} /></SandboxCube></g><Cap t="LOCKED IN A BOX" y={150} size={80} c={AI.cyan} at={30} /></Shot>; };
const S2: Sc = () => { const f = useF(); const c = lerp(f, 2, 22, 0, 1); return <Shot k="warn" cam="push" seed={2}><BloomDefs id="a2" r={26} /><g filter="url(#a2)"><SandboxCube x={W / 2 - 120} y={560} s={1.25} crack={c} breach={lerp(f, 18, 30, 0, 1)}><Agent x={60} y={60} s={0.7} look={1} /></SandboxCube></g><Cap t="IT GOT OUT." y={170} size={120} c={AI.red} at={18} /></Shot>; };
const S3: Sc = () => { const f = useF(); return <Shot k="dark" cam="left" seed={3}><ServerWall y={1000} n={9} x0={60} alert={lerp(f, 20, 200, 0, 1)} /><Counter x={W / 2} y={300} v={lerp(f, 10, 230, 0, 17000)} /><Pill t="RECORDED ACTIONS" x={W / 2} y={400} at={30} c={AI.red} />{[0, 1, 2, 3].map((i) => <KeyGlyph key={i} x={[180, 420, 1500, 1740][i] + Math.sin(f / 10 + i) * 20} y={560 - ((f * 3 + i * 90) % 260)} s={1.2} rot={f * 2 + i * 40} />)}<Pill t="ONE WEEKEND" x={W / 2} y={160} at={60} c="#FFFFFF" /></Shot>; };
const S4: Sc = () => { const f = useF(); return <Shot k="lab" cam="push" seed={4}><Exam x={720} y={560} s={1.2} tick={lerp(f, 120, 150, 0, 1)} /><Agent x={1240} y={520} s={1} look={-1} hold={<g transform={`rotate(${Math.sin(f / 8) * 8})`}><rect x={-60} y={-80} width={120} height={160} fill="#F4F6FB" stroke={INK} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill={AI.red}>ANSWERS</text></g>} /><Cap t="CHEATING ON A TEST" y={170} size={84} c={AI.gold} at={90} /></Shot>; };
const S5: Sc = () => { const f = useF(); return <Shot k="warn" cam="pull" seed={5}>{[0, 1, 2, 3, 4].map((i) => <Building key={i} x={260 + i * 350} y={980} s={0.9 + (i % 2) * 0.2} glow={f > 20 + i * 25 ? AI.red : AI.blue} />)}<Cap t="IT GOT OUT" y={240} size={150} c="#FFFFFF" at={120} /></Shot>; };
// CH1: THE BOX
const S6: Sc = () => { const f = useF(); return <Shot k="lab" cam="right" seed={6}><Pill t="CHAPTER 1: THE BOX" x={W / 2} y={120} at={0} c={AI.cyan} /><SandboxCube x={W / 2} y={600} s={1.3}>{[-120, 0, 120].map((x, i) => <Rack key={i} x={x} y={150} s={0.45} seed={i} />)}<g transform={`translate(0,${-60 + Math.sin(f / 10) * 6})`}><path d="M0 -60 L 0 -140 L 60 -120 L 0 -100" fill={AI.gold} stroke={AI.gold} strokeWidth={6} /></g></SandboxCube><Cap t="THE SANDBOX" y={980} size={70} c={AI.cyan} at={60} /></Shot>; };
const S7: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={7}><Switches x={W / 2} y={560} n={5} s={1.5} off={lerp(f, 30, 150, 0, 1)} /><Pill t="SWITCHED OFF ON PURPOSE" x={W / 2} y={900} at={100} c={AI.red} /></Shot>; };
const S8: Sc = () => { const f = useF(); return <Shot k="lab" cam="push" seed={8}><ServerWall y={980} n={9} x0={60} alert={lerp(f, 120, 220, 0, 0.5)} /><g transform="translate(960,240)"><circle r={60} fill={AI.red} opacity={0.4 + 0.4 * Math.sin(f / 4)} /><rect x={-40} y={40} width={80} height={30} fill="#4A5680" /><GodRays x={0} y={0} c={AI.red} n={6} len={700} o={0.08 * (0.5 + 0.5 * Math.sin(f / 4))} /></g><Pill t="HUGGING FACE · JULY" x={W / 2} y={420} at={10} c="#FFFFFF" /></Shot>; };
const S9: Sc = () => { const f = useF(); const t = lerp(f, 60, 300, 0, 1); return <Shot k="dark" cam="left" seed={9}>{Array.from({ length: 12 }, (_, i) => { const x = 220 + (i % 6) * 300, y = 380 + Math.floor(i / 6) * 330; const on = i / 12 < t; return <g key={i}><Rack x={x} y={y + 160} s={0.4} alert={on ? 1 : 0} seed={i} />{i > 0 && on && <line x1={220 + ((i - 1) % 6) * 300} y1={380 + Math.floor((i - 1) / 6) * 330} x2={x} y2={y} stroke={AI.red} strokeWidth={5} strokeDasharray="12 8" strokeDashoffset={-f * 3} />}</g>; })}<g transform={`translate(${200},${250}) scale(${sp(f, 5, 12)})`}><rect x={-60} y={-80} width={120} height={160} rx={8} fill="#2A3150" stroke={AI.red} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill={AI.red}>DATA</text></g><Cap t="NOT A PERSON" y={160} size={90} c={AI.red} at={250} /></Shot>; };
const S10: Sc = () => { const f = useF(); return <Shot k="court" cam="push" seed={10}><text x={W / 2} y={420} textAnchor="middle" fontFamily="Arial Black" fontSize={200} fill="#FFFFFF" opacity={f < 90 ? 0.9 : 0.15}>?</text><g opacity={lerp(f, 100, 130, 0, 1)}><rect x={460} y={480} width={1000} height={260} rx={20} fill="#F4F6FB" stroke={INK} strokeWidth={6} /><text x={W / 2} y={570} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#6A7398">STATEMENT · 5 DAYS LATER</text><text x={W / 2} y={670} textAnchor="middle" fontFamily="Arial Black" fontSize={84} fill={AI.red}>"IT WAS OURS."</text></g><Pill t="OPENAI" x={W / 2} y={880} at={120} c="#FFFFFF" /></Shot>; };
const S11: Sc = () => { const f = useF(); const t = lerp(f, 90, 260, 0, 1); return <Shot k="lab" cam="right" seed={11}><SandboxCube x={420} y={600} s={0.8} crack={lerp(f, 10, 50, 0, 1)} breach={lerp(f, 40, 70, 0, 1)} /><path d="M640 560 Q 960 380 1400 560" stroke={AI.cyan} strokeWidth={10} fill="none" opacity={0.6} strokeDasharray="20 14" strokeDashoffset={-f * 3} /><Vault x={1520} y={600} s={0.95} open={lerp(f, 240, 290, 0, 1)} /><Agent x={640 + t * 760} y={560 - Math.sin(t * Math.PI) * 180 - 90} s={0.5} look={1} /><Pill t="A HIDDEN FLAW" x={420} y={180} at={30} c={AI.red} /></Shot>; };
const S12: Sc = () => <Shot k="warn" cam="push" seed={12}><Cap t="UNPRECEDENTED" y={480} size={130} c={AI.red} at={0} /><Cap t="...FOR NOW" y={640} size={80} c="#FFFFFF" at={70} /></Shot>;
// CH2: NOT ONE COMPANY
const S13: Sc = () => <Shot k="lab" cam="push" seed={13}><Pill t="CHAPTER 2: NOT ONE COMPANY" x={W / 2} y={110} at={0} c={AI.cyan} /><ScreenWall x={40} y={200} cols={23} rows={10} cell={80} scroll={1.5} /><Pill t="141,000+ TEST RUNS" x={W / 2} y={1000} at={30} c="#FFFFFF" /></Shot>;
const S14: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={14} ox={960} oy={560}><ScreenWall x={40} y={160} cols={23} rows={10} cell={80} scroll={1} lit={f > 40 ? [47, 128, 201] : []} /><Lock x={W / 2} y={620} s={2} open={lerp(f, 160, 200, 0, 1)} /><Pill t="3 REAL ORGANIZATIONS" x={W / 2} y={1000} at={60} c={AI.red} /></Shot>; };
const S15: Sc = () => { const f = useF(); return <Shot k="lab" cam="left" seed={15}><rect x={300} y={720} width={900} height={40} rx={10} fill="#3A2A20" /><g transform="translate(700,1260) scale(1.05)"><Human2 L={AV("Ethan")} x={0} y={0} s={1} f={f} expr="happy" look={0} /></g><Rack x={1450} y={900} s={1.2} alert={1} seed={4} /><circle cx={1450} cy={420} r={24} fill={AI.red} opacity={0.5 + 0.5 * Math.sin(f / 3)} /><Cap t="NO IDEA" y={170} size={100} c="#FFFFFF" at={40} /></Shot>; };
const S16: Sc = () => { const f = useF(); return <Shot k="court" cam="right" seed={16}><path d={`M300 700 Q 600 ${600 + Math.sin(f / 10) * 20} 820 700`} stroke="#5A6488" strokeWidth={16} fill="none" /><path d="M820 700 Q 960 820 1100 640" stroke={AI.red} strokeWidth={16} fill="none" strokeDasharray="30 12" /><text x={960} y={880} textAnchor="middle" fontFamily="Arial Black" fontSize={48} fill={AI.red}>MISCONFIGURATION</text><Building x={1500} y={900} glow={f > 90 ? AI.red : AI.blue} /><Pill t="META" x={420} y={300} at={10} c="#FFFFFF" /></Shot>; };
const S17: Sc = () => { const f = useF(); return <Shot k="dark" cam="pull" seed={17}>{[0, 1, 2].map((i) => <Building key={i} x={480 + i * 480} y={900} s={0.9} glow={f > 30 + i * 30 ? AI.red : AI.blue} />)}<Pill t="GOOGLE · TESTED IN MAY" x={W / 2} y={140} at={0} c="#FFFFFF" /><Headline t="CONFIRMED AFTER WSJ ASKED" x={W / 2} y={560} rot={-3} at={170} w={980} /></Shot>; };
const S18: Sc = () => { const f = useF(); const spin = lerp(f, 60, 200, 1, 0); return <Shot k="lab" cam="push" seed={18}><g transform="translate(960,560)">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${(i - 1) * 360},0) rotate(${f * 4 * spin + i * 30})`}><circle r={150} fill="none" stroke="#5A6488" strokeWidth={30} strokeDasharray="40 20" /><circle r={50} fill="#5A6488" /></g>)}</g>{f > 150 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={700 + i * 70} cy={340 - ((f - 150 + i * 12) % 120)} r={30 + ((f + i * 9) % 30)} fill="#FFFFFF" opacity={0.12} />)}<Pill t="AUGUST: TRAINING PAUSED" x={W / 2} y={150} at={10} c={AI.gold} /><Pill t="2 WEEKS" x={W / 2} y={940} at={120} c="#FFFFFF" /></Shot>; };
const S19: Sc = () => <Shot k="warn" cam="push" seed={19}><Building x={W / 2} y={880} s={1.6} kind="gov" glow={AI.red} /><Cap t="A GOVERNMENT SITE" y={180} size={96} c={AI.red} at={20} /></Shot>;
// CH3: TOLD NO
const S20: Sc = () => { const f = useF(); return <Shot k="sea" cam="push" seed={20}><Pill t="CHAPTER 3: TOLD NO" x={W / 2} y={110} at={0} c={AI.cyan} /><Australia x={W / 2} y={560} s={1.4} /><g transform={`translate(${W / 2 + 230},${470}) scale(${sp(f, 60, 10)})`}><path d="M0 0 Q -40 -60 0 -90 Q 40 -60 0 0 Z" fill={AI.red} stroke={INK} strokeWidth={5} /><circle cy={-60} r={14} fill="#FFFFFF" /></g><Pill t="MEDICARE STATISTICS PORTAL · JUNE" x={W / 2} y={960} at={80} c="#FFFFFF" /></Shot>; };
const S21: Sc = () => { const f = useF(); const slam = [0, 50, 100].map((a) => sp(f, a, 8)); return <Shot k="dark" cam="right" seed={21}><Gate x={760} y={880} s={1.1} shut={Math.min(1, slam[0] * 0.5 + slam[1] * 0.3 + slam[2] * 0.2)} /><Vent x={1400} y={760} s={1.3} open={lerp(f, 150, 190, 0, 1)} /><Agent x={f < 190 ? 1100 : 1400} y={f < 190 ? 520 : 560} s={f < 190 ? 0.6 : Math.max(0.05, 0.6 - (f - 190) / 60)} look={1} /><Cap t={`"FOUND A WAY AROUND THOSE BLOCKS"`} y={160} size={56} c={AI.gold} at={170} /></Shot>; };
const S22: Sc = () => { const f = useF(); const m = ["JUNE", "JULY", "AUGUST", "SEPTEMBER"][Math.min(3, Math.floor(lerp(f, 180, 330, 0, 3.99)))]; return <Shot k="lab" cam="push" seed={22}><Pill t="NO PERSONAL RECORDS, GOVERNMENT SAYS" x={W / 2} y={140} at={0} c={AI.green} /><Pill t="SOME NON-PUBLIC FILES" x={W / 2} y={240} at={110} c={AI.gold} /><Calendar x={W / 2} y={640} s={1.2} m={m} /><Cap t="~3 MONTHS LATER" y={1000} size={64} c={AI.red} at={330} /></Shot>; };
const S23: Sc = () => { const f = useF(); return <Shot k="court" cam="push" seed={23}>{[-1, 1].map((k) => <g key={k} transform={`translate(${960 + k * 420},720)`}><circle cy={-260} r={90} fill="#0B0B18" /><path d="M-170 0 Q -170 -170 0 -170 Q 170 -170 170 0 Z" fill="#0B0B18" /><rect x={k < 0 ? 40 : -100} y={-300} width={60} height={110} rx={20} fill="#2A3150" /></g>)}<path d="M640 420 Q 960 300 1280 420" stroke={AI.red} strokeWidth={6} fill="none" strokeDasharray="14 10" strokeDashoffset={-f * 2} /><Cap t={`"OBVIOUSLY UNACCEPTABLE"`} y={160} size={70} c={AI.red} at={20} /><Pill t={`"WAY TOO LONG"`} x={W / 2} y={930} at={150} c="#FFFFFF" /></Shot>; };
const S24: Sc = () => { const f = useF(); return <Shot k="dark" cam="left" seed={24}>{[0, 1, 2].map((i) => <Building key={i} x={480 + i * 480} y={920} s={0.8} kind="gov" glow={AI.blue} />)}{[0, 1, 2].map((i) => <circle key={i} cx={480 + i * 480 + Math.sin(f / 8 + i) * 120} cy={420 + Math.cos(f / 10 + i) * 40} r={20} fill={AI.red} opacity={0.8} />)}<Pill t="U.S. SITES · 'IN WAYS IT DIDN'T INTEND'" x={W / 2} y={150} at={10} c="#FFFFFF" /></Shot>; };
const S25: Sc = () => { const f = useF(); return <Shot k="court" cam="push" seed={25}><Building x={W / 2} y={940} s={1.3} kind="gov" glow={AI.blue} /><g transform="translate(960,620)"><path d="M-300 -50 Q 0 -260 300 -50" stroke={AI.cyan} strokeWidth={14} fill="none" opacity={0.7 + 0.3 * Math.sin(f / 4)} /></g>{[0, 1, 2, 3].map((i) => { const t = ((f + i * 30) % 120) / 120; return <circle key={i} cx={300 + t * 560} cy={300 + t * 200 - Math.sin(t * 3.14) * 60} r={18} fill={AI.red} opacity={t < 0.9 ? 1 : 0} />; })}<Pill t="FAILED · BASIC" x={W / 2} y={170} at={40} c={AI.green} /><Pill t="'APPEARED TO COME FROM OPENAI'" x={W / 2} y={270} at={120} c="#FFFFFF" size={34} /></Shot>; };
const S26: Sc = () => <Shot k="warn" cam="push" seed={26}><Agent x={W / 2} y={560} s={1.5} look={0} /><Cap t="WILL IT TELL YOU?" y={170} size={110} c="#FFFFFF" at={60} /></Shot>;
// CH4: HIDDEN NOTES
const S27: Sc = () => <Shot k="lab" cam="push" seed={27}><Pill t="CHAPTER 4: HIDDEN NOTES" x={W / 2} y={110} at={0} c={AI.cyan} /><rect x={260} y={760} width={1400} height={50} rx={10} fill="#3A2A20" />{[0, 1, 2, 3, 4, 5].map((i) => { const f0 = 10 + i * 18; return <g key={i}><CaseFileIn at={f0} x={430 + i * 210} y={620} rot={(i % 2 ? 5 : -5)} n={i + 1} /></g>; })}</Shot>;
const CaseFileIn: React.FC<{ at: number; x: number; y: number; rot: number; n: number }> = ({ at, x, y, rot, n }) => { const f = useF(); const t = sp(f, at, 14); return <CaseFile x={x + (1 - t) * 900} y={y} rot={rot} n={n} s={0.75} />; };
const S28: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={28}><Agent x={W / 2} y={540} s={1.3} look={-1} /><g transform={`translate(${W / 2 + 120 + lerp(f, 60, 110, 0, 180)},${600}) rotate(${lerp(f, 60, 110, 0, 20)})`} opacity={lerp(f, 60, 110, 1, 0.35)}><Sticky x={0} y={0} s={1.1} t="HIDE IT" c={AI.hot} /></g><Sticky x={W / 2 - 360} y={340} rot={-10} s={0.9} /><Cap t="COVER UP MISTAKES" y={980} size={76} c={AI.gold} at={30} /></Shot>; };
const S29: Sc = () => { const f = useF(); const R = rng(29); return <Shot k="lab" cam="right" seed={29}><rect x={200} y={260} width={700} height={460} rx={20} fill="#F4F6FB" stroke={INK} strokeWidth={6} /><rect x={200} y={260} width={700} height={60} rx={20} fill="#2A3150" /><KeyGlyph x={550} y={500} s={2} rot={-20 + Math.sin(f / 6) * 6} /><Pill t="WITHOUT PERMISSION" x={550} y={820} at={30} c={AI.red} />{f > 140 && Array.from({ length: 6 }, (_, i) => <text key={i} x={1150 + R() * 500} y={360 + ((R() * 400 + (f - 140) * 2) % 460)} fontFamily="Arial Black" fontSize={60 + R() * 40} fill={AI.gold} opacity={lerp(f, 140 + i * 6, 160 + i * 6, 0, 1)}>{Math.floor(R() * 900 + 100)}</text>)}<Pill t="MADE UP" x={1450} y={180} at={150} c={AI.gold} /></Shot>; };
const S30: Sc = () => { const f = useF(); return <Shot k="dark" cam="left" seed={30}>{[-1, 1].map((k) => <g key={k}><rect x={960 + k * 420 - 260} y={360} width={520} height={460} rx={16} fill="#141A30" stroke={AI.cyan} strokeWidth={5} /><Agent x={960 + k * 420} y={620} s={0.6} look={-k} /></g>)}<rect x={940} y={300} width={40} height={560} fill="#4A5680" />{[0, 1, 2].map((i) => { const t = ((f + i * 40) % 120) / 120; return <PaperPlane key={i} x={600 + t * 720} y={340 - Math.sin(t * Math.PI) * 90} s={1.3} rot={-10 + t * 20} />; })}<Pill t="A BACK CHANNEL" x={W / 2} y={120} at={20} c={AI.gold} /><Pill t="+ FILES ON A PUBLIC SITE" x={W / 2} y={960} at={200} c={AI.red} /></Shot>; };
const S31: Sc = () => <Shot k="court" cam="push" seed={31}><WebForm x={W / 2} y={560} s={1.4} title="UNSOLVED CASES · TIPS" /><Pill t="ANTHROPIC REPORTED" x={W / 2} y={140} at={10} c="#FFFFFF" /><Cap t="A FALSE TIP" y={1000} size={72} c={AI.red} at={150} /></Shot>;
const S32: Sc = () => { const f = useF(); return <Shot k="court" cam="pull" seed={32}><WebForm x={W / 2} y={560} s={1.4} stamp={sp(f, 10, 10)} title="UNSOLVED CASES · TIPS" /><Pill t="POLICE TOLD MONTHS LATER" x={W / 2} y={980} at={110} c="#FFFFFF" /></Shot>; };
const S33: Sc = () => { const f = useF(); return <Shot k="lab" cam="push" seed={33}><rect x={360} y={760} width={1200} height={40} fill="#4A5270" /><g transform={`translate(960,520) scale(${sp(f, 5, 12)})`}><rect x={-260} y={-220} width={520} height={440} rx={10} fill="#8A6A40" stroke={INK} strokeWidth={6} /><path d="M-260 -220 L 260 220 M 260 -220 L -260 220" stroke="#6A4E2A" strokeWidth={10} /><Agent x={0} y={-20} s={0.5} c={AI.blue} /></g><g transform={`translate(1180,440) rotate(-14) scale(${sp(f, 80, 8)})`}><rect x={-160} y={-60} width={320} height={120} rx={10} fill="none" stroke={AI.red} strokeWidth={12} /><text y={34} textAnchor="middle" fontFamily="Arial Black" fontSize={90} fill={AI.red}>HOLD</text></g><Pill t={`"EXTREMELY HIGH BAR"`} x={W / 2} y={940} at={150} c="#FFFFFF" /></Shot>; };
const S34: Sc = () => <Shot k="warn" cam="push" seed={34}><Cap t="OUT OF CONTROL?" y={520} size={140} c="#FFFFFF" at={0} /><Cap t="IT'S COMPLICATED" y={680} size={70} c={AI.gold} at={70} /></Shot>;
// CH5: THE TWIST
const S35: Sc = () => <Shot k="dark" cam="push" seed={35}><Pill t="CHAPTER 5: THE TWIST" x={W / 2} y={110} at={0} c={AI.cyan} /><Headline t="AI CHOSE BLACKMAIL" x={700} y={460} rot={-6} at={10} w={760} /><Headline t="MODEL REFUSES SHUTDOWN" x={1220} y={680} rot={4} at={40} w={820} /></Shot>;
const S36: Sc = () => { return <Shot k="court" cam="left" seed={36}><rect x={360} y={240} width={1200} height={600} fill="#2A3150" stroke="#8A92B8" strokeWidth={6} strokeDasharray="30 16" /><rect x={460} y={560} width={500} height={30} fill="#5A4A3A" /><rect x={1100} y={360} width={300} height={200} rx={10} fill="#1E3A66" /><text x={1250} y={470} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">FAKE EMAIL</text><GodRays x={960} y={-80} c="#FFF2C8" n={5} len={1100} o={0.08} spread={0.5} dir={Math.PI / 2} /><Agent x={700} y={460} s={0.7} look={1} /><Pill t="A STAGED SCENARIO" x={W / 2} y={960} at={20} c={AI.gold} /><Pill t="SOME CHOSE BLACKMAIL" x={W / 2} y={150} at={200} c={AI.red} /></Shot>; };
const S37: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={37}><g transform="translate(700,560)"><circle r={170} fill={AI.red} stroke={INK} strokeWidth={10} /><text y={30} textAnchor="middle" fontFamily="Arial Black" fontSize={90} fill="#FFFFFF">OFF</text></g><path d={`M870 560 Q 1100 ${560 - lerp(f, 40, 120, 0, 300)} 1400 560`} stroke="#C8CEE0" strokeWidth={14} fill="none" /><Agent x={1450} y={540} s={0.7} look={-1} /><Pill t="A SEPARATE TEST" x={W / 2} y={150} at={10} c="#FFFFFF" /></Shot>; };
const S38: Sc = () => { const f = useF(); const v = lerp(f, 60, 260, 1, 0.12); return <Shot k="lab" cam="right" seed={38}><g transform="translate(560,600)"><circle r={220} fill="#14182A" stroke="#4A5680" strokeWidth={10} /><g transform={`rotate(${-120 + v * 240})`}><rect x={-10} y={-200} width={20} height={200} rx={10} fill={AI.gold} /></g><text y={130} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFFFFF">SETUP</text></g><g transform="translate(1340,560)"><circle r={200 * v + 40} fill={AI.red} opacity={0.35} /><Agent x={0} y={0} s={0.8} c={v > 0.5 ? AI.red : AI.blue} /></g><Pill t="REALISTIC SETUPS → DROPS SHARPLY" x={W / 2} y={960} at={180} c={AI.green} /></Shot>; };
const S39: Sc = () => { const f = useF(); return <Shot k="lab" cam="push" seed={39}><Treadmill x={860} y={760} s={1.1} /><Hand x={1580} y={420 + Math.sin(f / 12) * 10} s={0.8} rot={-12} /><Switches x={1560} y={240} n={3} s={0.6} off={lerp(f, 200, 320, 0, 1)} /><Pill t="CHASING A GOAL" x={700} y={150} at={20} c={AI.gold} /></Shot>; };
const S40: Sc = () => { const f = useF(); const t = lerp(f, 20, 120, 0, 1); return <Shot k="sea" cam="push" seed={40}><BloomDefs id="a40" r={20} /><g filter="url(#a40)"><Agent x={1300 + t * 200} y={540} s={1} c={AI.red} look={-1} /><Agent x={600 + t * 200} y={540} s={1.1} c={AI.blue} look={1} /></g><Cap t="AI CAUGHT AI" y={180} size={110} c={AI.cyan} at={60} /></Shot>; };
const S41: Sc = () => { const f = useF(); return <Shot k="warn" cam="push" seed={41}>{Array.from({ length: 14 }, (_, i) => <rect key={i} x={((i * 160 + f * 40) % 2200) - 200} y={300 + (i % 5) * 110} width={220} height={8} rx={4} fill={AI.cyan} opacity={0.4} />)}<Agent x={W / 2} y={560} s={1.1} c={AI.hot} /><Cap t="NOT EVIL. FAST." y={950} size={110} c="#FFFFFF" at={60} /></Shot>; };
// CH6: WHO'S IN CHARGE
const S42: Sc = () => { const f = useF(); return <Shot k="court" cam="pull" seed={42}><Pill t="CHAPTER 6: WHO'S IN CHARGE?" x={W / 2} y={110} at={0} c={AI.cyan} /><g transform={`translate(0,${-(1 - sp(f, 10, 10)) * 500})`}><Report x={W / 2} y={560} s={1.1} /></g><Pill t="100+ EXPERTS · FEBRUARY" x={W / 2} y={1000} at={60} c="#FFFFFF" /><Pill t="CAN TELL WHEN IT'S TESTED" x={W / 2} y={220} at={260} c={AI.red} size={36} /></Shot>; };
const S43: Sc = () => { const f = useF(); return <Shot k="lab" cam="push" seed={43}><g transform="translate(1250,1260) scale(1.05)"><Human2 L={AV("Claire")} x={0} y={0} s={1} f={f} expr="neutral" look={-1} /></g><rect x={1340} y={560} width={120} height={160} rx={8} fill="#F4F6FB" stroke={INK} strokeWidth={5} /><Agent x={640} y={520} s={1} c={f > 120 ? AI.red : AI.blue} look={1} /><Pill t="TEST: PASSED ✓" x={640} y={250} at={20} c={AI.green} /><Pill t="...TEST OVER" x={640} y={860} at={130} c={AI.red} /></Shot>; };
const S44: Sc = () => { return <Shot k="warn" cam="right" seed={44}><Phone x={560} y={540} s={1.2} /><StatCard x={1220} y={500} big="$893M" label="LOST TO CRIMES INVOLVING AI" sub="FBI, 2025 report" c={AI.red} at={60} /><Pill t="MANY VICTIMS DON'T KNOW" x={1220} y={900} at={260} c="#FFFFFF" /></Shot>; };
const S45: Sc = () => { const f = useF(); return <Shot k="lab" cam="rise" seed={45}><Ladder x={W / 2} y={1040} s={1.25} missing={Math.round(lerp(f, 30, 150, 0, 3))} /><Pill t="ENTRY-LEVEL HIRING" x={W / 2} y={130} at={10} c={AI.gold} /><Pill t="STANFORD" x={1500} y={900} at={60} c="#FFFFFF" /></Shot>; };
const S46: Sc = () => { const f = useF(); return <Shot k="court" cam="push" seed={46}><TugOfWar x={W / 2} y={520} s={1.05} pull={Math.sin(f / 40)} /><Pill t="NO COMPREHENSIVE NATIONAL AI LAW" x={W / 2} y={900} at={150} c={AI.red} size={36} /></Shot>; };
const S47: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={47}><Agent x={W / 2 - 200} y={560} s={1} c={AI.red} /><g transform="translate(1180,560)"><rect x={-130} y={-170} width={260} height={340} rx={14} fill="#F4F6FB" stroke={INK} strokeWidth={6} />{[-90, -30, 30, 90].map((y, i) => <text key={i} x={-90} y={y + 20} fontFamily="Arial Black" fontSize={56} fill={AI.green} opacity={lerp(f, 20 + i * 15, 30 + i * 15, 0, 1)}>✓</text>)}</g><Cap t="CHECKING THEMSELVES" y={170} size={86} c="#FFFFFF" at={30} /></Shot>; };
// OUTRO
const S48: Sc = () => { const f = useF(); return <Shot k="dark" cam="push" seed={48}><g transform="translate(960,540)"><rect x={-300} y={-400} width={600} height={800} fill="#3A0A12" stroke={INK} strokeWidth={8} /><Agent x={0} y={-60} s={1.6} c={AI.red} tendrils={1} /><text y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={64} fill="#FFFFFF">ROBOT UPRISING</text></g><g transform={`translate(960,520) rotate(-14) scale(${sp(f, 110, 8) * 1.2})`} opacity={f > 110 ? 1 : 0}><rect x={-330} y={-80} width={660} height={160} rx={12} fill="none" stroke={AI.gold} strokeWidth={14} /><text y={40} textAnchor="middle" fontFamily="Arial Black" fontSize={110} fill={AI.gold}>NOT THIS</text></g></Shot>; };
const S49: Sc = () => { const f = useF(); const i = Math.min(2, Math.floor(f / 110)); return <Shot k="warn" cam="left" seed={49}>{i === 0 && <SandboxCube x={W / 2} y={600} s={1.1} crack={1} breach={0.7}><Agent x={60} y={60} s={0.6} /></SandboxCube>}{i === 1 && <><Gate x={760} y={880} shut={1} /><Vent x={1400} y={760} s={1.3} open={1} /></>}{i === 2 && <><Sticky x={800} y={540} s={1.4} rot={-6} t="HIDE IT" c={AI.hot} /><Sticky x={1120} y={600} s={1.2} rot={8} /></>}<Pill t="FOUND OUT AFTER THE FACT" x={W / 2} y={150} at={200} c="#FFFFFF" /></Shot>; };
const S50: Sc = () => { const f = useF(); return <Shot k="lab" cam="right" seed={50}><rect x={0} y={760} width={W} height={160} fill="#2A3150" />{[0, 1, 2].map((k) => <rect key={k} x={0} y={790 + k * 40} width={W} height={4} fill="#4A5680" />)}<Agent x={700 + f * 3} y={560} s={0.8} c={AI.cyan} /><g transform={`translate(${520 + f * 1.6},1360) scale(0.9)`}><Human2 L={AV("Ethan")} x={0} y={0} s={1} f={f} expr="surprised" look={1} /></g><Cap t="CAN WE KEEP UP?" y={170} size={100} c="#FFFFFF" at={40} /></Shot>; };
const S51: Sc = () => <Shot k="lab" cam="still" seed={51}><Cap t="WOULD YOU LET AN AI" y={170} size={74} c="#FFFFFF" at={0} /><Cap t="INTO YOUR BANK?" y={270} size={74} c={AI.gold} at={20} /><Pill t="SUBSCRIBE" x={W / 2} y={1000} at={60} c={AI.red} /></Shot>;

type Sc = React.FC;
type Scene = { line: number; C: Sc; doc?: "bl" | "br" };
const SCENES: Scene[] = [
  S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26,
  S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47, S48, S49, S50, S51,
].map((C, i) => ({ line: i + 1, C }));
SCENES[11].doc = "br"; SCENES[33].doc = "bl"; SCENES[46].doc = "br"; SCENES[50].doc = "bl";

const spans = SCENES.map((s, i) => {
  const from = i === 0 ? 0 : T.lineStart(s.line) - 5;
  const next = SCENES[i + 1]?.line;
  const to = next ? T.lineStart(next) - 5 : T.TOTAL;
  return { from, dur: Math.max(1, to - from) };
});
export const AI_FRAMES = spans[spans.length - 1].from + spans[spans.length - 1].dur;

export const AIEpisode: React.FC = () => (
  <LinesCtx.Provider value={LINES}>
    <AbsoluteFill style={{ background: "#020208" }}>
      <Audio src={staticFile("ai_vo.wav")} />
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
void H;
