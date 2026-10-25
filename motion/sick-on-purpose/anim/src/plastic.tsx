// Microplastics episode kit: particles, bottle, blood-vessel tunnel, artery cross-section, pyrolysis "fingerprint",
// courthouse, memo, gauge, and an Infographics-style StatCard. Level-2 shading; pair with cinema.tsx for camera/VFX.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, INK, sp, W } from "./kit";
import { mix, rng, shade } from "./gen";

export const PLASTIC = ["#3FD1FF", "#FF5FA2", "#FFD23F", "#7CFF8A", "#B48CFF", "#FF8A3D"];

// one particle: fragment / fibre / bead, with glow
export const Particle: React.FC<{ x: number; y: number; r: number; c?: string; kind?: 0 | 1 | 2; rot?: number; glow?: number }> = ({ x, y, r, c = PLASTIC[0], kind = 0, rot = 0, glow = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    {glow > 0 && <circle r={r * 2.4} fill={c} opacity={0.18 * glow} />}
    {kind === 0 && <path d={`M${-r} ${-r * 0.4} L ${-r * 0.2} ${-r} L ${r} ${-r * 0.5} L ${r * 0.7} ${r * 0.8} L ${-r * 0.6} ${r * 0.6} Z`} fill={c} stroke={shade(c, 0.4)} strokeWidth={r * 0.15} />}
    {kind === 1 && <path d={`M${-r * 2} 0 Q ${-r} ${-r * 0.8} 0 0 T ${r * 2} 0`} stroke={c} strokeWidth={r * 0.45} fill="none" strokeLinecap="round" />}
    {kind === 2 && <><circle r={r * 0.8} fill={c} /><circle cx={-r * 0.25} cy={-r * 0.25} r={r * 0.3} fill="#FFFFFF" opacity={0.6} /></>}
  </g>
);

// drifting field of particles (screen-filling), deterministic
export const ParticleField: React.FC<{ seed?: number; n?: number; size?: [number, number]; speed?: number; glow?: number; area?: [number, number, number, number] }> = ({ seed = 1, n = 60, size = [4, 14], speed = 1, glow = 1, area = [0, 0, W, H] }) => {
  const f = useCurrentFrame();
  const R = rng(seed);
  const [ax, ay, aw, ah] = area;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x0 = R() * aw, y0 = R() * ah, r = size[0] + R() * (size[1] - size[0]), ph = R() * 6, k = Math.floor(R() * 3) as 0 | 1 | 2, c = PLASTIC[Math.floor(R() * PLASTIC.length)];
        const x = ax + ((x0 + Math.sin(f / 50 + ph) * 20 + f * speed * (0.2 + R() * 0.3)) % aw);
        const y = ay + ((y0 + Math.cos(f / 60 + ph) * 16) % ah);
        return <Particle key={i} x={x} y={y} r={r} c={c} kind={k} rot={f * (R() - 0.5) * 2 + ph * 50} glow={glow} />;
      })}
    </g>
  );
};

