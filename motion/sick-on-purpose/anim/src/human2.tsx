// Human v2: general supporting/hero-tier human built on Doc's approved construction (doc2.tsx).
// Every look is a config (Look). Expressions and poses are shared with Doc (EXPR / POSE).
import React from "react";
import { DocExpr, DocPose, EXPR, POSE } from "./doc2";

export type Look = {
  id: string; // unique per avatar (gradient ids)
  skin: [string, string, string, string]; // light, base, shade, deep
  hair: [string, string, string]; // light, base, dark
  hairStyle: "short" | "fade" | "sidepart" | "curlyShort" | "afroPuff" | "longStraight" | "wavyShoulder" | "ponytail" | "bun" | "braid";
  facial?: "none" | "beard" | "stubble" | "goatee" | "moustache";
  glasses?: boolean;
  eyes?: "round" | "almond" | "monolid";
  iris?: string;
  build: "m" | "f";
  top: string; // outfit colour
  topStyle: "tee" | "shirt" | "hoodie" | "blouse" | "cardigan";
  under?: string; // undershirt colour (cardigan)
  pants: string;
  shoes?: string;
  earrings?: string;
  lips?: string;
};

const sh = (c: string, t: number) => {
  const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const o = t < 0 ? v.map((x) => x * (1 + t)) : v.map((x) => x + (255 - x) * t);
  return "#" + o.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
};
const RIM = "#5FF0E8";

// ---------- arm (same rig as Doc, parameterised colours) ----------
const Arm: React.FC<{ L: Look; sx: number; sy: number; a1: number; a2: number; side: 1 | -1; back?: boolean; short?: boolean }> = ({ L, sx, sy, a1, a2, side, back, short }) => {
  const up = 170, fore = 155;
  const sleeve = back ? sh(L.top, -0.18) : `url(#sl_${L.id})`;
  const skinF = `url(#hs_${L.id})`;
  return (
    <g transform={`translate(${sx},${sy}) rotate(${a1})`}>
      <path d={`M-30 0 Q -34 ${up / 2} -26 ${up} L 26 ${up} Q 34 ${up / 2} 30 0 Z`} fill={short ? sleeve : sleeve} />
      {short && <path d={`M-27 ${up * 0.45} Q -30 ${up * 0.75} -25 ${up} L 25 ${up} Q 30 ${up * 0.75} 27 ${up * 0.45} Z`} fill={skinF} />}
      <path d={`M${side * 22} 10 Q ${side * 30} ${up / 2} ${side * 22} ${up - 10}`} stroke={side > 0 ? RIM : "#FFFFFF"} strokeWidth={4} fill="none" opacity={side > 0 ? 0.35 : 0.3} />
      <g transform={`translate(0,${up}) rotate(${a2})`}>
        <path d={`M-27 -16 Q -28 ${fore / 2} -23 ${fore} L 23 ${fore} Q 28 ${fore / 2} 27 -16 Z`} fill={short ? skinF : sleeve} />
        {!short && <path d="M-18 -2 Q 0 8 18 -2" stroke={sh(L.top, -0.3)} strokeWidth={3} fill="none" opacity={0.6} />}
        {!short && <rect x={-26} y={fore - 16} width={52} height={18} rx={8} fill={sh(L.top, -0.12)} />}
        <g transform={`translate(0,${fore + 12})`}>
          <path d="M-20 0 Q -26 34 -12 52 Q 2 62 16 52 Q 26 36 20 0 Z" fill={skinF} />
          <path d={`M${-side * 18} 8 Q ${-side * 36} 22 ${-side * 28} 38 Q ${-side * 20} 40 ${-side * 14} 28`} fill={L.skin[1]} />
          <path d="M-8 44 q 10 6 20 0" stroke={L.skin[3]} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </g>
    </g>
  );
};

