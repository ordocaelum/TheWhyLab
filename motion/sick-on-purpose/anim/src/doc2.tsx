// Doc v2: hero-tier fidelity (ASSETS humans/hero, STYLING §8). Same props as v1 Scientist.
// Origin = feet centre, ~780 tall at s=1. Key light top-left (warm), teal rim light right.
import React from "react";

const SKIN = ["#F6CFA6", "#E3AE82", "#C98A64", "#A86A4A"];
const HAIR = ["#7A4E33", "#5A3A26", "#3A2216"];
const COAT = ["#FFFFFF", "#F1EEFA", "#D6D0EC", "#B4ACD6"];
const PANT = ["#4A42A8", "#332B86", "#221B5E"];
const RIM = "#5FF0E8";

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="d2skin" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor={SKIN[0]} /><stop offset="0.55" stopColor={SKIN[1]} /><stop offset="1" stopColor={SKIN[2]} />
    </linearGradient>
    <linearGradient id="d2skinHand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={SKIN[0]} /><stop offset="1" stopColor={SKIN[2]} />
    </linearGradient>
    <linearGradient id="d2coat" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0" stopColor={COAT[0]} /><stop offset="0.5" stopColor={COAT[1]} /><stop offset="1" stopColor={COAT[2]} />
    </linearGradient>
    <linearGradient id="d2sleeve" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={COAT[0]} /><stop offset="1" stopColor={COAT[2]} />
    </linearGradient>
    <linearGradient id="d2pant" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={PANT[0]} /><stop offset="1" stopColor={PANT[2]} />
    </linearGradient>
    <linearGradient id="d2hair" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stopColor={HAIR[0]} /><stop offset="0.6" stopColor={HAIR[1]} /><stop offset="1" stopColor={HAIR[2]} />
    </linearGradient>
    <linearGradient id="d2temple" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#C9C2BA" /><stop offset="1" stopColor={HAIR[1]} />
    </linearGradient>
    <linearGradient id="d2shirt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#EAF4FF" /><stop offset="1" stopColor="#B9CDEA" />
    </linearGradient>
    <radialGradient id="d2cheek" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#E8826A" stopOpacity="0.35" /><stop offset="1" stopColor="#E8826A" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// Arm: shoulder at (sx,sy). a1 = upper-arm angle, a2 = forearm bend (deg, 0 = straight down).
const Arm: React.FC<{ sx: number; sy: number; a1: number; a2: number; side: 1 | -1; watch?: boolean; back?: boolean }> = ({ sx, sy, a1, a2, side, watch, back }) => {
  const up = 175, fore = 160;
  return (
    <g transform={`translate(${sx},${sy}) rotate(${a1})`}>
      {/* upper sleeve */}
      <path d={`M-30 0 Q -34 ${up / 2} -26 ${up} L 26 ${up} Q 34 ${up / 2} 30 0 Z`} fill={back ? COAT[2] : "url(#d2sleeve)"} />
      <path d={`M${side * 22} 10 Q ${side * 30} ${up / 2} ${side * 22} ${up - 10}`} stroke={side > 0 ? RIM : COAT[0]} strokeWidth={4} fill="none" opacity={side > 0 ? 0.6 : 0.8} />
      <g transform={`translate(0,${up}) rotate(${a2})`}>
        {/* forearm sleeve */}
        <path d={`M-28 -16 Q -28 ${fore / 2} -24 ${fore} L 24 ${fore} Q 28 ${fore / 2} 28 -16 Z`} fill={back ? COAT[2] : "url(#d2sleeve)"} />
        <path d="M-18 -2 Q 0 8 18 -2" stroke={COAT[3]} strokeWidth={3} fill="none" opacity={0.6} />
        <path d={`M-18 ${fore * 0.45} q 10 6 22 -2`} stroke={COAT[3]} strokeWidth={3} fill="none" opacity={0.7} />
        {/* cuff */}
        <rect x={-27} y={fore - 18} width={54} height={20} rx={8} fill={COAT[2]} />
        <rect x={-27} y={fore - 18} width={54} height={6} rx={3} fill={COAT[0]} opacity={0.8} />
        {watch && (
          <g transform={`translate(0,${fore + 8})`}>
            <rect x={-22} y={-8} width={44} height={16} rx={6} fill="#2A2F5A" />
            <circle cx={side * 2} cy={0} r={11} fill="#D9A23F" />
            <circle cx={side * 2} cy={0} r={7} fill="#F4EEE2" />
          </g>
        )}
        {/* mitten hand with thumb */}
        <g transform={`translate(0,${fore + 14})`}>
          <path d="M-20 0 Q -26 34 -12 52 Q 2 62 16 52 Q 26 36 20 0 Z" fill="url(#d2skinHand)" />
          <path d={`M${-side * 18} 8 Q ${-side * 36} 22 ${-side * 28} 38 Q ${-side * 20} 40 ${-side * 14} 28`} fill={SKIN[1]} />
          <path d="M-8 44 q 10 6 20 0" stroke={SKIN[3]} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </g>
    </g>
  );
};

