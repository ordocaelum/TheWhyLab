import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Cell, Germ } from "./chars";
import { Robot } from "./robot";
import { SickInBed } from "./sickbed";
import { Brain } from "./anatomy";
import { Framer, H, Headline, lerp, Sparkle, sp, Stage, W } from "./kit";
import { CellField, Foliage } from "./gen";

// ---- bedroom set pieces ----
const Window: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(250,140)">
    <rect x={-20} y={-20} width={480} height={420} rx={30} fill="#2A1F5A" />
    <rect x={0} y={0} width={440} height={380} rx={20} fill="#FFE2A8" />
    <rect x={0} y={0} width={440} height={380} rx={20} fill="#FFB86B" opacity={0.35} />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={-6} y={10 + i * 41} width={452} height={22} rx={8} fill="#5A4590" />
    ))}
    {/* light shafts through the blinds */}
    <g opacity={0.12 + 0.03 * Math.sin(f / 20)}>
      {Array.from({ length: 8 }, (_, i) => (
        <polygon key={i} points={`440,${30 + i * 41} 440,${42 + i * 41} 1500,${420 + i * 70} 1500,${380 + i * 70}`} fill="#FFE2A8" />
      ))}
    </g>
  </g>
);

const SickFace: React.FC<{ f: number; open: number }> = ({ f, open }) => (
  <g>
    <circle r={95} fill="#C9C49A" />
    <circle cx={-10} cy={-8} r={84} fill="#E4E0B8" />
    <ellipse cx={-38} cy={-44} rx={20} ry={12} fill="#FFFFFF" opacity={0.5} />
    {[-34, 34].map((ex) => (
      <g key={ex} transform={`translate(${ex},4)`}>
        <ellipse rx={18} ry={16 * open} fill="#1B1240" />
        <rect x={-22} y={-22} width={44} height={22 - 14 * open} fill="#E4E0B8" />
        <path d="M-20 -6 Q 0 -14 20 -6" stroke="#8A8460" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <ellipse cx={0} cy={48} rx={16} ry={6} fill="#8A8460" />
    <path d={`M60 -60 q 10 ${20 + Math.sin(f / 8) * 3} 0 30 q -10 -10 0 -30 Z`} fill="#B8FFFA" opacity={0.9} />
  </g>
);

const Bed: React.FC<{ f: number; open: number }> = ({ f, open }) => {
  const breathe = Math.sin(f / 16) * 6;
  return (
    <g transform="translate(980,760)">
      <ellipse cx={0} cy={210} rx={720} ry={40} fill="#000" opacity={0.3} />
      <rect x={-700} y={20} width={1400} height={190} rx={40} fill="#3B2A7A" />
      <rect x={-700} y={20} width={1400} height={60} rx={30} fill="#5A45A8" />
      <rect x={-760} y={-260} width={90} height={470} rx={40} fill="#2A1F5A" />
      <rect x={-760} y={-260} width={40} height={470} rx={20} fill="#4A3A90" />
      {/* pillow */}
      <ellipse cx={-470} cy={-40} rx={210} ry={95} fill="#C8D0FF" />
      <ellipse cx={-485} cy={-55} rx={190} ry={75} fill="#EEF1FF" />
      {/* head */}
      <g transform={`translate(-430,-90) rotate(-12)`}>
        <SickFace f={f} open={open} />
      </g>
      {/* blanket lump */}
      <path d={`M-330 ${-40 - breathe} C -100 ${-170 - breathe} 300 ${-160 - breathe} 640 -10 L 660 60 L -340 60 Z`} fill="#E0567A" />
      <path d={`M-320 ${-48 - breathe} C -100 ${-160 - breathe} 280 ${-150 - breathe} 600 -20 L 600 0 C 300 ${-120 - breathe} -80 ${-130 - breathe} -320 ${-10 - breathe} Z`} fill="#FF7A9A" />
      <path d={`M-200 ${-110 - breathe} C -40 ${-160 - breathe} 160 ${-160 - breathe} 300 ${-120 - breathe}`} stroke="#FFC2D2" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.8} />
      {[-150, 50, 250, 450].map((x) => <circle key={x} cx={x} cy={-40} r={14} fill="#C23E62" opacity={0.6} />)}
    </g>
  );
};

const Nightstand: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g transform="translate(1660,720)">
    <ellipse cx={0} cy={250} rx={190} ry={22} fill="#000" opacity={0.3} />
    <rect x={-170} y={0} width={340} height={250} rx={30} fill="#2A1F5A" />
    <rect x={-170} y={0} width={340} height={40} rx={20} fill="#5A45A8" />
    <rect x={-120} y={100} width={240} height={14} rx={7} fill="#4A3A90" />
    {children}
  </g>
);

// 1. "You wake up and something is wrong."
const C1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="morning" lx={480} ly={330} rays={false}>
      <Window f={f} />
      <SickInBed id="c1" x={900} y={790} s={0.95} f={f} expr={f < 30 ? "serious" : "unamused"} />
      <Nightstand />
      <Framer d={`M-60 ${H} Q 100 820 40 700 Q 160 760 220 ${H} Z`} />
    </Stage>
  );
};