// ---------- hair (back layer drawn behind the head, front layer on top) ----------
const HairBack: React.FC<{ L: Look }> = ({ L }) => {
  const g = `url(#hr_${L.id})`;
  switch (L.hairStyle) {
    case "longStraight":
      return <path d="M-118 -60 Q -130 -170 0 -176 Q 130 -170 118 -60 L 124 190 Q 60 210 0 200 Q -60 210 -124 190 Z" fill={g} />;
    case "wavyShoulder":
      return <path d="M-120 -60 Q -134 -170 0 -178 Q 134 -170 120 -60 Q 140 30 126 120 Q 136 150 110 160 Q 60 176 0 168 Q -60 176 -110 160 Q -136 150 -126 120 Q -140 30 -120 -60 Z" fill={g} />;
    case "braid":
      return (
        <g>
          <path d="M-112 -60 Q -122 -168 0 -172 Q 122 -168 112 -60 L 110 40 L -110 40 Z" fill={g} />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={96 + (i % 2) * 6} cy={70 + i * 46} rx={26} ry={30} fill={i % 2 ? L.hair[2] : L.hair[1]} />
          ))}
        </g>
      );
    case "ponytail":
      return <path d="M60 -150 Q 170 -150 150 -20 Q 140 90 110 150 Q 120 40 90 -60 Z" fill={g} />;
    case "afroPuff":
      return (
        <g>
          {[[-70, -150, 70], [0, -190, 84], [70, -150, 70], [-110, -80, 56], [110, -80, 56]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={g} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

const HairFront: React.FC<{ L: Look }> = ({ L }) => {
  const g = `url(#hr_${L.id})`;
  const hl = <path d="M-60 -148 Q -10 -172 52 -150" stroke={L.hair[0]} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.85} />;
  switch (L.hairStyle) {
    case "short":
      return <g><path d="M-108 -40 Q -122 -154 -6 -168 Q 116 -164 110 -40 Q 100 -104 54 -118 Q 4 -100 -56 -120 Q -100 -104 -108 -40 Z" fill={g} />{hl}</g>;
    case "fade":
      return (
        <g>
          <path d="M-106 -50 Q -112 -150 0 -160 Q 112 -150 106 -50 Q 100 -110 0 -116 Q -100 -110 -106 -50 Z" fill={g} />
          <path d="M-106 -50 Q -100 -90 -94 -100 L -90 -40 Z M106 -50 Q 100 -90 94 -100 L 90 -40 Z" fill={L.hair[1]} opacity={0.5} />
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-80 + i * 12} cy={-140 + Math.abs(i - 7) * 2} r={3} fill={L.hair[0]} opacity={0.6} />)}
        </g>
      );
    case "sidepart":
      return (
        <g>
          <path d="M-110 -30 Q -124 -160 -10 -170 Q 118 -168 112 -40 Q 104 -100 70 -110 Q 20 -124 -40 -100 Q -86 -84 -110 -30 Z" fill={g} />
          <path d="M-40 -168 Q -46 -130 -40 -100" stroke={L.hair[2]} strokeWidth={4} fill="none" />
          {hl}
        </g>
      );
    case "curlyShort":
      return (
        <g>
          <path d="M-108 -40 Q -116 -150 0 -162 Q 116 -150 108 -40 Q 96 -100 0 -108 Q -96 -100 -108 -40 Z" fill={g} />
          {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={-92 + i * 18} cy={-140 - Math.sin(i) * 14} r={22} fill={i % 2 ? L.hair[1] : L.hair[2]} />)}
          {Array.from({ length: 6 }, (_, i) => <path key={`h${i}`} d={`M${-70 + i * 28} -150 q 8 -10 16 0`} stroke={L.hair[0]} strokeWidth={4} fill="none" />)}
        </g>
      );
    case "afroPuff":
      return <g><path d="M-108 -30 Q -116 -136 0 -146 Q 116 -136 108 -30 Q 96 -96 0 -100 Q -96 -96 -108 -30 Z" fill={g} />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-90 + i * 20} cy={-128 - Math.abs(Math.sin(i * 1.3)) * 30} r={6} fill={L.hair[0]} opacity={0.5} />)}</g>;
    case "longStraight":
      return (
        <g>
          <path d="M-112 -10 Q -124 -164 0 -172 Q 124 -164 112 -10 Q 104 -80 80 -96 L 80 -56 Q 0 -70 -80 -56 L -80 -96 Q -104 -80 -112 -10 Z" fill={g} />
          {[-60, -20, 20, 60].map((x) => <path key={x} d={`M${x} -150 L ${x * 0.9} -60`} stroke={L.hair[0]} strokeWidth={4} opacity={0.6} />)}
        </g>
      );
    case "wavyShoulder":
      return (
        <g>
          <path d="M-114 -20 Q -126 -166 0 -174 Q 126 -166 114 -20 Q 104 -96 40 -116 Q 70 -70 20 -60 Q 40 -100 -10 -120 Q -90 -110 -114 -20 Z" fill={g} />
          {hl}
        </g>
      );
    case "ponytail":
    case "braid":
    case "bun":
      return (
        <g>
          {L.hairStyle === "bun" && <><circle cx={0} cy={-196} r={56} fill={g} /><path d="M-30 -220 Q 0 -240 30 -220" stroke={L.hair[0]} strokeWidth={5} fill="none" /></>}
          <path d="M-110 -40 Q -122 -164 0 -170 Q 122 -164 110 -40 Q 100 -110 0 -124 Q -100 -110 -110 -40 Z" fill={g} />
          <path d="M-80 -130 Q -40 -160 0 -150 M10 -152 Q 50 -162 84 -130" stroke={L.hair[0]} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
        </g>
      );
    default:
      return null;
  }
};

