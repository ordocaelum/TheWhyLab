// Characters, following STYLING §3 (3+ tones each) and §5 (mascot rules).
import React from "react";
import { Grad } from "./gen";

const Eye: React.FC<{ x: number; y: number; r: number; blink?: number; look?: number; dark?: string }> = ({ x, y, r, blink = 1, look = 0, dark = "#1B1240" }) => (
  <g transform={`translate(${x},${y}) scale(1,${blink})`}>
    <ellipse rx={r} ry={r * 1.15} fill="#FFFFFF" />
    <ellipse cx={look * r * 0.3} cy={r * 0.1} rx={r * 0.72} ry={r * 0.82} fill={dark} />
    <circle cx={-r * 0.25 + look * r * 0.3} cy={-r * 0.35} r={r * 0.3} fill="#FFFFFF" />
    <circle cx={r * 0.3 + look * r * 0.3} cy={r * 0.35} r={r * 0.12} fill="#FFFFFF" opacity={0.9} />
  </g>
);

const blinkAt = (f: number, period = 85) => (f % period > period - 5 ? 0.1 : 1);

// "Cell": our immune-cell mascot. Soft round blob, teal, big eyes, stubby arms. ~400 wide at s=1, origin = centre.
export const Cell: React.FC<{ x: number; y: number; s?: number; f: number; mood?: "happy" | "alert" | "worried"; look?: number; wave?: boolean }> = ({
  x, y, s = 1, f, mood = "happy", look = 0, wave = false,
}) => {
  const wob = Math.sin(f / 9);
  const sq = 1 + wob * 0.025;
  const mouth =
    mood === "happy" ? "M-40 48 Q 0 86 40 48" : mood === "alert" ? "M-22 58 Q 0 40 22 58 Q 0 84 -22 58 Z" : "M-36 66 Q 0 44 36 66";
  return (
    <g transform={`translate(${x},${y}) scale(${s * sq},${s / sq})`}>
      <ellipse cx={0} cy={200} rx={150} ry={22} fill="#000" opacity={0.25} />
      {/* arms */}
      <ellipse cx={-185} cy={40} rx={46} ry={34} fill="#17A6A0" transform={`rotate(${-20 + wob * 6},-185,40)`} />
      <ellipse cx={185} cy={40} rx={46} ry={34} fill="#17A6A0" transform={`rotate(${wave ? -60 + Math.sin(f / 3) * 25 : 20 - wob * 6},185,40)`} />
      <defs><Grad id="cellBody" c="#2ED3C6" angle={50} /></defs>
      {/* body: base, core shadow, lit face, rim, specular */}
      <path d="M0 -190 C 130 -190 200 -100 200 10 C 200 130 120 190 0 190 C -120 190 -200 130 -200 10 C -200 -100 -130 -190 0 -190 Z" fill="#139A9A" />
      <path d="M-10 -182 C 115 -182 182 -95 182 5 C 182 115 108 170 -10 170 C -125 170 -190 115 -190 5 C -190 -95 -125 -182 -10 -182 Z" fill="url(#cellBody)" />
      <ellipse cx={-60} cy={-80} rx={110} ry={80} fill="#6FF0E2" opacity={0.55} />
      <path d="M-150 -90 Q -120 -160 -40 -175" stroke="#C9FFF8" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.85} />
      <ellipse cx={-95} cy={-120} rx={30} ry={18} fill="#FFFFFF" opacity={0.7} transform="rotate(-30,-95,-120)" />
      {/* nucleus speckles = texture detail */}
      {[[60, 110, 14], [100, 70, 9], [-120, 90, 10], [130, -40, 8]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#139A9A" opacity={0.6} />
      ))}
      {/* face */}
      <Eye x={-58} y={-20} r={38} blink={blinkAt(f)} look={look} />
      <Eye x={58} y={-20} r={38} blink={blinkAt(f)} look={look} />
      <ellipse cx={-110} cy={36} rx={26} ry={14} fill="#FF7A9A" opacity={0.45} />
      <ellipse cx={110} cy={36} rx={26} ry={14} fill="#FF7A9A" opacity={0.45} />
      <path d={mouth} stroke="#0E3A4A" strokeWidth={9} strokeLinecap="round" fill={mood === "alert" ? "#0E3A4A" : "none"} />
      {mood === "worried" && <path d="M150 -120 q 14 26 0 40 q -14 -14 0 -40 Z" fill="#B8FFFA" />}
    </g>
  );
};

