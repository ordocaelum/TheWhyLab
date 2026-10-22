// The Lab (home set, SHOW.md §3), its machines (§4), and Doc's presenter overlay (§2).
import React from "react";
import { AbsoluteFill } from "remotion";
import { DocExpr, DocV2 } from "./doc2";
import { H, sp, W } from "./kit";
import { useAbsFrame, useTalking } from "./timing";

const NAVY = ["#0B1228", "#16224A", "#24345E", "#33477A"];
const BRASS = ["#A8721F", "#D9A23F", "#F4CF7A"];

const Jar: React.FC<{ x: number; y: number; c: string; h?: number; f: number }> = ({ x, y, c, h = 90, f }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-26} y={-h} width={52} height={h} rx={14} fill="#CFE6FF" opacity={0.25} />
    <rect x={-22} y={-h * 0.62} width={44} height={h * 0.58} rx={10} fill={c} opacity={0.85} />
    <circle cx={-6} cy={-h * 0.4 - (f % 60) * 0.4} r={4} fill="#FFFFFF" opacity={0.6} />
    <rect x={-28} y={-h - 10} width={56} height={14} rx={6} fill={BRASS[1]} />
    <rect x={-18} y={-h + 6} width={8} height={h - 20} rx={4} fill="#FFFFFF" opacity={0.3} />
  </g>
);

// Big brass microscope. Origin = base centre.
export const Microscope: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={22} fill="#000" opacity={0.3} />
    <rect x={-150} y={-40} width={300} height={44} rx={20} fill={BRASS[0]} />
    <rect x={-150} y={-44} width={300} height={24} rx={12} fill={BRASS[1]} />
    <path d="M60 -40 C 110 -160 100 -280 20 -360" stroke={BRASS[0]} strokeWidth={56} fill="none" strokeLinecap="round" />
    <path d="M60 -44 C 104 -160 94 -276 18 -352" stroke={BRASS[1]} strokeWidth={36} fill="none" strokeLinecap="round" />
    <rect x={-110} y={-150} width={170} height={24} rx={10} fill="#2A2F5A" />
    <g transform="rotate(-28,-30,-330)">
      <rect x={-80} y={-470} width={100} height={260} rx={40} fill={BRASS[0]} />
      <rect x={-74} y={-470} width={64} height={260} rx={30} fill={BRASS[1]} />
      <rect x={-64} y={-460} width={12} height={230} rx={6} fill={BRASS[2]} opacity={0.8} />
      <rect x={-60} y={-530} width={60} height={70} rx={20} fill="#2A2F5A" />
      <rect x={-70} y={-225} width={80} height={60} rx={16} fill="#2A2F5A" />
      <circle cx={-30} cy={-160} r={20} fill="#7FE8FF" opacity={0.4 + glow * 0.6} />
      {glow > 0 && <circle cx={-30} cy={-160} r={60 + glow * 40} fill="#7FE8FF" opacity={0.25 * glow} />}
    </g>
    <circle cx={70} cy={-200} r={30} fill={BRASS[0]} />
    <circle cx={64} cy={-206} r={20} fill={BRASS[2]} />
  </g>
);