// ---------- facial hair ----------
const Facial: React.FC<{ L: Look }> = ({ L }) => {
  const g = `url(#hr_${L.id})`;
  switch (L.facial) {
    case "beard":
      return <path d="M-100 10 Q -104 70 -78 104 Q -70 120 -56 116 Q -46 132 -30 128 Q -16 142 0 136 Q 16 142 30 128 Q 46 132 56 116 Q 70 120 78 104 Q 104 70 100 10 Q 94 40 76 50 Q 60 92 0 96 Q -60 92 -76 50 Q -94 40 -100 10 Z" fill={g} />;
    case "stubble":
      return <g opacity={0.35}><path d="M-96 20 Q -90 110 0 126 Q 90 110 96 20 Q 80 70 0 84 Q -80 70 -96 20 Z" fill={L.hair[2]} /><path d="M-40 54 Q 0 40 40 54 L 36 60 Q 0 50 -36 60 Z" fill={L.hair[2]} /></g>;
    case "goatee":
      return <g><path d="M-34 84 Q 0 76 34 84 Q 30 124 0 130 Q -30 124 -34 84 Z" fill={g} /><path d="M-44 58 Q 0 40 44 58 Q 30 56 0 62 Q -30 56 -44 58 Z" fill={L.hair[1]} /></g>;
    case "moustache":
      return <path d="M-46 58 Q -24 36 0 50 Q 24 36 46 58 Q 30 56 0 62 Q -30 56 -46 58 Z" fill={L.hair[1]} />;
    default:
      return null;
  }
};

