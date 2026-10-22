// Small animal cast for episode 1 (lizard, bee, bat, ant, mouse). Origin = ground/centre, facing right. Level-2 shading.
import React from "react";
import { shade } from "./gen";

type P = { x: number; y: number; s?: number; f?: number; c?: string; flip?: boolean; sick?: boolean };
const T = (x: number, y: number, s: number, flip?: boolean) => `translate(${x},${y}) scale(${flip ? -s : s},${s})`;

export const Lizard: React.FC<P> = ({ x, y, s = 1, f = 0, c = "#8AB84A", flip }) => {
  const step = Math.sin(f / 3) * 10;
  return (
    <g transform={T(x, y, s, flip)}>
      <ellipse cx={0} cy={6} rx={150} ry={14} fill="#000" opacity={0.25} />
      <path d="M-60 -30 Q -160 -20 -230 10 Q -170 -6 -60 -10 Z" fill={shade(c, -0.15)} />
      {[[-40, step], [40, -step]].map(([lx, d], i) => (
        <g key={i}>
          <path d={`M${lx} -20 l ${-14 + d} 26 l -14 0`} stroke={shade(c, -0.3)} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${lx + 10} -20 l ${14 - d} 26 l 14 0`} stroke={shade(c, -0.1)} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <ellipse cx={0} cy={-30} rx={80} ry={28} fill={c} />
      <ellipse cx={-6} cy={-40} rx={60} ry={12} fill={shade(c, 0.3)} opacity={0.6} />
      {[-40, -14, 12, 38].map((sx) => <circle key={sx} cx={sx} cy={-46} r={5} fill={shade(c, -0.25)} />)}
      <path d="M70 -44 Q 130 -54 140 -30 Q 130 -12 70 -16 Z" fill={c} />
      <circle cx={112} cy={-38} r={7} fill="#1B1240" /><circle cx={114} cy={-40} r={2.5} fill="#FFF" />
      <path d="M118 -24 q 14 0 20 -6" stroke={shade(c, -0.4)} strokeWidth={3} fill="none" />
    </g>
  );
};

export const Bee: React.FC<P> = ({ x, y, s = 1, f = 0, flip }) => {
  const flap = Math.sin(f * 2.2) * 0.5 + 0.6;
  return (
    <g transform={T(x, y, s, flip)}>
      {[-1, 1].map((k) => <ellipse key={k} cx={-6 + k * 4} cy={-40} rx={22} ry={34 * flap} fill="#E8F6FF" opacity={0.7} transform={`rotate(${-20 + k * 14},0,-20)`} />)}
      <ellipse cx={0} cy={0} rx={42} ry={28} fill="#FFC21F" />
      {[-14, 6, 24].map((sx) => <path key={sx} d={`M${sx} -27 Q ${sx + 6} 0 ${sx} 27`} stroke="#2A1A0A" strokeWidth={9} fill="none" />)}
      <ellipse cx={-6} cy={-12} rx={26} ry={8} fill="#FFF2B0" opacity={0.6} />
      <circle cx={46} cy={-4} r={18} fill="#2A1A0A" /><circle cx={52} cy={-8} r={4} fill="#FFF" />
      <path d="M50 -20 q 6 -18 18 -20 M42 -20 q 0 -18 8 -24" stroke="#2A1A0A" strokeWidth={3} fill="none" />
      <path d="M-42 0 l -14 4 l 14 4 Z" fill="#2A1A0A" />
    </g>
  );
};

export const Bat: React.FC<P> = ({ x, y, s = 1, f = 0, c = "#4A3A6A", flip, sick }) => {
  const w = sick ? 0.3 : Math.sin(f / 2.5) * 0.45;
  return (
    <g transform={T(x, y, s, flip)}>
      {[-1, 1].map((k) => (
        <path key={k} transform={`scale(${k},1) rotate(${w * 40},0,0)`} d="M10 -6 Q 60 -60 120 -40 Q 104 -20 110 6 Q 88 -6 76 14 Q 64 -2 46 16 Q 34 0 10 10 Z" fill={shade(c, k > 0 ? 0 : -0.2)} />
      ))}
      <ellipse cx={0} cy={4} rx={20} ry={28} fill={shade(c, -0.1)} />
      <path d="M-14 -20 l 2 -22 l 10 16 Z M14 -20 l -2 -22 l -10 16 Z" fill={shade(c, -0.1)} />
      <circle cx={0} cy={-12} r={16} fill={c} />
      {[-6, 6].map((ex) => <circle key={ex} cx={ex} cy={-14} r={3.5} fill={sick ? "#9A8AAA" : "#FFE066"} />)}
      <path d="M-4 -4 l 2 5 l 2 -5 M2 -4 l 2 5 l 2 -5" fill="#FFF" />
    </g>
  );
};

export const Ant: React.FC<P> = ({ x, y, s = 1, f = 0, c = "#3A1A12", flip }) => {
  const st = Math.sin(f / 2) * 6;
  return (
    <g transform={T(x, y, s, flip)}>
      {[-16, 0, 16].map((lx, i) => (
        <path key={i} d={`M${lx} -12 l ${-10 + (i % 2 ? st : -st)} 16 M${lx} -12 l ${10 + (i % 2 ? -st : st)} 16`} stroke={c} strokeWidth={4} strokeLinecap="round" />
      ))}
      <ellipse cx={-30} cy={-16} rx={22} ry={15} fill={c} />
      <ellipse cx={0} cy={-16} rx={12} ry={8} fill={shade(c, 0.1)} />
      <circle cx={24} cy={-20} r={11} fill={c} />
      <path d="M30 -28 q 10 -16 22 -14 M26 -30 q 4 -16 14 -20" stroke={c} strokeWidth={3} fill="none" />
      <ellipse cx={-34} cy={-22} rx={9} ry={4} fill="#FFFFFF" opacity={0.25} />
    </g>
  );
};

export const Mouse: React.FC<P> = ({ x, y, s = 1, f = 0, c = "#C8C4D8", flip, sick }) => {
  const b = sick ? 0 : Math.sin(f / 4) * 3;
  return (
    <g transform={T(x, y, s, flip)}>
      <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.25} />
      <path d="M-56 -14 Q -110 -10 -120 -40 Q -126 -60 -100 -64" stroke="#E8A0B0" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-30 + b} rx={62} ry={36} fill={c} />
      <ellipse cx={-10} cy={-46 + b} rx={38} ry={12} fill={shade(c, 0.4)} opacity={0.7} />
      <circle cx={34} cy={-62 + b} r={18} fill={c} /><circle cx={34} cy={-62 + b} r={10} fill="#F2B0C0" />
      <path d={`M40 ${-44 + b} Q 90 ${-40 + b} 92 ${-22 + b} Q 70 ${-8 + b} 40 ${-14 + b} Z`} fill={c} />
      <circle cx={92} cy={-24 + b} r={6} fill="#E86A8A" />
      {sick ? <path d={`M58 ${-34 + b} q 6 4 12 0`} stroke="#1B1240" strokeWidth={3} fill="none" /> : <circle cx={64} cy={-34 + b} r={5} fill="#1B1240" />}
    </g>
  );
};