// Germ: lime rod-shaped bacterium, smug face, little flagella. Origin = centre, ~360 wide.
export const Germ: React.FC<{ x: number; y: number; s?: number; f: number; shrug?: number; rot?: number }> = ({ x, y, s = 1, f, shrug = 0, rot = 0 }) => {
  const wig = Math.sin(f / 5);
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot + wig * 2})`}>
      <ellipse cx={0} cy={120} rx={150} ry={18} fill="#000" opacity={0.25} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${sd * 170} 0 q ${sd * 40} ${-30 + wig * 20} ${sd * 80} 0 t ${sd * 70} ${10 - wig * 15}`} stroke="#7BC93A" strokeWidth={10} strokeLinecap="round" fill="none" />
      ))}
      {/* shrug arms */}
      {[-1, 1].map((sd) => (
        <path key={`a${sd}`} d={`M${sd * 110} 30 Q ${sd * 170} ${10 - shrug * 70} ${sd * 150} ${-20 - shrug * 90}`} stroke="#5FAE24" strokeWidth={22} strokeLinecap="round" fill="none" />
      ))}
      <defs><Grad id="germBody" c="#8FE04A" angle={60} /></defs>
      <rect x={-175} y={-95} width={350} height={190} rx={95} fill="#5FAE24" />
      <rect x={-170} y={-95} width={330} height={170} rx={85} fill="url(#germBody)" />
      <rect x={-130} y={-80} width={200} height={26} rx={13} fill="#D8FF9A" opacity={0.75} />
      {[[-110, 40], [90, 30], [20, 55]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={10} fill="#5FAE24" />)}
      {/* smug half-lidded eyes */}
      <g>
        <Eye x={-45} y={-8} r={26} look={0.4} dark="#1D3A0A" />
        <Eye x={45} y={-8} r={26} look={0.4} dark="#1D3A0A" />
        <rect x={-75} y={-42} width={60} height={26} fill="#8FE04A" />
        <rect x={15} y={-42} width={60} height={26} fill="#8FE04A" />
      </g>
      <path d={shrug > 0.5 ? "M-24 44 L 24 44" : "M-26 40 Q 4 62 30 34"} stroke="#1D3A0A" strokeWidth={8} strokeLinecap="round" fill="none" />
    </g>
  );
};

// Human: faceless capsule style. sick = droopy, pale-green tint. Origin = feet centre.
export const Human: React.FC<{ x: number; y: number; s?: number; f: number; sick?: boolean; shirt?: string }> = ({ x, y, s = 1, f, sick = false, shirt = "#3FC1C9" }) => {
  const breathe = Math.sin(f / 14) * 3;
  const skin = sick ? ["#C9C49A", "#E4E0B8"] : ["#E8C9A8", "#FFE4C9"];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={80} ry={16} fill="#000" opacity={0.3} />
      <rect x={-32} y={-110} width={28} height={115} rx={14} fill="#2B2470" />
      <rect x={4} y={-110} width={28} height={115} rx={14} fill="#3B33A0" />
      <rect x={-52} y={-290 - breathe} width={104} height={200 + breathe} rx={50} fill={shirt} filter="brightness(0.8)" />
      <rect x={-52} y={-290 - breathe} width={68} height={200 + breathe} rx={34} fill={shirt} />
      <rect x={-42} y={-270 - breathe} width={10} height={140} rx={5} fill="#FFFFFF" opacity={0.4} />
      <g transform={`translate(0,${-355 - breathe}) rotate(${sick ? 8 : 0})`}>
        <circle r={64} fill={skin[0]} />
        <circle cx={-8} cy={-6} r={56} fill={skin[1]} />
        <ellipse cx={-28} cy={-30} rx={15} ry={9} fill="#FFFFFF" opacity={0.55} />
      </g>
    </g>
  );
};