// ---------- torso ----------
const Torso: React.FC<{ L: Look }> = ({ L }) => {
  const m = L.build === "m";
  const sw = m ? 118 : 100, ww = m ? 104 : 82, hw = m ? 110 : 112;
  const body = `M${-sw} -540 Q ${-sw - 8} -470 ${-ww} -380 Q ${-hw} -300 ${-hw} -246 L ${hw} -246 Q ${hw} -300 ${ww} -380 Q ${sw + 8} -470 ${sw} -540 Q 60 -556 0 -556 Q -60 -556 ${-sw} -540 Z`;
  const shadeSide = `M${sw} -540 Q ${sw + 8} -470 ${ww} -380 Q ${hw} -300 ${hw} -246 L ${hw - 34} -246 Q ${hw - 34} -300 ${ww - 24} -380 Q ${sw - 16} -470 ${sw - 22} -540 Z`;
  return (
    <g>
      <path d={body} fill={`url(#tp_${L.id})`} />
      <path d={shadeSide} fill={sh(L.top, -0.25)} opacity={0.55} />
      <path d={`M${sw + 2} -536 Q ${sw + 10} -470 ${ww + 2} -380 Q ${hw + 2} -300 ${hw + 2} -250`} stroke={RIM} strokeWidth={4} fill="none" opacity={0.3} />
      <path d={`M${-sw + 18} -500 Q ${-sw + 6} -440 ${-ww + 12} -380`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.35} />
      <path d={`M${-ww + 4} -380 q 20 10 40 4 M${ww - 4} -382 q -18 10 -38 4`} stroke={sh(L.top, -0.3)} strokeWidth={4} fill="none" opacity={0.6} />
      {L.topStyle === "tee" && <path d="M-40 -552 Q 0 -500 40 -552" stroke={sh(L.top, -0.35)} strokeWidth={8} fill="none" />}
      {L.topStyle === "shirt" && (
        <g>
          <path d="M-44 -556 L 0 -520 L -10 -496 L -54 -536 Z M44 -556 L 0 -520 L 10 -496 L 54 -536 Z" fill={sh(L.top, 0.2)} />
          <path d="M0 -520 L 0 -250" stroke={sh(L.top, -0.3)} strokeWidth={4} />
          {[-470, -410, -350, -290].map((by) => <circle key={by} cx={6} cy={by} r={5} fill={sh(L.top, 0.4)} />)}
          <path d="M40 -470 L 80 -470 L 78 -432 L 42 -432 Z" fill={sh(L.top, -0.1)} />
        </g>
      )}
      {L.topStyle === "hoodie" && (
        <g>
          <path d={`M${-sw + 20} -548 Q 0 -600 ${sw - 20} -548 Q 60 -520 0 -514 Q -60 -520 ${-sw + 20} -548 Z`} fill={sh(L.top, -0.2)} />
          <path d="M-20 -516 L -24 -440 M20 -516 L 24 -440" stroke="#F4EEE2" strokeWidth={5} strokeLinecap="round" />
          <path d={`M${-ww + 20} -330 L ${ww - 20} -330 L ${ww - 10} -270 L ${-ww + 10} -270 Z`} fill={sh(L.top, -0.12)} />
        </g>
      )}
      {L.topStyle === "blouse" && <path d="M-46 -554 L 0 -470 L 46 -554" stroke={sh(L.top, -0.3)} strokeWidth={6} fill={L.skin[1]} />}
      {L.topStyle === "cardigan" && (
        <g>
          <path d="M-36 -552 L 36 -552 L 20 -246 L -20 -246 Z" fill={L.under ?? "#F4EEE2"} />
          <path d="M-36 -552 Q 0 -520 36 -552" stroke={sh(L.under ?? "#F4EEE2", -0.2)} strokeWidth={5} fill="none" />
          <path d="M-36 -552 L -20 -246 M36 -552 L 20 -246" stroke={sh(L.top, -0.35)} strokeWidth={5} />
          {[-430, -360, -290].map((by) => <circle key={by} cx={-26} cy={by} r={6} fill={sh(L.top, 0.35)} />)}
        </g>
      )}
      {/* waistband */}
      <rect x={-hw} y={-256} width={hw * 2} height={14} rx={6} fill={sh(L.pants, -0.3)} />
    </g>
  );
};

