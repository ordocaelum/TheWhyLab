// Lab robot sidekick (v1). Hovering brass-and-navy bot with a screen face. Origin = hover point under the body.
// talk: mouth waveform on the screen. mood: face. look: -1..1 eye offset.
import React from "react";
import { shade } from "./gen";

export type BotMood = "happy" | "smug" | "alert" | "sad";
const BRASS = ["#A8721F", "#D9A23F", "#F4CF7A"];
const NAVY = "#24345E";

export const Robot: React.FC<{ x: number; y: number; s?: number; f: number; talk?: boolean; mood?: BotMood; look?: number; wave?: boolean }> = ({
  x, y, s = 1, f, talk = false, mood = "happy", look = 0, wave = false,
}) => {
  const bob = Math.sin(f / 10) * 10;
  const ex = look * 14;
  const blink = f % 110 < 4;
  const face = "#7FE8FF";
  const mouth = talk
    ? `M-50 60 ${Array.from({ length: 10 }, (_, i) => `L ${-50 + (i + 1) * 10} ${60 + Math.sin(f * 1.3 + i * 1.7) * (8 + (i % 3) * 5)}`).join(" ")}`
    : mood === "sad" ? "M-34 70 Q 0 46 34 70" : mood === "smug" ? "M-30 58 Q 10 72 38 50" : mood === "alert" ? "M-14 60 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" : "M-36 52 Q 0 84 36 52";
  const armL = 20 + Math.sin(f / 14) * 6;
  const waveA = 140 + Math.sin(f / 4) * 22; // up and out, away from the body
  const Arm = ({ a }: { a: number }) => (
    <g transform={`translate(-112,-150) rotate(${a})`}>
      <rect x={-16} y={0} width={32} height={110} rx={16} fill={BRASS[0]} />
      <rect x={-8} y={8} width={8} height={90} rx={4} fill={BRASS[2]} opacity={0.5} />
      <circle cx={0} cy={120} r={24} fill={BRASS[1]} /><path d="M-14 132 l -8 18 M14 132 l 8 18" stroke={BRASS[0]} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* hover glow + shadow (shadow stays on the floor) */}
      <ellipse cx={0} cy={40 - bob * 0} rx={110 - bob} ry={16} fill="#000" opacity={0.3} />
      <g transform={`translate(0,${-60 + bob})`}>
        <ellipse cx={0} cy={0} rx={60} ry={20} fill="#7FE8FF" opacity={0.35 + 0.15 * Math.sin(f / 3)} />
        {/* arms */}
        {!wave && <Arm a={armL} />}
        <g transform={`translate(112,-150) rotate(${-20 - Math.sin(f / 14) * 6})`}>
          <rect x={-16} y={0} width={32} height={110} rx={16} fill={BRASS[0]} />
          <circle cx={0} cy={120} r={24} fill={BRASS[1]} /><path d="M-14 132 l -8 18 M14 132 l 8 18" stroke={BRASS[0]} strokeWidth={8} strokeLinecap="round" />
        </g>
        {/* body: rounded capsule */}
        <path d="M-110 -200 Q -120 -20 -40 -10 L 40 -10 Q 120 -20 110 -200 Z" fill={NAVY} />
        <path d="M-96 -196 Q -104 -40 -36 -26 L -10 -26 Q -70 -60 -70 -196 Z" fill="#FFFFFF" opacity={0.1} />
        <rect x={-112} y={-210} width={224} height={22} rx={11} fill={BRASS[1]} />
        <circle cx={0} cy={-110} r={34} fill={shade(NAVY, -0.3)} stroke={BRASS[1]} strokeWidth={6} />
        <circle cx={0} cy={-110} r={18} fill={talk ? "#FFD23F" : "#3FE0B0"} opacity={0.7 + 0.3 * Math.sin(f / 4)} />
        {[-70, 70].map((bx) => <circle key={bx} cx={bx} cy={-150} r={7} fill={BRASS[2]} />)}
        {wave && <Arm a={waveA} />}
        {/* neck + head */}
        <rect x={-24} y={-240} width={48} height={36} rx={10} fill={BRASS[0]} />
        <g transform={`rotate(${look * 4},0,-330)`}>
          <rect x={-150} y={-440} width={300} height={210} rx={70} fill={BRASS[1]} />
          <rect x={-150} y={-440} width={300} height={70} rx={60} fill={BRASS[2]} opacity={0.45} />
          <rect x={-130} y={-420} width={260} height={170} rx={56} fill="#0B1A33" />
          {/* screen face */}
          <g transform="translate(0,-345)">
            <rect x={-120} y={-66} width={240} height={150} rx={50} fill={face} opacity={0.08} />
            {blink ? (
              [-48, 48].map((e) => <rect key={e} x={e + ex - 20} y={-8} width={40} height={8} rx={4} fill={face} />)
            ) : mood === "smug" ? (
              [-48, 48].map((e) => <path key={e} d={`M${e + ex - 22} -2 Q ${e + ex} -24 ${e + ex + 22} -2`} stroke={face} strokeWidth={10} fill="none" strokeLinecap="round" />)
            ) : (
              [-48, 48].map((e) => <ellipse key={e} cx={e + ex} cy={-6} rx={mood === "alert" ? 20 : 17} ry={mood === "sad" ? 16 : 24} fill={face} />)
            )}
            {mood === "sad" && [-48, 48].map((e) => <path key={e} d={`M${e - 24} -40 l 40 ${e < 0 ? 10 : -10}`} transform={e > 0 ? `scale(-1,1) translate(${-2 * e},0)` : undefined} stroke={face} strokeWidth={7} strokeLinecap="round" />)}
            <path d={mouth} transform="translate(0,-14)" stroke={face} strokeWidth={8} fill={mood === "alert" && !talk ? face : "none"} strokeLinecap="round" strokeLinejoin="round" />
            <rect x={-100} y={-60} width={70} height={14} rx={7} fill="#FFFFFF" opacity={0.12} />
          </g>
          {/* ear bolts + antenna */}
          {[-1, 1].map((k) => <g key={k}><rect x={k * 150 - 14} y={-370} width={28} height={70} rx={12} fill={BRASS[0]} /><circle cx={k * 162} cy={-335} r={8} fill={BRASS[2]} /></g>)}
          <path d={`M0 -440 Q ${8 + Math.sin(f / 6) * 10} -480 0 -510`} stroke={BRASS[0]} strokeWidth={8} fill="none" />
          <circle cx={0} cy={-516} r={16} fill={talk ? "#FFD23F" : "#FF4D6D"} />
          <circle cx={0} cy={-516} r={34} fill={talk ? "#FFD23F" : "#FF4D6D"} opacity={0.2 + 0.15 * Math.sin(f / 3)} />
        </g>
      </g>
    </g>
  );
};