// PET water bottle. fill 0..1 of glowing specks inside.
export const Bottle: React.FC<{ x: number; y: number; s?: number; specks?: number; crack?: number }> = ({ x, y, s = 1, specks = 0, crack = 0 }) => {
  const f = useCurrentFrame();
  const R = rng(4);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id="btl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#BFE8FF" stopOpacity="0.55" /><stop offset="0.4" stopColor="#E8F8FF" stopOpacity="0.3" /><stop offset="1" stopColor="#7FC8F0" stopOpacity="0.6" /></linearGradient>
        <clipPath id="btlc"><path d="M-70 -280 Q -70 -330 -30 -350 L -30 -400 L 30 -400 L 30 -350 Q 70 -330 70 -280 L 70 -10 Q 70 10 50 10 L -50 10 Q -70 10 -70 -10 Z" /></clipPath>
      </defs>
      <ellipse cx={0} cy={14} rx={80} ry={12} fill="#000" opacity={0.25} />
      <path d="M-70 -280 Q -70 -330 -30 -350 L -30 -400 L 30 -400 L 30 -350 Q 70 -330 70 -280 L 70 -10 Q 70 10 50 10 L -50 10 Q -70 10 -70 -10 Z" fill="url(#btl)" stroke="#E8F8FF" strokeWidth={4} />
      <g clipPath="url(#btlc)">
        <rect x={-70} y={-300} width={140} height={320} fill="#7FC8FF" opacity={0.25} />
        <path d={`M-70 ${-300 + Math.sin(f / 10) * 4} Q 0 ${-312 + Math.sin(f / 10) * 4} 70 ${-300 + Math.sin(f / 10) * 4}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} />
        {Array.from({ length: Math.round(60 * specks) }, (_, i) => <Particle key={i} x={-60 + R() * 120} y={-290 + ((R() * 300 + f * (0.2 + R() * 0.3)) % 300)} r={2 + R() * 4} c={PLASTIC[i % PLASTIC.length]} kind={(i % 3) as 0 | 1 | 2} glow={0.8} />)}
        <rect x={-70} y={-220} width={140} height={90} fill="#2A7AD8" opacity={0.85} />
        <text x={0} y={-162} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#FFFFFF">AQUA</text>
      </g>
      <rect x={-34} y={-430} width={68} height={34} rx={8} fill="#2A7AD8" />
      <rect x={-56} y={-300} width={14} height={280} rx={7} fill="#FFFFFF" opacity={0.35} />
      {crack > 0 && <path d={`M10 -260 l -20 40 l 25 30 l -15 50 l 20 40`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - crack)} />}
    </g>
  );
};

// BLOOD-VESSEL TUNNEL: first-person view down a vessel; red cells stream toward camera (use with cinema push-in)
export const BloodTunnel: React.FC<{ plastic?: number; speed?: number }> = ({ plastic = 0.5, speed = 1 }) => {
  const f = useCurrentFrame();
  const R = rng(12);
  const cx = W / 2, cy = H / 2;
  const rings = 14;
  return (
    <g>
      <defs>
        <radialGradient id="vt" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stopColor="#2A0510" /><stop offset="0.35" stopColor="#7A1020" /><stop offset="0.75" stopColor="#C8283A" /><stop offset="1" stopColor="#FF6A6A" /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vt)" />
      {/* wall rings rushing past */}
      {Array.from({ length: rings }, (_, i) => {
        const t = ((i / rings + (f * 0.006 * speed)) % 1);
        const k = Math.pow(t, 2.2);
        return <ellipse key={i} cx={cx} cy={cy} rx={60 + k * 1500} ry={40 + k * 1000} fill="none" stroke="#FF8A8A" strokeWidth={2 + k * 30} opacity={0.08 + k * 0.25} />;
      })}
      {/* red blood cells and plastic flying toward camera */}
      {Array.from({ length: 70 }, (_, i) => {
        const a = R() * Math.PI * 2, d0 = 0.2 + R() * 0.8, off = R();
        const t = (off + f * 0.004 * speed * (0.7 + R() * 0.6)) % 1;
        const k = Math.pow(t, 2.4);
        const x = cx + Math.cos(a) * d0 * k * 1300, y = cy + Math.sin(a) * d0 * k * 850, r = 6 + k * 120;
        const isPl = i < 70 * plastic * 0.4;
        if (isPl) return <Particle key={i} x={x} y={y} r={r * 0.35} c={PLASTIC[i % PLASTIC.length]} kind={(i % 3) as 0 | 1 | 2} rot={f * 2 + i * 40} glow={1.2} />;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${i * 37 + f})`} opacity={Math.min(1, t * 3)}>
            <ellipse rx={r} ry={r * 0.62} fill="#D8203A" />
            <ellipse rx={r * 0.55} ry={r * 0.3} fill="#9A0A20" />
            <ellipse cx={-r * 0.3} cy={-r * 0.25} rx={r * 0.35} ry={r * 0.15} fill="#FF8A9A" opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

// artery cross-section with yellow plaque; particles glow inside plaque
export const Artery: React.FC<{ x: number; y: number; s?: number; plaque?: number; glow?: number }> = ({ x, y, s = 1, plaque = 1, glow = 1 }) => {
  const f = useCurrentFrame();
  const R = rng(8);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={300} fill="#C8283A" />
      <circle r={300} fill="none" stroke="#FF8A8A" strokeWidth={14} />
      <circle r={250} fill="#E85060" />
      <path d={`M-250 0 A 250 250 0 0 1 250 0 L ${250 - 120 * plaque} 0 A ${250 - 120 * plaque} ${250 - 120 * plaque} 0 0 0 ${-250 + 120 * plaque} 0 Z`} transform="rotate(200)" fill="#F4C860" />
      <circle r={250 - 130 * plaque} cx={40 * plaque} cy={30 * plaque} fill="#4A0A14" />
      {Array.from({ length: 18 }, (_, i) => { const a = (25 + R() * 150) * Math.PI / 180, d = 150 + R() * 80; return <Particle key={i} x={Math.cos(a) * d} y={Math.sin(a) * d} r={5 + R() * 6} c={PLASTIC[i % 6]} kind={(i % 3) as 0 | 1 | 2} rot={f + i * 30} glow={glow} />; })}
    </g>
  );
};

// pyrolysis fingerprint: two spectra; overlap 0..1 slides the FAT trace onto the PLASTIC trace
export const Fingerprint: React.FC<{ x: number; y: number; w?: number; h?: number; overlap?: number }> = ({ x, y, w = 900, h = 360, overlap = 0 }) => {
  const peaks = [0.12, 0.2, 0.31, 0.44, 0.52, 0.63, 0.71, 0.83, 0.9];
  const amp = [0.5, 0.9, 0.4, 1, 0.6, 0.8, 0.3, 0.7, 0.45];
  const trace = (dx: number, a: number) => `M0 ${h} ` + peaks.map((p, i) => `L ${p * w - 14 + dx} ${h} L ${p * w + dx} ${h - amp[i] * h * a} L ${p * w + 14 + dx} ${h}`).join(" ") + ` L ${w} ${h}`;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-20} y={-30} width={w + 40} height={h + 60} rx={18} fill="#0B1228" opacity={0.85} />
      <path d={trace(0, 1)} fill="none" stroke="#3FD1FF" strokeWidth={6} strokeLinejoin="round" />
      <path d={trace((1 - overlap) * 60, 0.92)} fill="none" stroke="#FFB060" strokeWidth={6} strokeLinejoin="round" opacity={0.9} strokeDasharray={overlap > 0.95 ? "14 8" : undefined} />
      <text x={20} y={10} fontFamily="Arial Black" fontSize={30} fill="#3FD1FF">PLASTIC</text>
      <text x={w - 20} y={10} textAnchor="end" fontFamily="Arial Black" fontSize={30} fill="#FFB060">BODY FAT</text>
    </g>
  );
};