export const Human2: React.FC<{ L: Look; x: number; y: number; s?: number; f: number; talk?: boolean; look?: number; expr?: DocExpr; pose?: DocPose }> = ({
  L, x, y, s = 1, f, talk = false, look = 0, expr = "neutral", pose = "idle",
}) => {
  const E = EXPR[expr];
  const walking = pose === "walk";
  const swing = walking ? Math.sin(f / 6) : 0;
  const P = walking ? { F: [10 - swing * 18, -10] as [number, number], B: [-10 - swing * 18, 10] as [number, number], lift: 0 } : POSE[pose];
  const bob = walking ? -Math.abs(Math.sin(f / 6)) * 10 : Math.sin(f / 14) * 3;
  const open = talk ? 0.25 + Math.abs(Math.sin(f / 2.5)) * 0.75 : 0;
  const blink = f % 95 > 90 ? 0.12 : 1;
  const m = L.build === "m";
  const sw = m ? 104 : 90;
  const short = L.topStyle === "tee" || L.topStyle === "blouse";
  const lips = L.lips ?? sh(L.skin[2], -0.1);
  const id = L.id;
  const eyeW = L.eyes === "monolid" ? 20 : L.eyes === "almond" ? 21 : 20;
  const eyeTop = L.eyes === "monolid" ? -10 : -16;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (m ? 1 : 0.95)})`}>
      <defs>
        <linearGradient id={`sk_${id}`} x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stopColor={L.skin[0]} /><stop offset="0.55" stopColor={L.skin[1]} /><stop offset="1" stopColor={L.skin[2]} /></linearGradient>
        <linearGradient id={`hs_${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={L.skin[0]} /><stop offset="1" stopColor={L.skin[2]} /></linearGradient>
        <linearGradient id={`hr_${id}`} x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor={L.hair[0]} /><stop offset="0.6" stopColor={L.hair[1]} /><stop offset="1" stopColor={L.hair[2]} /></linearGradient>
        <linearGradient id={`tp_${id}`} x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor={sh(L.top, 0.22)} /><stop offset="0.5" stopColor={L.top} /><stop offset="1" stopColor={sh(L.top, -0.2)} /></linearGradient>
        <linearGradient id={`sl_${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={sh(L.top, 0.2)} /><stop offset="1" stopColor={sh(L.top, -0.15)} /></linearGradient>
        <linearGradient id={`pn_${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={sh(L.pants, 0.15)} /><stop offset="1" stopColor={sh(L.pants, -0.3)} /></linearGradient>
        <radialGradient id={`ck_${id}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#E8826A" stopOpacity="0.3" /><stop offset="1" stopColor="#E8826A" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={6} cy={8} rx={140} ry={20} fill="#000" opacity={0.3} />

      {/* legs + shoes */}
      {([[-1, -34], [1, 38]] as const).map(([sd, lx]) => (
        <g key={sd} transform={`translate(0,${-Math.max(0, swing * sd) * 16})`}>
          <path d={sd < 0 ? "M-62 -260 L -54 -22 L -12 -22 L -8 -260 Z" : "M8 -260 L 18 -22 L 62 -22 L 66 -260 Z"} fill={`url(#pn_${id})`} />
          <path d={`M${lx} -250 L ${lx + 2} -40`} stroke={sh(L.pants, 0.25)} strokeWidth={3} opacity={0.7} />
          <g transform={`translate(${sd < 0 ? -34 : 42},-8)`}>
            <path d={`M-34 -16 Q -36 8 -20 10 L ${sd > 0 ? 52 : 34} 10 Q ${sd > 0 ? 62 : 44} 0 ${sd > 0 ? 44 : 30} -16 Z`} fill={L.shoes ?? "#4A2E2A"} />
            <rect x={-36} y={4} width={sd > 0 ? 98 : 80} height={10} rx={5} fill={sh(L.shoes ?? "#4A2E2A", -0.4)} />
            <ellipse cx={-14} cy={-10} rx={10} ry={4} fill="#FFFFFF" opacity={0.25} />
          </g>
        </g>
      ))}

      <g transform={`translate(0,${bob})`}>
        {(L.hairStyle === "longStraight" || L.hairStyle === "wavyShoulder") && <g transform="translate(0,-700)"><HairBack L={L} /></g>}
        {pose !== "crossed" && <Arm L={L} sx={sw} sy={-520 - P.lift} a1={P.B[0]} a2={P.B[1]} side={1} short={short} />}
        <Torso L={L} />
        {pose === "crossed" && <Arm L={L} sx={sw} sy={-520 - P.lift} a1={P.B[0]} a2={P.B[1]} side={1} short={short} />}
        {pose !== "chin" && <Arm L={L} sx={-sw} sy={-520 - P.lift} a1={P.F[0]} a2={P.F[1]} side={-1} short={short} />}

        {/* neck */}
        <path d="M-28 -600 L -26 -540 Q 0 -530 26 -540 L 28 -600 Z" fill={L.skin[2]} />
        <path d="M-26 -566 Q 0 -554 26 -566" stroke={L.skin[3]} strokeWidth={5} fill="none" opacity={0.5} />

        <g transform="translate(0,-700)">
          {L.hairStyle !== "longStraight" && L.hairStyle !== "wavyShoulder" && <HairBack L={L} />}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 106},4)`}>
              <ellipse rx={19} ry={29} fill={sd < 0 ? L.skin[1] : L.skin[2]} />
              <path d={`M${-sd * 2} -16 q ${sd * 10} 14 0 28`} stroke={L.skin[3]} strokeWidth={5} fill="none" strokeLinecap="round" />
              {L.earrings && <circle cx={0} cy={32} r={9} fill={L.earrings} />}
            </g>
          ))}
          {/* head: softer, narrower chin for build f */}
          <path d={m ? "M-104 -70 Q -106 -140 0 -144 Q 106 -140 104 -70 L 102 30 Q 94 118 0 128 Q -94 118 -102 30 Z" : "M-100 -70 Q -102 -140 0 -144 Q 102 -140 100 -70 L 96 30 Q 80 112 0 122 Q -80 112 -96 30 Z"} fill={`url(#sk_${id})`} />
          <path d="M60 -120 Q 104 -80 100 20 Q 94 96 40 118 Q 84 66 78 -20 Q 74 -90 60 -120 Z" fill={L.skin[2]} opacity={0.5} />
          <path d="M102 -60 L 100 30" stroke={RIM} strokeWidth={4} opacity={0.35} />
          <ellipse cx={-62} cy={34} rx={34} ry={22} fill={`url(#ck_${id})`} />
          <ellipse cx={62} cy={34} rx={34} ry={22} fill={`url(#ck_${id})`} />
          <Facial L={L} />
          {/* mouth */}
          {talk || E.mouth === "rest" ? (
            <>
              <path d={`M-28 66 Q 0 ${58 - open * 4} 28 66 Q 0 ${76 + open * 18} -28 66 Z`} fill="#6A2A30" />
              <path d="M-24 68 Q 0 84 24 68" stroke={lips} strokeWidth={6} fill="none" />
            </>
          ) : E.mouth === "smile" ? (
            <><path d="M-36 60 Q 0 102 36 60 Q 0 78 -36 60 Z" fill="#6A2A30" /><path d="M-26 64 Q 0 76 26 64 L 24 70 Q 0 80 -24 70 Z" fill="#FFFFFF" /></>
          ) : E.mouth === "o" ? (
            <ellipse cx={0} cy={76} rx={16} ry={20} fill="#6A2A30" />
          ) : E.mouth === "smirk" ? (
            <path d="M-24 72 Q 4 74 28 60" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : E.mouth === "flat" ? (
            <path d="M-24 70 L 24 70" stroke="#6A2A30" strokeWidth={7} strokeLinecap="round" />
          ) : E.mouth === "hmm" ? (
            <path d="M4 70 Q 16 64 28 68" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M-24 76 Q 0 62 24 76" stroke="#6A2A30" strokeWidth={7} fill="none" strokeLinecap="round" />
          )}
          {(L.facial === "moustache" || L.facial === "beard" || L.facial === "goatee") && (
            <path d="M-44 58 Q -24 38 0 50 Q 24 38 44 58 Q 30 56 0 62 Q -30 56 -44 58 Z" fill={L.hair[1]} />
          )}
          {/* nose */}
          <path d="M-6 -6 Q -16 22 -20 34 Q -6 44 8 40 Q 22 36 16 26 Q 10 14 6 -6 Z" fill={L.skin[2]} />
          <path d="M-4 -4 Q -10 18 -12 30" stroke={L.skin[0]} strokeWidth={4} fill="none" opacity={0.7} />
          {/* eyes */}
          {[-44, 44].map((ex) => (
            <g key={ex} transform={`translate(${ex},-14)`}>
              <g transform={`scale(1,${blink * E.eye})`}>
                <path d={`M${-eyeW} 0 Q 0 ${eyeTop} ${eyeW} 0 Q 0 13 ${-eyeW} 0 Z`} fill="#FFFFFF" />
                <circle cx={(look + (E.side ?? 0)) * 6} cy={-(E.up ?? 0) + (L.eyes === "monolid" ? 1 : 0)} r={8.5} fill={L.iris ?? "#5A3A22"} />
                <circle cx={(look + (E.side ?? 0)) * 6} cy={-(E.up ?? 0) + (L.eyes === "monolid" ? 1 : 0)} r={4.5} fill="#1B1240" />
                <circle cx={(look + (E.side ?? 0)) * 6 - 3} cy={-3 - (E.up ?? 0)} r={2.3} fill="#FFFFFF" />
              </g>
              {E.lid > 0 && <path d={`M${-eyeW - 2} -2 Q 0 ${eyeTop - 4} ${eyeW + 2} -2 L ${eyeW + 2} ${-2 + E.lid * 14} Q 0 ${eyeTop - 2 + E.lid * 20} ${-eyeW - 2} ${-2 + E.lid * 14} Z`} fill={L.skin[1]} />}
              <path d={`M${-eyeW - 2} ${-2 + E.lid * 12} Q 0 ${eyeTop - 4 + E.lid * 18} ${eyeW + 2} ${-2 + E.lid * 12}`} stroke={sh(L.skin[3], -0.2)} strokeWidth={4} fill="none" strokeLinecap="round" />
              {L.build === "f" && <path d={`M${eyeW - 2} -4 l 8 -6`} stroke="#1B1240" strokeWidth={3} strokeLinecap="round" />}
            </g>
          ))}
          {/* brows */}
          <g transform={`translate(0,${-E.bl}) rotate(${E.tl},-46,-46)`}>
            <path d={m ? "M-70 -44 Q -48 -56 -22 -48 L -24 -40 Q -48 -46 -68 -36 Z" : "M-66 -44 Q -46 -56 -24 -50 L -24 -45 Q -46 -50 -64 -40 Z"} fill={L.hair[2]} />
          </g>
          <g transform={`translate(0,${-E.br}) rotate(${-E.tr},46,-46)`}>
            <path d={m ? "M70 -44 Q 48 -56 22 -48 L 24 -40 Q 48 -46 68 -36 Z" : "M66 -44 Q 46 -56 24 -50 L 24 -45 Q 46 -50 64 -40 Z"} fill={L.hair[2]} />
          </g>
          {L.glasses && (
            <g>
              {[-44, 44].map((gx) => (
                <g key={gx} transform={`translate(${gx},-12)`}>
                  <circle r={30} fill="#BFE8FF" opacity={0.16} />
                  <circle r={30} fill="none" stroke="#2A2F5A" strokeWidth={5} />
                  <path d="M-16 -14 L -4 -22" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
                </g>
              ))}
              <path d="M-14 -16 Q 0 -22 14 -16" stroke="#2A2F5A" strokeWidth={5} fill="none" />
            </g>
          )}
          <HairFront L={L} />
        </g>
        {pose === "chin" && <Arm L={L} sx={-sw} sy={-520 - P.lift} a1={P.F[0]} a2={P.F[1]} side={-1} short={short} />}
      </g>
    </g>
  );
};

