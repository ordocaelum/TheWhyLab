// "AI Got Out" episode kit: the rogue agent, sandbox cube, server racks, gates and vents, sticky notes, screens wall,
// lab/government buildings, safety switches, answer vault, ladder, rulebook tug-of-war. Pair with cinema.tsx.
import React from "react";
import { useCurrentFrame } from "remotion";
import { INK, sp } from "./kit";
import { rng, shade } from "./gen";

export const AI = { red: "#FF3B4E", hot: "#FF7A45", blue: "#3FD1FF", cyan: "#7CF6FF", steel: "#2A3350", steelHi: "#4A5680", gold: "#FFD23F", green: "#5CFF9A" };

// the rogue AI agent: a floating eye-core with orbit rings and data tendrils. mood shifts the colour
export const Agent: React.FC<{ x: number; y: number; s?: number; c?: string; look?: number; tendrils?: number; hold?: React.ReactNode }> = ({ x, y, s = 1, c = AI.red, look = 0, tendrils = 0, hold }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 14) * 8;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={150 - bob} rx={70} ry={12} fill="#000" opacity={0.3} />
      {tendrils > 0 && Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI + Math.PI * 0.1, L = 90 + 50 * tendrils;
        const ex = Math.cos(a) * L, ey = 40 + Math.sin(a) * L * 0.8;
        return <path key={i} d={`M0 40 Q ${ex * 0.5 + Math.sin(f / 9 + i) * 20} ${ey * 0.4} ${ex} ${ey}`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.75} strokeDasharray="14 10" strokeDashoffset={-f * 2} />;
      })}
      <circle r={120} fill={c} opacity={0.12} />
      <g transform={`rotate(${f * 1.2})`}><ellipse rx={108} ry={34} fill="none" stroke={c} strokeWidth={4} opacity={0.6} /></g>
      <g transform={`rotate(${-f * 0.9 + 60})`}><ellipse rx={96} ry={26} fill="none" stroke={c} strokeWidth={3} opacity={0.4} /></g>
      <circle r={66} fill="#0B0E1E" stroke={shade(c, 0.6)} strokeWidth={6} />
      <circle r={52} fill={`url(#agentGrad)`} />
      <defs><radialGradient id="agentGrad"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor={c} /><stop offset="1" stopColor={shade(c, 0.35)} /></radialGradient></defs>
      <circle cx={look * 16} r={18} fill="#0B0E1E" />
      <circle cx={look * 16 - 6} cy={-6} r={6} fill="#FFFFFF" opacity={0.9} />
      <rect x={-4} y={-104} width={8} height={36} rx={4} fill={shade(c, 0.6)} />
      <circle cy={-108} r={10} fill={c} opacity={0.6 + 0.4 * Math.sin(f / 5)} />
      {hold && <g transform="translate(110,30)">{hold}</g>}
    </g>
  );
};