// Static home set. zoom/pan let scenes reuse it with different "camera angles".
export const Lab: React.FC<{ zoom?: number; cx?: number; cy?: number; lights?: number; children?: React.ReactNode }> = ({
  zoom = 1, cx = W / 2, cy = H / 2, lights = 1, children,
}) => {
  const f = useAbsFrame();
  return (
    <AbsoluteFill style={{ background: NAVY[0], overflow: "hidden" }}>
      <svg width={W} height={H} style={{ transform: `scale(${zoom})`, transformOrigin: `${(cx / W) * 100}% ${(cy / H) * 100}%` }}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={NAVY[1]} />
            <stop offset="1" stopColor={NAVY[2]} />
          </linearGradient>
          <radialGradient id="lamp">
            <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFE2A8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="labvig" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {/* back wall with wainscot + brass trim */}
        <rect width={W} height={H} fill="url(#wall)" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={4} height={700} fill="#000" opacity={0.08} />)}
        <rect x={0} y={700} width={W} height={20} fill={BRASS[1]} />
        <rect x={0} y={720} width={W} height={360} fill={NAVY[0]} />
        {/* window with night sky */}
        <g transform="translate(1340,90)">
          <rect x={-14} y={-14} width={428} height={388} rx={24} fill={BRASS[0]} />
          <rect x={0} y={0} width={400} height={360} rx={16} fill="#1B1440" />
          <circle cx={290} cy={100} r={46} fill="#FFF2C4" />
          <circle cx={290} cy={100} r={90} fill="#FFF2C4" opacity={0.08} />
          {[[60, 60], [150, 130], [90, 250], [330, 260], [220, 40]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={3} fill="#CFD8FF" opacity={0.5 + 0.4 * Math.sin(f / 20 + i)} />
          ))}
          <rect x={196} y={0} width={10} height={360} fill={BRASS[0]} />
          <rect x={0} y={176} width={400} height={10} fill={BRASS[0]} />
        </g>
        {/* chalkboard with doodles */}
        <g transform="translate(120,120)">
          <rect x={-14} y={-14} width={608} height={378} rx={18} fill="#5A3A26" />
          <rect x={0} y={0} width={580} height={350} rx={10} fill="#1E3A34" />
          <g stroke="#E8F2EC" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round">
            <path d="M60 80 q 40 -50 80 0 t 80 0" />
            <circle cx={380} cy={110} r={50} />
            <path d="M355 110 h 50 M380 85 v 50" />
            <path d="M60 240 h 140 M60 240 l 30 -20 M60 240 l 30 20" />
            <text x={250} y={260} fontFamily="Arial Black" fontSize={56} fill="#E8F2EC" stroke="none">WHY?</text>
            <path d="M470 200 l 40 60 l -80 0 z" />
          </g>
        </g>
        {/* shelves */}
        <g transform="translate(820,180)">
          {[0, 170].map((sy) => (
            <g key={sy}>
              <rect x={0} y={sy + 120} width={420} height={18} rx={6} fill={BRASS[0]} />
              <rect x={0} y={sy + 120} width={420} height={7} rx={3} fill={BRASS[2]} opacity={0.6} />
            </g>
          ))}
          <Jar x={50} y={120} c="#3FE0B0" f={f} />
          <Jar x={130} y={120} c="#FF7A9A" h={70} f={f} />
          <Jar x={220} y={120} c="#FFD23F" h={110} f={f} />
          {/* tiger plush easter egg */}
          <g transform="translate(330,120)">
            <ellipse cx={0} cy={-34} rx={46} ry={36} fill="#FF8C2A" />
            <circle cx={0} cy={-80} r={34} fill="#FF8C2A" />
            <circle cx={-22} cy={-108} r={12} fill="#FF8C2A" />
            <circle cx={22} cy={-108} r={12} fill="#FF8C2A" />
            <ellipse cx={0} cy={-70} rx={18} ry={12} fill="#FFF4E2" />
            <circle cx={-12} cy={-86} r={5} fill="#2B140A" />
            <circle cx={12} cy={-86} r={5} fill="#2B140A" />
          </g>
          <Jar x={60} y={290} c="#7FB8FF" h={80} f={f} />
          <rect x={140} y={230} width={120} height={60} rx={10} fill="#3B33A0" />
          <rect x={150} y={240} width={100} height={8} rx={4} fill="#9FB0FF" />
          <Jar x={330} y={290} c="#B48CFF" h={100} f={f} />
        </g>
        {/* workbench */}
        <rect x={60} y={760} width={1060} height={40} rx={14} fill={BRASS[0]} />
        <rect x={60} y={760} width={1060} height={14} rx={7} fill={BRASS[2]} opacity={0.6} />
        <rect x={110} y={800} width={40} height={280} fill="#3A2A2A" />
        <rect x={1030} y={800} width={40} height={280} fill="#3A2A2A" />
        <Jar x={200} y={760} c="#3FE0B0" h={110} f={f} />
        <Jar x={290} y={760} c="#FF7A9A" h={80} f={f} />
        <Microscope x={720} y={760} s={0.8} />
        {/* hanging lamps */}
        {[480, 1600].map((lx) => (
          <g key={lx}>
            <rect x={lx - 3} y={0} width={6} height={90} fill="#2A2F5A" />
            <path d={`M${lx - 60} 130 Q ${lx} 60 ${lx + 60} 130 Z`} fill={BRASS[1]} />
            <circle cx={lx} cy={300} r={420} fill="url(#lamp)" opacity={lights} />
          </g>
        ))}
        {children}
        <rect width={W} height={H} fill="#05030F" opacity={(1 - lights) * 0.6} />
        <rect width={W} height={H} fill="url(#labvig)" />
      </svg>
    </AbsoluteFill>
  );
};

// Doc as presenter: waist-up in a bottom corner, mouth synced to his lines.
export const Presenter: React.FC<{ side: "bl" | "br"; enter?: number; expr?: DocExpr }> = ({ side, enter = 0, expr = "neutral" }) => {
  const f = useAbsFrame();
  const talking = useTalking("DOC");
  const pop = sp(f - enter, 0, 13);
  const x = side === "bl" ? 250 : W - 250;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <g transform={`translate(0,${(1 - pop) * 400})`}>
          <DocV2 x={x} y={H + 420} s={0.95} f={f} talk={talking} look={side === "bl" ? 1 : -1} expr={expr} point={talking ? 0.25 + 0.1 * Math.sin(f / 15) : 0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