// ---------- the first 10 avatars: 2 per group (a man and a woman), varied and non-stereotyped ----------
const SK: Record<string, Look["skin"]> = {
  deep: ["#8E5E40", "#6E4429", "#55321D", "#3E2414"],
  deepWarm: ["#A0694A", "#7E4E32", "#633A22", "#4A2A18"],
  eastAsian: ["#F4D6B4", "#E2BC96", "#C99C76", "#A87C58"],
  eastAsian2: ["#F0CFA8", "#DDB28A", "#C2946C", "#A07450"],
  southAsian: ["#CF9A6E", "#B07C52", "#93623E", "#734A2C"],
  southAsian2: ["#C68C5E", "#A86F45", "#8A5533", "#6A3E24"],
  latino: ["#E8B88E", "#CF9C70", "#B47F56", "#93623E"],
  latino2: ["#DDAA80", "#C48E62", "#A8734A", "#875834"],
  white: ["#FBE2CE", "#F0C6A8", "#DBA586", "#BC8466"],
  white2: ["#F8DCC4", "#EDC0A0", "#D69E7E", "#B47C5E"],
};
const HR: Record<string, Look["hair"]> = {
  black: ["#4A4A5A", "#26262F", "#141418"], darkBrown: ["#6A4A34", "#3E2A1C", "#24180E"],
  brown: ["#8A6044", "#5E3E28", "#3A2416"], blonde: ["#F4D892", "#D6AE62", "#A8803A"], auburn: ["#C8683A", "#9A4422", "#6A2A14"],
};