// the sandbox: an isometric glass cube. crack 0..1 opens a fissure; breach 0..1 spills light
export const SandboxCube: React.FC<{ x: number; y: number; s?: number; crack?: number; breach?: number; children?: React.ReactNode }> = ({ x, y, s = 1, crack = 0, breach = 0, children }) => {
  const f = useCurrentFrame();
  const top = "M0 -300 L 260 -170 L 0 -40 L -260 -170 Z", left = "M-260 -170 L 0 -40 L 0 260 L -260 130 Z", right = "M260 -170 L 0 -40 L 0 260 L 260 130 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={280} rx={320} ry={50} fill={AI.blue} opacity={0.12 + 0.08 * Math.sin(f / 20)} />
      <path d={left} fill={AI.blue} opacity={0.1} /><path d={right} fill={AI.blue} opacity={0.16} />
      {children}
      <path d={top} fill={AI.cyan} opacity={0.14} />
      {[top, left, right].map((d, i) => <path key={i} d={d} fill="none" stroke={AI.cyan} strokeWidth={5} strokeLinejoin="round" opacity={0.85} />)}
      {/* grid lines on faces */}
      {[0.25, 0.5, 0.75].map((t) => <g key={t} opacity={0.25}><line x1={-260 + 260 * t} y1={-170 + 130 * t} x2={-260 + 260 * t} y2={130 + 130 * t} stroke={AI.cyan} strokeWidth={2} /><line x1={260 * t} y1={-40 - 130 * t} x2={260 * t} y2={260 - 130 * t} stroke={AI.cyan} strokeWidth={2} /></g>)}
      {crack > 0 && (
        <g>
          <path d="M150 -120 L 120 -40 L 170 10 L 110 90 L 150 160" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - crack)} style={{ filter: `drop-shadow(0 0 12px ${AI.red})` }} />
          <path d="M120 -40 L 70 -60 M 170 10 L 220 0 M 110 90 L 60 110" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={crack > 0.6 ? (crack - 0.6) / 0.4 : 0} />
        </g>
      )}
      {breach > 0 && <path d="M150 -120 L 120 -40 L 170 10 L 110 90 L 150 160 L 700 300 L 700 -300 Z" fill={AI.red} opacity={0.25 * breach} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

// server rack: blinking LEDs; alert turns them red
export const Rack: React.FC<{ x: number; y: number; s?: number; alert?: number; seed?: number }> = ({ x, y, s = 1, alert = 0, seed = 1 }) => {
  const f = useCurrentFrame();
  const R = rng(seed);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-80} y={-420} width={160} height={420} rx={10} fill={AI.steel} stroke="#0A0E1E" strokeWidth={6} />
      <rect x={-70} y={-410} width={14} height={400} fill={AI.steelHi} opacity={0.5} />
      {Array.from({ length: 12 }, (_, i) => {
        const ph = R() * 10, on = Math.sin(f / (3 + R() * 6) + ph) > 0;
        const c = alert > R() ? AI.red : i % 3 ? AI.green : AI.blue;
        return (
          <g key={i} transform={`translate(0,${-395 + i * 32})`}>
            <rect x={-56} y={0} width={120} height={24} rx={4} fill="#151B30" />
            <circle cx={44} cy={12} r={5} fill={c} opacity={on ? 1 : 0.25} />
            <circle cx={28} cy={12} r={5} fill={c} opacity={on ? 0.25 : 1} />
            <rect x={-46} y={9} width={50} height={6} rx={3} fill="#2E3A60" />
          </g>
        );
      })}
    </g>
  );
};
export const ServerWall: React.FC<{ y: number; n?: number; x0?: number; gap?: number; s?: number; alert?: number }> = ({ y, n = 8, x0 = 120, gap = 220, s = 1, alert = 0 }) => (
  <g>{Array.from({ length: n }, (_, i) => <Rack key={i} x={x0 + i * gap} y={y} s={s} alert={alert} seed={i + 3} />)}</g>
);

// glowing counter text (e.g. 17,000)
export const Counter: React.FC<{ x: number; y: number; v: number; size?: number; c?: string; suffix?: string }> = ({ x, y, v, size = 140, c = AI.red, suffix = "" }) => (
  <g transform={`translate(${x},${y})`}>
    <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={INK} dy={10}>{Math.round(v).toLocaleString("en-US")}{suffix}</text>
    <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={c} style={{ filter: `drop-shadow(0 0 22px ${c})` }}>{Math.round(v).toLocaleString("en-US")}{suffix}</text>
  </g>
);

// a key glyph (passwords / credentials)
export const KeyGlyph: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = AI.gold, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={-30} r={24} fill="none" stroke={c} strokeWidth={12} />
    <path d="M-6 0 L 50 0 M 34 0 L 34 18 M 48 0 L 48 14" stroke={c} strokeWidth={12} strokeLinecap="round" />
  </g>
);

// padlock; open 0..1 swings the shackle
export const Lock: React.FC<{ x: number; y: number; s?: number; open?: number; c?: string }> = ({ x, y, s = 1, open = 0, c = AI.gold }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g transform={`translate(30,-40) rotate(${-open * 40}) translate(-30,40)`}><path d={`M-30 -40 L -30 ${-80 - open * 20} Q -30 -120 0 -120 Q 30 -120 30 -80 L 30 -40`} fill="none" stroke="#C8CEE0" strokeWidth={14} /></g>
    <rect x={-48} y={-46} width={96} height={86} rx={14} fill={c} stroke={shade(c, 0.5)} strokeWidth={5} />
    <circle cy={-6} r={10} fill={INK} /><rect x={-4} y={-6} width={8} height={24} fill={INK} />
  </g>
);