// "Doc": adult scientist host. Stylized but grown-up: ~30% head, beard, square jaw, rectangular glasses.
// Origin = feet centre, ~760 tall at s=1.
export const Scientist: React.FC<{ x: number; y: number; s?: number; f: number; talk?: boolean; point?: number; look?: number }> = ({
  x, y, s = 1, f, talk = false, point = 0, look = 0,
}) => {
  const bob = Math.sin(f / 14) * 3;
  const mouth = talk ? 4 + Math.abs(Math.sin(f / 2.5)) * 10 : 3;
  const blink = f % 95 > 90 ? 0.1 : 1;
  const brow = talk ? Math.sin(f / 6) * 3 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={130} ry={18} fill="#000" opacity={0.3} />
      {/* legs + shoes */}
      <rect x={-52} y={-250} width={44} height={250} rx={20} fill="#2B2470" />
      <rect x={8} y={-250} width={44} height={250} rx={20} fill="#3B33A0" />
      <ellipse cx={-34} cy={-6} rx={46} ry={18} fill="#3A2A2A" />
      <ellipse cx={34} cy={-6} rx={46} ry={18} fill="#4A3636" />
      <g transform={`translate(0,${bob})`}>
        {/* lab coat (long, to the knee) */}
        <path d="M-110 -150 L -100 -470 Q -90 -540 0 -545 Q 90 -540 100 -470 L 110 -150 Z" fill="#C9C2E8" />
        <path d="M-104 -156 L -96 -466 Q -86 -530 -6 -534 Q 70 -530 80 -466 L 84 -156 Z" fill="#F4F1FF" />
        {/* shirt + tie */}
        <path d="M-34 -534 L 0 -440 L 34 -534 Z" fill="#DDEBFF" />
        <path d="M-10 -520 L 10 -520 L 16 -400 L 0 -380 L -16 -400 Z" fill="#3FC1C9" />
        {/* lapels */}
        <path d="M-34 -534 L -6 -420 L -60 -470 Z" fill="#E2DCF7" />
        <path d="M34 -534 L 6 -420 L 60 -470 Z" fill="#D6CEF0" />
        <rect x={40} y={-420} width={44} height={40} rx={8} fill="#E2DCF7" />
        <rect x={48} y={-444} width={8} height={32} rx={4} fill="#FF7A9A" />
        <rect x={62} y={-440} width={8} height={28} rx={4} fill="#FFD23F" />
        <path d="M-90 -470 Q -100 -330 -94 -180" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8} />
        {/* arms */}
        <rect x={-150} y={-500} width={44} height={230} rx={22} fill="#E2DCF7" transform="rotate(8,-128,-500)" />
        <circle cx={-148} cy={-268} r={24} fill="#D9A27A" />
        <g transform={`rotate(${-10 - point * 100},120,-500)`}>
          <rect x={98} y={-500} width={44} height={230} rx={22} fill="#F4F1FF" />
          <circle cx={120} cy={-266} r={24} fill="#E8B48A" />
        </g>
        {/* neck */}
        <rect x={-26} y={-580} width={52} height={60} rx={20} fill="#D9A27A" />
        {/* head: squarer jaw */}
        <g transform="translate(0,-690)">
          <ellipse cx={-112} cy={10} rx={18} ry={28} fill="#D9A27A" />
          <ellipse cx={112} cy={10} rx={18} ry={28} fill="#D9A27A" />
          <path d="M-108 -60 Q -110 -130 0 -132 Q 110 -130 108 -60 L 104 50 Q 96 120 0 128 Q -96 120 -104 50 Z" fill="#D9A27A" />
          <path d="M-100 -62 Q -100 -122 -6 -124 Q 96 -122 96 -62 L 92 44 Q 84 108 -6 116 Q -88 108 -96 44 Z" fill="#E8B48A" />
          {/* beard */}
          <path d="M-100 20 Q -96 120 0 132 Q 96 120 100 20 Q 80 70 40 64 Q 0 80 -40 64 Q -80 70 -100 20 Z" fill="#5A3A26" />
          <path d="M-40 64 Q 0 54 40 64 Q 20 44 0 48 Q -20 44 -40 64 Z" fill="#5A3A26" />
          {/* hair with grey temples */}
          <path d="M-112 -40 Q -124 -150 -10 -160 Q 110 -160 112 -40 Q 100 -100 50 -110 Q 0 -96 -60 -112 Q -100 -100 -112 -40 Z" fill="#4A2E1E" />
          <path d="M-112 -40 Q -114 -80 -100 -96 L -98 -40 Z" fill="#B9B2AA" />
          <path d="M112 -40 Q 114 -80 100 -96 L 98 -40 Z" fill="#B9B2AA" />
          <path d="M-60 -130 Q 0 -150 60 -134" stroke="#6A4430" strokeWidth={12} strokeLinecap="round" fill="none" />
          {/* eyebrows */}
          <rect x={-74} y={-48 - brow} width={50} height={12} rx={6} fill="#3A2216" transform={`rotate(-6,-49,-42)`} />
          <rect x={24} y={-48 - brow} width={50} height={12} rx={6} fill="#3A2216" transform={`rotate(6,49,-42)`} />
          {/* rectangular glasses */}
          {[-50, 50].map((ex) => (
            <g key={ex} transform={`translate(${ex},-8)`}>
              <rect x={-38} y={-26} width={76} height={52} rx={14} fill="#FFFFFF" opacity={0.22} />
              <rect x={-38} y={-26} width={76} height={52} rx={14} fill="none" stroke="#1B1240" strokeWidth={8} />
              <g transform={`scale(1,${blink})`}>
                <ellipse cx={look * 8} cy={2} rx={9} ry={11} fill="#1B1240" />
                <circle cx={-3 + look * 8} cy={-3} r={4} fill="#FFFFFF" />
              </g>
              <path d="M-26 -16 L -12 -22" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
            </g>
          ))}
          <rect x={-12} y={-12} width={24} height={7} rx={3} fill="#1B1240" />
          {/* nose + mouth */}
          <path d="M-6 6 Q -14 40 0 46 Q 12 44 10 36" stroke="#C48A62" strokeWidth={7} strokeLinecap="round" fill="none" />
          <ellipse cx={0} cy={78} rx={18} ry={mouth} fill="#5A1A24" />
        </g>
      </g>
    </g>
  );
};