export const AVATARS: { name: string; group: string; L: Look }[] = [
  { name: "Marcus", group: "Black", L: { id: "a1", skin: SK.deep, hair: HR.black, hairStyle: "fade", facial: "beard", build: "m", top: "#2E8A5A", topStyle: "tee", pants: "#2B2F5A", iris: "#3A2414" } },
  { name: "Amara", group: "Black", L: { id: "a2", skin: SK.deepWarm, hair: HR.black, hairStyle: "afroPuff", build: "f", top: "#E8743A", topStyle: "blouse", pants: "#2A2F5A", earrings: "#F4CF7A", lips: "#8A3A3A", iris: "#3A2414" } },
  { name: "Kenji", group: "East Asian", L: { id: "a3", skin: SK.eastAsian, hair: HR.black, hairStyle: "sidepart", eyes: "monolid", glasses: true, build: "m", top: "#2A3E7A", topStyle: "shirt", pants: "#3A3A44", iris: "#2A1A12" } },
  { name: "Mei", group: "East Asian", L: { id: "a4", skin: SK.eastAsian2, hair: HR.black, hairStyle: "longStraight", eyes: "almond", build: "f", top: "#2EB8B2", topStyle: "tee", pants: "#3B33A0", lips: "#C2606A", iris: "#2A1A12" } },
  { name: "Arjun", group: "South Asian", L: { id: "a5", skin: SK.southAsian, hair: HR.black, hairStyle: "short", facial: "stubble", build: "m", top: "#8A2A4A", topStyle: "shirt", pants: "#2A2A3A", iris: "#3A2414" } },
  { name: "Priya", group: "South Asian", L: { id: "a6", skin: SK.southAsian2, hair: HR.darkBrown, hairStyle: "braid", eyes: "almond", build: "f", top: "#E0A83A", topStyle: "cardigan", under: "#F4EEE2", pants: "#2A2F5A", earrings: "#F4CF7A", lips: "#9A4A4A", iris: "#3A2414" } },
  { name: "Mateo", group: "Latino", L: { id: "a7", skin: SK.latino, hair: HR.darkBrown, hairStyle: "curlyShort", facial: "goatee", build: "m", top: "#6A6E7A", topStyle: "hoodie", pants: "#2B3A6A", iris: "#4A2E1A" } },
  { name: "Sofia", group: "Latina", L: { id: "a8", skin: SK.latino2, hair: HR.darkBrown, hairStyle: "wavyShoulder", eyes: "almond", build: "f", top: "#C23A4A", topStyle: "blouse", pants: "#2A2F5A", earrings: "#E8E8F0", lips: "#B24A5A", iris: "#4A2E1A" } },
  { name: "Ethan", group: "White", L: { id: "a9", skin: SK.white, hair: HR.blonde, hairStyle: "short", facial: "none", build: "m", top: "#3A7AC2", topStyle: "shirt", pants: "#4A4A5A", iris: "#3A6A9A" } },
  { name: "Claire", group: "White", L: { id: "a10", skin: SK.white2, hair: HR.auburn, hairStyle: "bun", glasses: true, eyes: "almond", build: "f", top: "#7A4AA8", topStyle: "cardigan", under: "#E8F0F8", pants: "#2B2470", lips: "#C2606A", iris: "#4A7A4A" } },
];