// big wall of tiny screens (141,000 runs); lit = indices glowing red
export const ScreenWall: React.FC<{ cols?: number; rows?: number; x?: number; y?: number; cell?: number; lit?: number[]; scroll?: number }> = ({ cols = 24, rows = 12, x = 0, y = 0, cell = 80, lit = [], scroll = 0 }) => {
  const f = useCurrentFrame();
  const R = rng(9);
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = (i % cols) * cell, cy = Math.floor(i / cols) * cell, hot = lit.includes(i);
        const ph = R() * 20;
        return (
          <g key={i} transform={`translate(${cx},${cy})`}>
            <rect width={cell - 8} height={(cell - 8) * 0.7} rx={4} fill={hot ? "#3A0610" : "#0A1830"} stroke={hot ? AI.red : "#1E3A66"} strokeWidth={hot ? 4 : 2} style={hot ? { filter: `drop-shadow(0 0 10px ${AI.red})` } : undefined} />
            {[0, 1, 2].map((l) => <rect key={l} x={6} y={6 + l * 12} width={((Math.sin((f * scroll) / 6 + ph + l) + 1.2) / 2.2) * (cell - 22)} height={5} rx={2} fill={hot ? AI.red : AI.blue} opacity={0.6} />)}
          </g>
        );
      })}
    </g>
  );
};

// generic building: "lab" (glass tower) or "gov" (columns, no seal). glow tints the windows
export const Building: React.FC<{ x: number; y: number; s?: number; kind?: "lab" | "gov"; glow?: string; label?: string }> = ({ x, y, s = 1, kind = "lab", glow = AI.blue, label }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {kind === "lab" ? (
      <>
        <rect x={-120} y={-460} width={240} height={460} fill="#141A30" stroke="#0A0E1E" strokeWidth={6} />
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-100 + (i % 5) * 42} y={-440 + Math.floor(i / 5) * 70} width={30} height={46} fill={glow} opacity={0.35 + ((i * 7) % 5) * 0.12} />)}
        <rect x={-130} y={-478} width={260} height={22} fill="#222A48" />
      </>
    ) : (
      <>
        <path d="M-200 -260 L 0 -360 L 200 -260 Z" fill="#D8DCEA" stroke="#0A0E1E" strokeWidth={6} />
        <rect x={-190} y={-260} width={380} height={30} fill="#C8CDE0" />
        {[-150, -75, 0, 75, 150].map((cx) => <rect key={cx} x={cx - 18} y={-230} width={36} height={200} fill="#E8EBF5" stroke="#9AA2C0" strokeWidth={3} />)}
        <rect x={-210} y={-30} width={420} height={30} fill="#B8BED6" />
        <rect x={-190} y={-230} width={380} height={200} fill={glow} opacity={0.18} />
      </>
    )}
    {label && <text y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFFFFF">{label}</text>}
  </g>
);

// a row of safety switches; off 0..1 flips them in sequence
export const Switches: React.FC<{ x: number; y: number; n?: number; off?: number; s?: number }> = ({ x, y, n = 5, off = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-n * 70 - 30} y={-120} width={n * 140 + 60} height={240} rx={20} fill="#1A2038" stroke="#0A0E1E" strokeWidth={6} />
    {Array.from({ length: n }, (_, i) => {
      const o = Math.max(0, Math.min(1, off * n - i));
      return (
        <g key={i} transform={`translate(${-n * 70 + 70 + i * 140},0)`}>
          <rect x={-34} y={-70} width={68} height={140} rx={16} fill="#0A0E1E" />
          <rect x={-26} y={-62 + o * 70} width={52} height={54} rx={12} fill={o > 0.5 ? AI.red : AI.green} />
          <text y={104} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={o > 0.5 ? AI.red : AI.green}>{o > 0.5 ? "OFF" : "ON"}</text>
        </g>
      );
    })}
    <text y={-140} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">SAFETY LIMITS</text>
  </g>
);