// 2. "Your head is heavyâ€¦ a mountain."
const C2: React.FC = () => {
  const f = useCurrentFrame();
  const notes = [0, 1, 2, 3].map((i) => sp(f, 30 + i * 10, 9));
  const buzz = Math.sin(f * 2.2) * (f % 40 < 12 ? 6 : 0);
  return (
    <Stage k="morning" lx={1660} ly={600} rays={false} head={<Headline big="EVERYTHING HURTS" top={60} />}>
      <Window f={f} />
      <SickInBed id="c2" x={900} y={790} s={0.95} f={f} expr="unamused" />
      <Nightstand>
        <g transform={`translate(-40,-20) rotate(${buzz})`}>
          <rect x={-55} y={-110} width={110} height={190} rx={20} fill="#1B1240" />
          <rect x={-45} y={-98} width={90} height={160} rx={12} fill="#7FE8FF" />
        </g>
        {/* plate of toast with stink lines */}
        <g transform="translate(80,-10)">
          <ellipse cx={0} cy={0} rx={70} ry={18} fill="#EEF1FF" />
          <rect x={-40} y={-60} width={80} height={60} rx={18} fill="#D99A4A" />
          <rect x={-32} y={-52} width={64} height={44} rx={12} fill="#F2C27A" />
          {[-20, 0, 20].map((x, i) => (
            <path key={x} d={`M${x} -80 q 12 -20 0 -40 q -12 -20 0 -40`} stroke="#9AE04A" strokeWidth={7} fill="none" strokeLinecap="round"
              opacity={0.5 + 0.4 * Math.sin(f / 6 + i)} transform={`translate(0,${-(f % 30) * 0.5})`} />
          ))}
        </g>
      </Nightstand>
      {notes.map((n, i) => (
        <g key={i} transform={`translate(${1500 - i * 30},${560 - i * 95}) scale(${n})`}>
          <rect x={-150} y={-38} width={300} height={76} rx={38} fill="#FFFFFF" />
          <circle cx={-110} cy={0} r={22} fill="#FF7A9A" />
          <rect x={-76} y={-12} width={170} height={24} rx={12} fill="#C8D0FF" />
        </g>
      ))}
    </Stage>
  );
};

// 3. "You probably blame the germ."
const C3: React.FC = () => {
  const f = useCurrentFrame();
  const g = sp(f, 10, 9);
  const arrow = sp(f, 40, 10);
  return (
    <Stage k="alarm" lx={W / 2} ly={600} head={<Headline big="THE GERM?" top={60} />}>
      <CellField seed={51} base="#FF6A5A" far="#2A0508" count={60} />
      <rect width={W} height={H} fill="#2A0508" opacity={0.4} />
      <Germ x={W / 2} y={640 + (1 - g) * 500} s={1.4} f={f} />
      <g transform={`translate(1380,260) scale(${arrow}) rotate(35)`}>
        <rect x={-30} y={0} width={60} height={160} rx={30} fill="#FF4D3D" />
        <polygon points="-80,140 80,140 0,240" fill="#FF4D3D" />
        <rect x={-18} y={10} width={14} height={120} rx={7} fill="#FFFFFF" opacity={0.4} />
      </g>
      <Sparkle x={620} y={420} at={20} size={30} />
      <Sparkle x={1250} y={820} at={32} size={24} />
      <Framer d={`M0 ${H} L0 760 Q 160 820 260 ${H} Z`} />
      <Framer d={`M${W} ${H} L${W} 700 Q ${W - 200} 800 ${W - 300} ${H} Z`} />
    </Stage>
  );
};

