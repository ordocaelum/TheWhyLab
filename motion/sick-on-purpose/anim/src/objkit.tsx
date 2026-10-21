// Shared object-drawing kit (used by every object batch).
import React from "react";
import { Grad, shade } from "./gen";

// ---------- shared kit ----------
export const Part: React.FC<{ id: string; d: string; c: string; ang?: number; rim?: boolean }> = ({ id, d, c, ang = 40, rim = true }) => (
  <g>
    <defs><Grad id={id} c={c} angle={ang} /></defs>
    <path d={d} fill={`url(#${id})`} />
    {rim && <path d={d} fill="none" stroke={shade(c, 0.5)} strokeWidth={3} opacity={0.3} />}
  </g>
);
export const Shine: React.FC<{ x: number; y: number; rx: number; ry: number; r?: number; o?: number }> = ({ x, y, rx, ry, r = -30, o = 0.55 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FFFFFF" opacity={o} transform={`rotate(${r},${x},${y})`} />
);
export const Line: React.FC<{ d: string; c: string; w?: number; o?: number }> = ({ d, c, w = 4, o = 1 }) => (
  <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);
export const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
export const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
export const ell = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