export type DocExpr = "neutral" | "happy" | "surprised" | "skeptical" | "unamused" | "serious" | "thinking";
// per-expression face params: brow lift/tilt per side (L = his right, our left), eye open, upper-lid cover, mouth shape
export const EXPR: Record<DocExpr, { bl: number; br: number; tl: number; tr: number; eye: number; lid: number; mouth: "rest" | "smile" | "o" | "smirk" | "flat" | "frown" | "hmm"; up?: number; side?: number }> = {
  neutral:   { bl: 0,  br: 0,  tl: 0,   tr: 0,   eye: 1,    lid: 0,    mouth: "rest" },
  happy:     { bl: 6,  br: 6,  tl: -4,  tr: -4,  eye: 0.8,  lid: 0,    mouth: "smile" },
  surprised: { bl: 18, br: 18, tl: -6,  tr: -6,  eye: 1.3,  lid: 0,    mouth: "o" },
  skeptical: { bl: -6, br: 16, tl: 8,   tr: -10, eye: 0.9,  lid: 0.15, mouth: "smirk" },
  unamused:  { bl: -4, br: -4, tl: 0,   tr: 0,   eye: 1,    lid: 0.55, mouth: "flat" },
  serious:   { bl: -6, br: -6, tl: 12,  tr: 12,  eye: 0.95, lid: 0.1,  mouth: "frown" },
  thinking:  { bl: 2,  br: 12, tl: 0,   tr: -6,  eye: 0.95, lid: 0.2,  mouth: "hmm", up: 6, side: 1 },
};

export type DocPose = "idle" | "present" | "point" | "chin" | "crossed" | "hips" | "shrug" | "walk";
// arm angles (deg): F = front arm (his right, our left; outward = +), B = back arm (his left, our right; outward = -)
// [shoulder (0 = straight down), elbow bend relative to the upper arm]. lift = shoulder raise (px).
export const POSE: Record<Exclude<DocPose, "walk">, { F: [number, number]; B: [number, number]; lift: number }> = {
  idle:    { F: [10, -6],    B: [-10, 8],   lift: 0 },
  present: { F: [10, -6],    B: [-48, -86], lift: 0 },
  point:   { F: [10, -6],    B: [-98, -8],  lift: 0 },
  chin:    { F: [-34, -146], B: [-10, 8],   lift: 0 },
  crossed: { F: [-6, -88],   B: [6, 80],    lift: 0 },
  hips:    { F: [38, -84],   B: [-38, 84],  lift: 0 },
  shrug:   { F: [12, 108],   B: [-12, -108], lift: 16 },
};