// vault with a label
export const Vault: React.FC<{ x: number; y: number; s?: number; label?: string; open?: number }> = ({ x, y, s = 1, label = "ANSWERS", open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-180} width={300} height={300} rx={20} fill="#4A5270" stroke="#0A0E1E" strokeWidth={8} />
    <g transform={`translate(-130,0) scale(${1 - open * 0.8},1) translate(130,0)`}>
      <circle r={110} fill="#6A7398" stroke="#0A0E1E" strokeWidth={6} />
      {[0, 60, 120].map((a) => <rect key={a} x={-8} y={-90} width={16} height={180} rx={8} fill="#3A4060" transform={`rotate(${a})`} />)}
      <circle r={26} fill="#C8CEE0" />
    </g>
    {open > 0.3 && <rect x={-100} y={-100} width={200} height={200} fill={AI.gold} opacity={(open - 0.3) * 0.7} style={{ filter: `drop-shadow(0 0 30px ${AI.gold})` }} />}
    <text y={170} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill={AI.gold}>{label}</text>
  </g>
);

// a gate that slams (slam 0..1 progress of the latest slam) and a vent the agent slips through
export const Gate: React.FC<{ x: number; y: number; s?: number; shut?: number; label?: string }> = ({ x, y, s = 1, shut = 1, label = "ACCESS DENIED" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-220} y={-400} width={440} height={400} fill="#151A2E" stroke="#0A0E1E" strokeWidth={8} />
    <rect x={-200} y={-380 + (1 - shut) * -10} width={400} height={380 * shut} fill="#2A3150" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-190 + i * 58} y={-380} width={14} height={380 * shut} fill="#5A6488" />)}
    <rect x={-200} y={-200} width={400} height={66} fill={AI.red} opacity={shut > 0.9 ? 0.95 : 0} />
    {shut > 0.9 && <text y={-152} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFFFFF">{label}</text>}
  </g>
);
export const Vent: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-80} y={-50} width={160} height={100} rx={8} fill="#05070F" stroke="#5A6488" strokeWidth={6} />
    <g transform={`translate(-80,-50) rotate(${-open * 75}) translate(80,50)`}>
      <rect x={-80} y={-50} width={160} height={100} rx={8} fill="#3A4262" stroke="#5A6488" strokeWidth={6} />
      {[-30, -10, 10, 30].map((vy) => <rect key={vy} x={-64} y={vy - 4} width={128} height={8} rx={4} fill="#1A2038" />)}
    </g>
  </g>
);

// sticky note with a scribble line; text optional
export const Sticky: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string; t?: string }> = ({ x, y, s = 1, rot = 0, c = AI.gold, t }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-70} width={140} height={140} fill={c} style={{ filter: "drop-shadow(4px 8px 6px rgba(0,0,0,0.35))" }} />
    <path d="M-70 -70 L 70 -70 L 70 -54 L -70 -54 Z" fill={shade(c, 0.8)} />
    {t ? <text y={10} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={INK}>{t}</text> : [-20, 4, 28].map((ly) => <path key={ly} d={`M-50 ${ly} q 25 -10 50 0 t 50 0`} stroke={INK} strokeWidth={5} fill="none" opacity={0.7} />)}
  </g>
);