// 4. "But here's the strange part. Much of what makes you feel sick isn't the germ at all."
const C4: React.FC = () => {
  const f = useCurrentFrame();
  const shrug = lerp(f, 10, 25, 0, 1);
  const pan = lerp(f, 55, 95, 0, -W * 0.5);
  const brain = sp(f, 90, 10);
  return (
    <Stage k="lab" lx={W * 0.75} ly={500} head={f > 95 ? <Headline big="NOT THE GERM" top={60} /> : undefined}>
      <CellField seed={61} base="#3FA8C9" far="#0B1033" count={60} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.45} />
      <g transform={`translate(${pan},0)`}>
        <Germ x={W * 0.5} y={640} s={1.3} f={f} shrug={shrug} />
        <text x={W * 0.5} y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={160} fill="#D8FF9A" opacity={shrug}>?</text>
        {/* big head silhouette with glowing brain */}
        <g transform={`translate(${W * 1.25},620)`}>
          <circle r={380} fill="#E8C9A8" />
          <circle cx={-30} cy={-30} r={340} fill="#FFE4C9" />
          <ellipse cx={-120} cy={-200} rx={70} ry={40} fill="#FFFFFF" opacity={0.5} />
          <g transform={`translate(0,-40) scale(${0.6 + brain * 0.4})`} opacity={0.3 + brain * 0.7}>
            <circle r={300} fill="url(#bloom)" />
            <Brain id="c4" x={0} y={0} s={0.85} f={f} hypo={brain > 0.5} />
          </g>
        </g>
      </g>
      <Sparkle x={W * 0.72} y={330} at={100} size={34} />
      <Sparkle x={W * 0.86} y={760} at={108} size={26} />
      <Sparkle x={W * 0.6} y={640} at={116} size={22} />
    </Stage>
  );
};

// 5. "It's you. Your own body is doing this to you. On purpose." â†’ title card
const C5: React.FC = () => {
  const f = useCurrentFrame();
  const t = sp(f, 25, 10);
  return (
    <Stage k="dusk" lx={W / 2} ly={560}>
      <Foliage seed={71} base="#4A1470" y0={-100} y1={1180} count={30} scale={[0.7, 1.4]} sway={3} light="#FFD27A" />
      <rect width={W} height={H} fill="#1A0B3D" opacity={0.5} />
      <Robot x={W / 2} y={1020 + (1 - sp(f, 0, 10)) * 600} s={1.05} f={f} wave={f > 40} />
      <g transform={`translate(${W / 2},230) scale(${t})`}>
        <text textAnchor="middle" y={0} fontFamily="Arial Black" fontSize={170} fill="#2A0F5A" dy={14}>SICK ON PURPOSE</text>
        <text textAnchor="middle" y={0} fontFamily="Arial Black" fontSize={170} fill="#FFFFFF">SICK ON PURPOSE</text>
      </g>
      {[[460, 300, 30], [1480, 420, 40], [620, 820, 26], [1320, 860, 30], [1700, 200, 24]].map(([x, y, s], i) => (
        <Sparkle key={i} x={x} y={y} at={30 + i * 7} size={s} color={i % 2 ? "#FFD27A" : "#FFFFFF"} />
      ))}
      <Framer d={`M0 ${H} L0 820 Q 200 860 360 ${H} Z`} color="#1A0B3D" />
      <Framer d={`M${W} ${H} L${W} 800 Q ${W - 220} 860 ${W - 380} ${H} Z`} color="#1A0B3D" />
    </Stage>
  );
};

export const COLD_OPEN = [C1, C2, C3, C4, C5];
export const COLD_OPEN_DUR = [90, 180, 120, 150, 150];

export const ColdOpen: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      {COLD_OPEN.map((S, i) => {
        const from = at;
        at += COLD_OPEN_DUR[i];
        return (
          <Sequence key={i} from={from} durationInFrames={COLD_OPEN_DUR[i]}>
            <S />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