export const DocV2: React.FC<{ x: number; y: number; s?: number; f: number; talk?: boolean; point?: number; look?: number; expr?: DocExpr; pose?: DocPose }> = ({
  x, y, s = 1, f, talk = false, point = 0, look = 0, expr = "neutral", pose = "idle",
}) => {
  const E = EXPR[expr];
  const walking = pose === "walk";
  const swing = walking ? Math.sin(f / 6) : 0;
  const P = walking
    ? { F: [10 - swing * 18, -10] as [number, number], B: [-10 - swing * 18, 10] as [number, number], lift: 0 }
    : pose === "idle" && point > 0
      ? { F: POSE.idle.F, B: [-10 - point * 88, 8 - point * 16] as [number, number], lift: 0 }
      : POSE[pose];
  const bob = walking ? -Math.abs(Math.sin(f / 6)) * 10 : Math.sin(f / 14) * 3;
  const open = talk ? 0.25 + Math.abs(Math.sin(f / 2.5)) * 0.75 : 0;
  const blink = f % 95 > 90 ? 0.12 : 1;
  const brow = talk ? Math.sin(f / 6) * 3 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Defs />
      <ellipse cx={6} cy={8} rx={150} ry={20} fill="#000" opacity={0.3} />

      {/* ---- legs + shoes (slight contrapposto; swing when walking) ---- */}
      {([[-1, -34], [1, 38]] as const).map(([sd, lx]) => (
        <g key={sd} transform={`translate(0,${-Math.max(0, swing * sd) * 16})`}>
          <path d={sd < 0 ? "M-62 -260 L -54 -22 L -12 -22 L -8 -260 Z" : "M8 -260 L 18 -22 L 62 -22 L 66 -260 Z"} fill="url(#d2pant)" />
          <path d={`M${lx} -250 L ${lx + 2} -40`} stroke={PANT[0]} strokeWidth={4} opacity={0.8} />
          <g transform={`translate(${sd < 0 ? -34 : 42},-8)`}>
            <path d={`M-34 -16 Q -36 8 -20 10 L ${sd > 0 ? 52 : 34} 10 Q ${sd > 0 ? 62 : 44} 0 ${sd > 0 ? 44 : 30} -16 Z`} fill="#4A2E2A" />
            <rect x={-36} y={4} width={sd > 0 ? 98 : 80} height={10} rx={5} fill="#2A1A18" />
            <path d="M-10 -12 l 16 0 M-6 -6 l 16 0" stroke="#E8D8C8" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
            <ellipse cx={-14} cy={-10} rx={10} ry={4} fill="#FFFFFF" opacity={0.25} />
          </g>
        </g>
      ))}

      <g transform={`translate(0,${bob})`}>
        {/* ---- back arm (his left, our right) ---- */}
        {pose !== "crossed" && <Arm sx={104} sy={-520 - P.lift} a1={P.B[0]} a2={P.B[1]} side={1} />}

        {/* ---- shirt + tie in the open front ---- */}
        <path d="M-48 -548 L 48 -548 L 8 -320 L -8 -320 Z" fill="url(#d2shirt)" />
        <path d="M-12 -536 L 12 -536 L 18 -420 L 0 -396 L -18 -420 Z" fill="#2EB8B2" />
        <path d="M-12 -536 L 12 -536 L 8 -514 L -8 -514 Z" fill="#1F8A86" />
        <path d="M-4 -506 L 4 -506 L 2 -430" stroke="#7FF0E8" strokeWidth={3} opacity={0.7} />

        {/* ---- lab coat body: tapered, flared hem, open front ---- */}
        <path d="M-118 -540 Q -128 -470 -104 -380 Q -112 -260 -132 -150 L 6 -150 L 4 -320 L -50 -548 Q -90 -552 -118 -540 Z" fill="url(#d2coat)" />
        <path d="M118 -540 Q 128 -470 104 -380 Q 112 -260 134 -150 L 6 -150 L 6 -320 L 50 -548 Q 90 -552 118 -540 Z" fill={COAT[2]} />
        <path d="M118 -540 Q 128 -470 104 -380 Q 112 -260 134 -150 L 98 -150 Q 86 -260 92 -380 Q 106 -470 96 -540 Z" fill={COAT[3]} opacity={0.6} />
        {/* rim light (teal ambient) on the right edge */}
        <path d="M120 -536 Q 130 -470 106 -380 Q 114 -260 134 -152" stroke={RIM} strokeWidth={4} fill="none" opacity={0.3} />
        {/* key-light highlight on the left panel */}
        <path d="M-100 -500 Q -110 -420 -92 -360" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.9} />
        {/* waist folds */}
        <path d="M-100 -380 q 20 10 40 4 M92 -382 q -18 10 -38 4" stroke={COAT[3]} strokeWidth={4} fill="none" opacity={0.7} />
        <path d="M-70 -300 q 6 70 -4 140 M70 -300 q -4 70 6 140" stroke={COAT[2]} strokeWidth={5} fill="none" opacity={0.7} />
        {/* lapels */}
        <path d="M-50 -548 L -14 -410 L -78 -470 L -70 -540 Z" fill={COAT[1]} />
        <path d="M-50 -548 L -14 -410" stroke={COAT[3]} strokeWidth={3} />
        <path d="M50 -548 L 14 -410 L 78 -470 L 70 -540 Z" fill={COAT[2]} />
        {/* buttons */}
        {[-360, -290, -220].map((by) => (
          <g key={by}><circle cx={26} cy={by} r={9} fill={COAT[3]} /><circle cx={24} cy={by - 2} r={4} fill={COAT[0]} /></g>
        ))}
        {/* chest pocket + pens + ID badge */}
        <path d="M44 -470 L 92 -470 L 90 -424 L 46 -424 Z" fill={COAT[2]} />
        <path d="M44 -470 L 92 -470" stroke={COAT[3]} strokeWidth={4} />
        <rect x={52} y={-500} width={8} height={36} rx={4} fill="#FF7A9A" />
        <rect x={66} y={-494} width={8} height={30} rx={4} fill="#FFD23F" />
        <rect x={52} y={-504} width={8} height={8} rx={2} fill="#C23E62" />
        <g transform="translate(-62,-330) rotate(-4)">
          <rect x={-2} y={-34} width={4} height={18} fill="#2A2F5A" />
          <rect x={-26} y={-18} width={52} height={64} rx={6} fill="#F4EEE2" />
          <rect x={-26} y={-18} width={52} height={16} rx={6} fill="#0E1630" />
          <circle cx={0} cy={22} r={13} fill="#D9A23F" />
          <circle cx={0} cy={22} r={6} fill="#0E1630" />
        </g>
        {/* hip pockets */}
        <path d="M-108 -250 L -58 -250" stroke={COAT[3]} strokeWidth={5} strokeLinecap="round" />
        <path d="M60 -250 L 108 -250" stroke={COAT[3]} strokeWidth={5} strokeLinecap="round" />
        {/* hem shadow */}
        <path d="M-132 -152 L 134 -152" stroke={COAT[3]} strokeWidth={6} />
        <path d="M6 -320 L 6 -152" stroke={COAT[3]} strokeWidth={4} />

        {/* ---- front arm (his right, our left) ---- */}
        {pose === "crossed" && <Arm sx={104} sy={-520 - P.lift} a1={P.B[0]} a2={P.B[1]} side={1} />}
        {pose !== "chin" && <Arm sx={-104} sy={-520 - P.lift} a1={P.F[0]} a2={P.F[1]} side={-1} watch />}

        {/* ---- neck ---- */}
        <path d="M-30 -600 L -28 -536 Q 0 -526 28 -536 L 30 -600 Z" fill={SKIN[2]} />
        <path d="M-28 -560 Q 0 -548 28 -560" stroke={SKIN[3]} strokeWidth={5} fill="none" opacity={0.6} />

        {/* ---- head ---- */}
        <g transform="translate(0,-700)">
          {/* ears */}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 108},4)`}>
              <ellipse rx={20} ry={30} fill={sd < 0 ? SKIN[1] : SKIN[2]} />
              <path d={`M${-sd * 2} -16 q ${sd * 10} 14 0 28`} stroke={SKIN[3]} strokeWidth={5} fill="none" strokeLinecap="round" />
            </g>
          ))}
          {/* skull + jaw */}
          <path d="M-104 -70 Q -106 -140 0 -144 Q 106 -140 104 -70 L 102 30 Q 94 118 0 128 Q -94 118 -102 30 Z" fill="url(#d2skin)" />
          <path d="M60 -120 Q 104 -80 102 20 Q 96 100 40 122 Q 86 70 80 -20 Q 76 -90 60 -120 Z" fill={SKIN[2]} opacity={0.55} />
          <path d="M104 -60 L 102 30" stroke={RIM} strokeWidth={4} opacity={0.5} />
          <ellipse cx={-62} cy={34} rx={34} ry={22} fill="url(#d2cheek)" />
          <ellipse cx={62} cy={34} rx={34} ry={22} fill="url(#d2cheek)" />
          {/* beard (frames the mouth), textured edge */}
          <path d="M-102 10 Q -104 70 -78 104 Q -70 120 -56 116 Q -46 132 -30 128 Q -16 142 0 136 Q 16 142 30 128 Q 46 132 56 116 Q 70 120 78 104 Q 104 70 102 10 Q 96 40 76 50 Q 60 92 0 96 Q -60 92 -76 50 Q -96 40 -102 10 Z" fill="url(#d2hair)" />
          {/* mouth: expression shape, plus talk flap */}
          {talk || E.mouth === "rest" ? (
            <>
              <path d={`M-30 66 Q 0 ${58 - open * 4} 30 66 Q 0 ${76 + open * 18} -30 66 Z`} fill="#6A2A30" />
              {open > 0.2 && <path d={`M-18 ${72 + open * 6} Q 0 ${82 + open * 10} 18 ${72 + open * 6}`} fill="#E86A7A" opacity={0.8} />}
              <path d="M-26 68 Q 0 84 26 68" stroke="#C86A64" strokeWidth={5} fill="none" opacity={0.9} />
            </>
          ) : E.mouth === "smile" ? (
            <>
              <path d="M-38 60 Q 0 104 38 60 Q 0 78 -38 60 Z" fill="#6A2A30" />
              <path d="M-28 64 Q 0 76 28 64 L 26 70 Q 0 80 -26 70 Z" fill="#FFFFFF" />
              <path d="M-34 66 Q 0 104 34 66" stroke="#C86A64" strokeWidth={5} fill="none" />
            </>
          ) : E.mouth === "o" ? (
            <>
              <ellipse cx={0} cy={76} rx={17} ry={22} fill="#6A2A30" />
              <ellipse cx={0} cy={86} rx={10} ry={8} fill="#E86A7A" opacity={0.8} />
              <ellipse cx={0} cy={76} rx={19} ry={24} fill="none" stroke="#C86A64" strokeWidth={4} />
            </>
          ) : E.mouth === "smirk" ? (
            <path d="M-26 72 Q 4 74 30 60" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : E.mouth === "flat" ? (
            <path d="M-26 70 L 26 70" stroke="#6A2A30" strokeWidth={7} strokeLinecap="round" />
          ) : E.mouth === "hmm" ? (
            <path d="M4 70 Q 16 64 28 68" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M-26 76 Q 0 62 26 76" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          )}
          {/* moustache */}
          <path d="M-46 58 Q -24 36 0 50 Q 24 36 46 58 Q 30 56 0 62 Q -30 56 -46 58 Z" fill={HAIR[1]} />
          <path d="M-36 50 q 14 -8 28 0 M8 50 q 14 -8 28 0" stroke={HAIR[0]} strokeWidth={3} fill="none" opacity={0.8} />
          {/* beard strand highlights */}
          {[[-74, 64, -60, 92], [-46, 84, -40, 108], [44, 86, 38, 108], [72, 66, 60, 92], [-14, 100, -10, 118], [16, 100, 12, 118]].map(([a, b, c2, d], i) => (
            <path key={i} d={`M${a} ${b} Q ${(a + c2) / 2 + 4} ${(b + d) / 2} ${c2} ${d}`} stroke={HAIR[0]} strokeWidth={3} fill="none" opacity={0.85} strokeLinecap="round" />
          ))}
          {/* nose: shadow side + highlight */}
          <path d="M-6 -8 Q -16 22 -20 34 Q -6 44 8 40 Q 22 36 16 26 Q 10 14 6 -8 Z" fill={SKIN[2]} />
          <path d="M-4 -6 Q -10 18 -12 30 Q -4 36 4 34" stroke={SKIN[0]} strokeWidth={4} fill="none" opacity={0.8} />
          <ellipse cx={-10} cy={36} rx={5} ry={3} fill={SKIN[3]} />
          <ellipse cx={10} cy={36} rx={5} ry={3} fill={SKIN[3]} />
          {/* eyes: sclera, iris, pupil, lid */}
          {[-44, 44].map((ex) => (
            <g key={ex} transform={`translate(${ex},-14)`}>
              <g transform={`scale(1,${blink * E.eye})`}>
                <path d="M-20 0 Q 0 -16 20 0 Q 0 14 -20 0 Z" fill="#FFFFFF" />
                <circle cx={(look + (E.side ?? 0)) * 6} cy={-(E.up ?? 0)} r={9} fill="#6A4A2A" />
                <circle cx={(look + (E.side ?? 0)) * 6} cy={-(E.up ?? 0)} r={5} fill="#1B1240" />
                <circle cx={(look + (E.side ?? 0)) * 6 - 3} cy={-3 - (E.up ?? 0)} r={2.5} fill="#FFFFFF" />
              </g>
              {E.lid > 0 && <path d={`M-22 -2 Q 0 -20 22 -2 L 22 ${-2 + E.lid * 16} Q 0 ${-20 + E.lid * 22} -22 ${-2 + E.lid * 16} Z`} fill={SKIN[1]} />}
              <path d={`M-22 ${-2 + E.lid * 14} Q 0 ${-20 + E.lid * 20} 22 ${-2 + E.lid * 14}`} stroke="#5A3A2A" strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          ))}
          {/* brows: tapered, per-side lift and tilt from the expression */}
          <g transform={`translate(0,${-E.bl - brow}) rotate(${E.tl},-46,-46)`}>
            <path d="M-70 -44 Q -48 -56 -22 -48 L -24 -40 Q -48 -46 -68 -36 Z" fill={HAIR[2]} />
          </g>
          <g transform={`translate(0,${-E.br - brow}) rotate(${-E.tr},46,-46)`}>
            <path d="M70 -44 Q 48 -56 22 -48 L 24 -40 Q 48 -46 68 -36 Z" fill={HAIR[2]} />
          </g>
          {E.mouth === "smile" && <><ellipse cx={-62} cy={30} rx={30} ry={18} fill="url(#d2cheek)" /><ellipse cx={62} cy={30} rx={30} ry={18} fill="url(#d2cheek)" /></>}
          {/* glasses: thinner frames, lens tint + reflection */}
          {[-44, 44].map((gx) => (
            <g key={gx} transform={`translate(${gx},-12)`}>
              <rect x={-34} y={-24} width={68} height={46} rx={14} fill="#BFE8FF" opacity={0.18} />
              <rect x={-34} y={-24} width={68} height={46} rx={14} fill="none" stroke="#1B1240" strokeWidth={5} />
              <path d="M-22 -14 L -6 -22 M-24 -2 L -2 -16" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
            </g>
          ))}
          <path d="M-10 -14 Q 0 -20 10 -14" stroke="#1B1240" strokeWidth={5} fill="none" />
          <path d="M-78 -18 L -104 -12 M78 -18 L 104 -12" stroke="#1B1240" strokeWidth={4} />
          {/* hair: base mass, underside, strands, grey temples */}
          <path d="M-108 -40 Q -122 -154 -6 -168 Q 116 -164 110 -40 Q 100 -104 54 -118 Q 4 -100 -56 -120 Q -100 -104 -108 -40 Z" fill="url(#d2hair)" />
          <path d="M-108 -40 Q -104 -86 -92 -104 L -86 -40 Z" fill="url(#d2temple)" />
          <path d="M110 -40 Q 106 -86 94 -104 L 88 -40 Z" fill="url(#d2temple)" />
          <path d="M-70 -140 Q -10 -168 58 -146" stroke={HAIR[0]} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.9} />
          <path d="M-40 -128 Q 0 -146 40 -132 M-84 -110 Q -70 -132 -44 -140" stroke={HAIR[0]} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
          <path d="M-58 -150 Q -30 -176 6 -170" stroke="#9A6A48" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
          <path d="M100 -100 Q 112 -70 110 -40" stroke={RIM} strokeWidth={4} fill="none" opacity={0.5} />
        </g>
        {pose === "chin" && <Arm sx={-104} sy={-520 - P.lift} a1={P.F[0]} a2={P.F[1]} side={-1} watch />}
      </g>
    </g>
  );
};
