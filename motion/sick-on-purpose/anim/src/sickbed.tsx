// Sick person in bed: a library avatar (Human2) lying on the pillow under a shaded blanket.
// Origin = mattress top centre. Bed is ~1460 wide at s=1. shiver: trembles. breathe: blanket rises.
import React from "react";
import { AVATARS, Human2, Look } from "./human2";
import { DocExpr } from "./doc2";
import { shade } from "./gen";

export const PATIENT: Look = AVATARS.find((a) => a.name === "Ethan")!.L;

export const SickInBed: React.FC<{ x: number; y: number; s?: number; f: number; L?: Look; expr?: DocExpr; shiver?: boolean; blanket?: string; frame?: string; id?: string }> = ({
  x, y, s = 1, f, L = PATIENT, expr = "unamused", shiver = false, blanket = "#E0567A", frame = "#3B2A7A", id = "sb",
}) => {
  const sh = shiver ? Math.sin(f * 1.9) * 5 : 0;
  const br = Math.sin(f / 16) * 6;
  const top = (k: number) => -330 - br * k;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}bl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(blanket, 0.25)} /><stop offset="0.6" stopColor={blanket} /><stop offset="1" stopColor={shade(blanket, -0.25)} /></linearGradient>
        <linearGradient id={`${id}pl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C8D0FF" /></linearGradient>
      </defs>
      <ellipse cx={0} cy={200} rx={760} ry={40} fill="#000" opacity={0.3} />
      {/* headboard + frame + mattress */}
      <rect x={-800} y={-330} width={100} height={530} rx={40} fill={shade(frame, -0.2)} />
      <rect x={-800} y={-330} width={44} height={530} rx={22} fill={shade(frame, 0.2)} />
      <rect x={-740} y={40} width={1480} height={160} rx={36} fill={frame} />
      <rect x={-740} y={40} width={1480} height={30} rx={15} fill={shade(frame, 0.25)} />
      <rect x={-730} y={-30} width={1460} height={90} rx={30} fill="#F4F0E8" />
      {/* pillow */}
      <ellipse cx={-520} cy={-70} rx={210} ry={90} fill="#C8D0FF" />
      <ellipse cx={-530} cy={-86} rx={190} ry={70} fill={`url(#${id}pl)`} />
      {/* the patient, lying back, head on the pillow (feet origin, rotated) */}
      <g transform={`translate(${190 + sh},-80) rotate(-82)`}>
        <Human2 L={L} x={0} y={0} s={1} f={f} expr={expr} />
      </g>
      {/* pale, clammy tint + sweat drop */}
      <circle cx={-500 + sh} cy={-190} r={95} fill="#C8D8A0" opacity={0.16} />
      <path d={`M${-430 + sh} -300 q 12 ${22 + Math.sin(f / 8) * 3} 0 34 q -12 -12 0 -34 Z`} fill="#B8FFFA" opacity={0.9} />
      {/* blanket over shoulders to feet */}
      <path d={`M${-330 + sh} 20 C ${-340 + sh} ${top(0.6)} -120 ${top(1) - 20} 120 ${top(1)} C 420 ${top(0.8)} 640 -230 720 -80 L 730 60 L ${-330 + sh} 60 Z`} fill={`url(#${id}bl)`} />
      <path d={`M${-300 + sh} ${top(0.6) + 40} C -160 ${top(1) - 10} 100 ${top(1) + 6} 300 ${top(0.8) + 20}`} stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.3} />
      <path d={`M${-340 + sh} 10 C ${-350 + sh} -100 ${-330 + sh} -170 ${-300 + sh} ${top(0.6) + 20}`} stroke={shade(blanket, 0.45)} strokeWidth={30} strokeLinecap="round" fill="none" />
      {[-120, 100, 320, 540].map((bx, i) => <circle key={bx} cx={bx} cy={-60 - (i === 3 ? 0 : 30)} r={14} fill={shade(blanket, -0.3)} opacity={0.5} />)}
    </g>
  );
};