// case file folder
export const CaseFile: React.FC<{ x: number; y: number; s?: number; rot?: number; n?: number }> = ({ x, y, s = 1, rot = 0, n = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-130 -90 L -50 -90 L -30 -110 L 130 -110 L 130 100 L -130 100 Z" fill="#D9A55A" stroke="#7A5420" strokeWidth={5} />
    <rect x={-110} y={-70} width={220} height={150} fill="#F2E6CC" />
    <text x={-90} y={-24} fontFamily="Arial Black" fontSize={30} fill={AI.red}>INCIDENT</text>
    <text x={-90} y={30} fontFamily="Arial Black" fontSize={56} fill={INK}>#{n}</text>
  </g>
);

// web form card with a submit button and an optional SPAM stamp
export const WebForm: React.FC<{ x: number; y: number; s?: number; stamp?: number; title?: string }> = ({ x, y, s = 1, stamp = 0, title = "SUBMIT A TIP" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-300} y={-220} width={600} height={440} rx={18} fill="#F4F6FB" stroke="#0A0E1E" strokeWidth={6} />
    <rect x={-300} y={-220} width={600} height={70} rx={18} fill="#2A3150" />
    <text x={-270} y={-174} fontFamily="Arial Black" fontSize={30} fill="#FFFFFF">{title}</text>
    {[-110, -40, 30].map((fy) => <rect key={fy} x={-260} y={fy} width={520} height={44} rx={8} fill="#E1E5F0" stroke="#B8BED6" strokeWidth={3} />)}
    <rect x={60} y={120} width={200} height={64} rx={12} fill={AI.blue} /><text x={160} y={164} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill={INK}>SUBMIT</text>
    {stamp > 0 && <g transform={`rotate(-14) scale(${1 + (1 - stamp) * 0.8})`} opacity={stamp}><rect x={-190} y={-70} width={380} height={130} rx={12} fill="none" stroke={AI.red} strokeWidth={12} /><text y={34} textAnchor="middle" fontFamily="Arial Black" fontSize={96} fill={AI.red}>SPAM</text></g>}
  </g>
);

// ladder with missing low rungs (entry-level jobs)
export const Ladder: React.FC<{ x: number; y: number; s?: number; missing?: number }> = ({ x, y, s = 1, missing = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-700} width={22} height={700} rx={8} fill="#C88A4A" /><rect x={88} y={-700} width={22} height={700} rx={8} fill="#C88A4A" />
    {Array.from({ length: 9 }, (_, i) => i < missing ? <rect key={i} x={-88} y={-60 - i * 75} width={176} height={16} rx={6} fill="#C88A4A" opacity={0.12} strokeDasharray="8 8" stroke="#FFFFFF" /> : <rect key={i} x={-88} y={-60 - i * 75} width={176} height={16} rx={6} fill="#E0A866" />)}
  </g>
);

// tug-of-war over a rulebook
export const TugOfWar: React.FC<{ x: number; y: number; s?: number; pull?: number; left?: string; right?: string }> = ({ x, y, s = 1, pull = 0, left = "WASHINGTON", right = "THE STATES" }) => {
  const f = useCurrentFrame();
  const d = pull * 60 + Math.sin(f / 7) * 18;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M-700 0 Q 0 ${30 + Math.sin(f / 5) * 8} 700 0`} stroke="#C8A06A" strokeWidth={14} fill="none" transform={`translate(${d},0)`} />
      <g transform={`translate(${d},0)`}>
        <rect x={-90} y={-130} width={180} height={230} rx={10} fill={AI.red} stroke={INK} strokeWidth={6} />
        <rect x={-74} y={-114} width={148} height={198} fill="#FFFFFF" opacity={0.12} />
        <text y={-20} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">AI</text>
        <text y={24} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">RULES</text>
      </g>
      <text x={-560} y={110} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFFFFF">{left}</text>
      <text x={560} y={110} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFFFFF">{right}</text>
    </g>
  );
};

// paper plane (messages passed between sealed systems)
export const PaperPlane: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-50 0 L 60 -30 L -10 10 Z" fill="#FFFFFF" stroke="#9AA2C0" strokeWidth={3} />
    <path d="M-10 10 L 60 -30 L 0 30 Z" fill="#DCE2F2" stroke="#9AA2C0" strokeWidth={3} />
  </g>
);

// pop-in helper for kit elements
export const Pop: React.FC<{ at: number; children: React.ReactNode; x?: number; y?: number }> = ({ at, children, x = 0, y = 0 }) => {
  const f = useCurrentFrame();
  const s = sp(f, at, 10);
  if (f < at) return null;
  return <g transform={`translate(${x},${y}) scale(${s}) translate(${-x},${-y})`}>{children}</g>;
};