// courthouse facade
export const Courthouse: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={520} ry={30} fill="#000" opacity={0.3} />
    {[0, 1, 2].map((i) => <rect key={i} x={-480 + i * 20} y={-30 - i * 24} width={960 - i * 40} height={30} fill={mix("#C8C0B0", "#F4EEE2", i / 2)} />)}
    {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={-380 + i * 152} y={-430} width={60} height={360} fill="#E8E2D4" /><rect x={-380 + i * 152} y={-430} width={20} height={360} fill="#FFFFFF" opacity={0.5} /></g>)}
    <rect x={-440} y={-470} width={880} height={50} fill="#D8D0C0" />
    <path d="M-460 -470 L 0 -640 L 460 -470 Z" fill="#E8E2D4" />
    <path d="M-380 -490 L 0 -610 L 380 -490 Z" fill="#C8C0B0" />
    <circle cx={0} cy={-540} r={30} fill="#F4CF7A" />
  </g>
);

// paper memo with redacted lines (no real text)
export const Memo: React.FC<{ x: number; y: number; s?: number; rot?: number; hi?: number }> = ({ x, y, s = 1, rot = 0, hi = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-170} y={-220} width={340} height={440} rx={6} fill="#F4F0E4" />
    <rect x={-170} y={-220} width={340} height={440} rx={6} fill="none" stroke="#C8C0A8" strokeWidth={3} />
    <text x={-140} y={-170} fontFamily="Arial Black" fontSize={26} fill="#8A2A2A">CONFIDENTIAL</text>
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-140} y={-130 + i * 28} width={(i * 53) % 120 + 160} height={10} rx={5} fill={i === 5 && hi ? "#FFD23F" : "#8A8A9A"} opacity={i === 5 && hi ? 1 : 0.5} />)}
    {hi > 0 && <rect x={-146} y={-130 + 5 * 28 - 8} width={300 * hi} height={26} fill="#FFD23F" opacity={0.45} />}
  </g>
);

// gauge 0..1
export const Gauge: React.FC<{ x: number; y: number; v: number; s?: number; labels?: [string, string] }> = ({ x, y, v, s = 1, labels = ["LESS", "MORE"] }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-200 0 A 200 200 0 0 1 200 0" fill="none" stroke="#2A3A6A" strokeWidth={40} />
    <path d="M-200 0 A 200 200 0 0 1 200 0" fill="none" stroke="#FF4D6D" strokeWidth={40} strokeDasharray={`${Math.PI * 200 * v} 9999`} />
    <line x1={0} y1={0} x2={-Math.cos(v * Math.PI) * 170} y2={-Math.sin(v * Math.PI) * 170} stroke="#F4EEE2" strokeWidth={10} strokeLinecap="round" />
    <circle r={18} fill="#F4EEE2" />
    <text x={-200} y={50} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#9FB0D8">{labels[0]}</text>
    <text x={200} y={50} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#9FB0D8">{labels[1]}</text>
  </g>
);

// Infographics-style stat card: icon + big number + label, punches in at `at`
export const StatCard: React.FC<{ x?: number; y?: number; big: string; label: string; sub?: string; c?: string; at?: number; icon?: React.ReactNode }> = ({ x = W / 2, y = H / 2, big, label, sub, c = "#FFD23F", at = 0, icon }) => {
  const f = useCurrentFrame();
  const s = sp(f, at, 9);
  const s2 = sp(f, at + 8, 11);
  return (
    <g transform={`translate(${x},${y})`}>
      <g transform={`scale(${s})`}>
        {icon && <g transform="translate(0,-170)">{icon}</g>}
        <text textAnchor="middle" y={40} fontFamily="Arial Black" fontSize={170} fill={INK} dy={10}>{big}</text>
        <text textAnchor="middle" y={40} fontFamily="Arial Black" fontSize={170} fill={c} style={{ filter: `drop-shadow(0 0 24px ${c}88)` }}>{big}</text>
      </g>
      <g transform={`translate(0,${120 + (1 - s2) * 40})`} opacity={s2}>
        <text textAnchor="middle" fontFamily="Arial Black" fontSize={58} fill="#FFFFFF">{label}</text>
        {sub && <text textAnchor="middle" y={56} fontFamily="Arial Black" fontSize={34} fill="#9FB0D8">{sub}</text>}
      </g>
    </g>
  );
};
