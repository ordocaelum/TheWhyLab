// Anatomy hero assets: Body (front view, modes: skin / xray / organs, systems overlays, organ highlight) and Brain (side view).
// Body origin = feet centre, ~920 tall at s=1. Brain origin = centre, ~640 wide at s=1.
import React from "react";
import { rng, shade } from "./gen";

export type Organ = "brain" | "lungs" | "heart" | "liver" | "stomach" | "intestines" | "kidneys" | "bladder";
type BodyProps = {
  x: number; y: number; s?: number; f?: number;
  mode?: "skin" | "xray" | "organs";
  nerves?: boolean; vessels?: boolean; highlight?: Organ; skin?: string; id?: string;
};

const SKIN_DEF = "#E8B48A";

// ---------- silhouette parts (shared by all modes) ----------
// Proportions: upper body is authored around y -916..-236 and lifted by UP; legs are authored -270..-26 and
// stretched by LEGT so the figure is ~7.5 heads tall with legs ~half the height. Feet stay unstretched.
const UP = "translate(0,-190)";
const LEGT = "translate(0,-26) scale(1,1.905) translate(0,26)";

type SilP = { fill: string; stroke?: string; sw?: number };
const SilUpper: React.FC<SilP> = ({ fill, stroke, sw = 0 }) => (
  <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`scale(${sd},1)`}>
        {/* arm: deltoid -> upper arm -> elbow -> forearm -> wrist */}
        <path d="M-120 -718 C -160 -700 -172 -630 -176 -566 C -182 -480 -192 -390 -200 -296 L -202 -248 L -168 -244 L -162 -294 C -154 -390 -142 -480 -138 -562 C -134 -604 -126 -650 -108 -690 Z" />
        <ellipse cx={-186} cy={-216} rx={22} ry={33} />
      </g>
    ))}
    {/* torso: shoulders, chest, waist, hips */}
    <path d="M0 -748 C -40 -748 -110 -742 -136 -712 C -150 -690 -144 -630 -132 -570 C -118 -510 -100 -460 -100 -410 C -102 -360 -122 -320 -124 -270 L -112 -236 Q -60 -226 0 -232 Q 60 -226 112 -236 L 124 -270 C 122 -320 102 -360 100 -410 C 100 -460 118 -510 132 -570 C 144 -630 150 -690 136 -712 C 110 -742 40 -748 0 -748 Z" />
    <rect x={-24} y={-782} width={48} height={44} rx={12} />
    <ellipse cx={0} cy={-842} rx={60} ry={74} />
  </g>
);
const SilLegs: React.FC<SilP> = ({ fill, stroke, sw = 0 }) => (
  <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
    {[-1, 1].map((sd) => (
      <path key={sd} transform={`scale(${sd},1)`} d="M-122 -270 C -126 -190 -106 -120 -98 -70 C -96 -50 -94 -36 -92 -26 L -42 -26 C -40 -40 -38 -56 -36 -76 C -30 -130 -14 -190 -6 -236 Z" />
    ))}
  </g>
);
const SilFeet: React.FC<SilP> = ({ fill, stroke, sw = 0 }) => (
  <g fill={fill} stroke={stroke} strokeWidth={sw}>
    {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 68} cy={-14} rx={44} ry={18} />)}
  </g>
);

// subtle anatomy cues for skin mode (collarbones, chest, navel, knees)
const SkinCues: React.FC = () => (
  <g fill="none" stroke="#B8805A" strokeLinecap="round" opacity={0.55}>
    <path d="M-100 -716 Q -50 -700 -12 -712 M100 -716 Q 50 -700 12 -712" strokeWidth={4} />
    <path d="M-90 -600 Q -50 -572 -8 -590 M90 -600 Q 50 -572 8 -590" strokeWidth={4} />
    <path d="M0 -560 V -440" strokeWidth={3} opacity={0.5} />
    <ellipse cx={0} cy={-400} rx={5} ry={7} fill="#B8805A" stroke="none" />
  </g>
);
const KneeCues: React.FC = () => (
  <path d="M-80 -110 q 14 4 28 0 M80 -110 q -14 4 -28 0" stroke="#B8805A" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.55} />
);

// ---------- skeleton (xray) ----------
const SkelUpper: React.FC<{ c: string }> = ({ c }) => (
  <g stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* skull + jaw */}
    <path d="M-46 -840 Q -48 -900 0 -902 Q 48 -900 46 -840 Q 44 -808 30 -800 L -30 -800 Q -44 -808 -46 -840 Z" strokeWidth={7} fill={c} fillOpacity={0.12} />
    {[-19, 19].map((x) => <ellipse key={x} cx={x} cy={-846} rx={14} ry={12} strokeWidth={5} fill="#0B1A3A" fillOpacity={0.6} />)}
    <path d="M-4 -826 L 0 -814 L 4 -826" strokeWidth={4} />
    <path d="M-30 -800 Q -28 -776 0 -772 Q 28 -776 30 -800" strokeWidth={6} />
    {[-16, -6, 4, 14].map((x) => <line key={x} x1={x} y1={-800} x2={x} y2={-790} strokeWidth={3} />)}
    {/* spine */}
    {Array.from({ length: 17 }, (_, i) => <rect key={i} x={-10} y={-772 + i * 30} width={20} height={20} rx={6} strokeWidth={5} fill={c} fillOpacity={0.25} />)}
    {/* clavicles + ribcage */}
    <path d="M-110 -705 Q -50 -690 0 -712 Q 50 -690 110 -705" strokeWidth={8} />
    {Array.from({ length: 7 }, (_, i) => {
      const y = -680 + i * 34, w = 92 - Math.abs(i - 2) * 6;
      return <path key={i} d={`M-6 ${y} Q ${-w - 10} ${y + 6} ${-w + 6} ${y + 40} M6 ${y} Q ${w + 10} ${y + 6} ${w - 6} ${y + 40}`} strokeWidth={7} />;
    })}
    <path d="M0 -700 L 0 -540" strokeWidth={10} />
    {/* pelvis */}
    <path d="M-100 -330 Q -110 -260 -50 -250 Q -20 -240 0 -262 Q 20 -240 50 -250 Q 110 -260 100 -330 Q 50 -300 0 -312 Q -50 -300 -100 -330 Z" strokeWidth={7} fill={c} fillOpacity={0.18} />
    {/* arms */}
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 126} -706 Q ${sd * 158} -630 ${sd * 160} -560`} strokeWidth={11} />
        <circle cx={sd * 160} cy={-552} r={9} strokeWidth={5} />
        <path d={`M${sd * 158} -540 L ${sd * 180} -258 M${sd * 168} -540 L ${sd * 192} -258`} strokeWidth={6} />
      </g>
    ))}
  </g>
);
// leg bones, drawn inside the LEGT stretch (knee drawn as a pre-squashed ellipse so it reads round)
const SkelLegs: React.FC<{ c: string }> = ({ c }) => (
  <g stroke={c} fill="none" strokeLinecap="round">
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 66} -244 Q ${sd * 76} -180 ${sd * 72} -128`} strokeWidth={13} />
        <ellipse cx={sd * 72} cy={-116} rx={10} ry={5.5} strokeWidth={5} />
        <path d={`M${sd * 66} -106 L ${sd * 64} -30 M${sd * 78} -106 L ${sd * 74} -30`} strokeWidth={6} />
      </g>
    ))}
  </g>
);

// ---------- organs ----------
const G: React.FC<{ id: string; c: string }> = ({ id, c }) => (
  <radialGradient id={id} cx="0.38" cy="0.35" r="0.75"><stop offset="0" stopColor={shade(c, 0.35)} /><stop offset="0.6" stopColor={c} /><stop offset="1" stopColor={shade(c, -0.3)} /></radialGradient>
);
const ORGAN_COL: Record<Organ, string> = { brain: "#F29AB8", lungs: "#F07A8A", heart: "#D8344A", liver: "#9A3A2A", stomach: "#F2A08A", intestines: "#E88A7A", kidneys: "#A8443A", bladder: "#E8C07A" };

const Organs: React.FC<{ id: string; f: number; highlight?: Organ }> = ({ id, f, highlight }) => {
  const beat = 1 + 0.05 * Math.max(0, Math.sin(f / 4)) ** 8;
  const breathe = 1 + 0.03 * Math.sin(f / 22);
  const o = (k: Organ) => (highlight && highlight !== k ? 0.25 : 1);
  const glow = (k: Organ) => (highlight === k ? { filter: `drop-shadow(0 0 18px ${ORGAN_COL[k]})` } : undefined);
  const r = rng(5);
  return (
    <g>
      <defs>{(Object.keys(ORGAN_COL) as Organ[]).map((k) => <G key={k} id={`${id}${k}`} c={ORGAN_COL[k]} />)}</defs>
      {/* brain (front view, inside the skull) */}
      <g opacity={o("brain")} style={glow("brain")}>
        <ellipse cx={0} cy={-852} rx={44} ry={40} fill={`url(#${id}brain)`} />
        <path d="M0 -890 V -814" stroke="#B8607A" strokeWidth={4} />
        {[-26, -12, 12, 26].map((x) => <path key={x} d={`M${x} -880 q 6 12 0 24 q -6 12 0 24`} stroke="#C8708A" strokeWidth={3} fill="none" />)}
      </g>
      {/* lungs */}
      <g opacity={o("lungs")} style={glow("lungs")} transform={`translate(0,-600) scale(${breathe}) translate(0,600)`}>
        <path d="M-12 -690 Q -100 -690 -104 -580 Q -108 -500 -40 -500 Q -14 -520 -12 -600 Z" fill={`url(#${id}lungs)`} />
        <path d="M12 -690 Q 100 -690 104 -580 Q 108 -500 40 -500 Q 14 -520 12 -600 Z" fill={`url(#${id}lungs)`} />
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 10} -680 Q ${sd * 40} -630 ${sd * 60} -560 M${sd * 34} -640 l ${sd * 26} 20`} stroke="#C8505A" strokeWidth={4} fill="none" />)}
      </g>
      {/* heart */}
      <g opacity={o("heart")} style={glow("heart")} transform={`translate(24,-580) scale(${beat})`}>
        <path d="M0 22 C -50 -10 -40 -56 -10 -50 C 0 -48 4 -40 6 -34 C 10 -48 40 -56 46 -24 C 50 0 20 14 0 22 Z" fill={`url(#${id}heart)`} />
        <path d="M-6 -48 q -4 -20 6 -26 M10 -46 q 6 -22 16 -24" stroke="#B82A3A" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      {/* liver */}
      <path opacity={o("liver")} style={glow("liver")} d="M-112 -490 Q -60 -520 30 -500 Q 20 -450 -40 -430 Q -100 -420 -112 -450 Z" fill={`url(#${id}liver)`} />
      {/* stomach */}
      <path opacity={o("stomach")} style={glow("stomach")} d="M30 -510 Q 92 -520 96 -460 Q 98 -400 40 -390 Q 0 -390 10 -420 Q 50 -430 40 -470 Q 20 -490 30 -510 Z" fill={`url(#${id}stomach)`} />
      {/* kidneys */}
      <g opacity={o("kidneys")} style={glow("kidneys")}>{[-1, 1].map((sd) => <path key={sd} d={`M${sd * 58} -430 q ${sd * 30} 0 ${sd * 28} 34 q -2 34 ${-sd * 26} 30 q ${-sd * 10} -8 0 -32 q ${-sd * 12} -20 ${-sd * 2} -32 Z`} fill={`url(#${id}kidneys)`} />)}</g>
      {/* intestines: coiled tube */}
      <g opacity={o("intestines")} style={glow("intestines")}>
        <path d="M-80 -400 Q 80 -410 80 -370 Q 80 -340 -60 -350 Q -90 -330 -60 -310 Q 70 -320 80 -290 Q 70 -260 -70 -270" stroke={`url(#${id}intestines)`} strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d="M-80 -400 Q 80 -410 80 -370 Q 80 -340 -60 -350 Q -90 -330 -60 -310 Q 70 -320 80 -290 Q 70 -260 -70 -270" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.3} transform="translate(-3,-6)" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-60 + r() * 130} cy={-390 + r() * 120} r={3} fill="#B8605A" />)}
      </g>
      {/* bladder */}
      <ellipse opacity={o("bladder")} style={glow("bladder")} cx={0} cy={-262} rx={22} ry={16} fill={`url(#${id}bladder)`} />
    </g>
  );
};

// ---------- systems overlays ----------
const Nerves: React.FC<{ f: number }> = ({ f }) => {
  const pulse = (f % 60) / 60;
  const vagus = "M0 -800 Q -8 -740 -6 -700 Q -20 -640 -16 -580 Q -30 -520 -10 -480 Q 20 -440 10 -390";
  return (
    <g>
      <path d={vagus} stroke="#FFE066" strokeWidth={7} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #FFE066)" }} />
      {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 4} -620 q ${sd * 40} 10 ${sd * 60} 40 M${sd * 4} -470 q ${sd * 40} 4 ${sd * 66} -10`} stroke="#FFE066" strokeWidth={4} fill="none" opacity={0.7} />)}
      <circle r={9} fill="#FFFFFF" style={{ offsetPath: `path('${vagus}')`, offsetDistance: `${(1 - pulse) * 100}%` } as React.CSSProperties} />
    </g>
  );
};
const VesselsUpper: React.FC = () => (
  <g fill="none" strokeLinecap="round">
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 8} -560 Q ${sd * 60} -680 ${sd * 120} -690 Q ${sd * 170} -560 ${sd * 196} -240`} stroke="#E8344A" strokeWidth={5} />
        <path d={`M${sd * 16} -560 Q ${sd * 70} -690 ${sd * 130} -700 Q ${sd * 180} -560 ${sd * 206} -240`} stroke="#3A6AD8" strokeWidth={4} />
      </g>
    ))}
    <path d="M10 -560 V -240" stroke="#E8344A" strokeWidth={9} /><path d="M-8 -560 V -240" stroke="#3A6AD8" strokeWidth={8} />
  </g>
);
const VesselsLegs: React.FC = () => (
  <g fill="none" strokeLinecap="round">
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 10} -236 Q ${sd * 56} -160 ${sd * 60} -30`} stroke="#E8344A" strokeWidth={6} />
        <path d={`M${sd * 20} -236 Q ${sd * 66} -160 ${sd * 72} -30`} stroke="#3A6AD8" strokeWidth={5} />
      </g>
    ))}
  </g>
);

export const Body: React.FC<BodyProps> = ({ x, y, s = 1, f = 0, mode = "skin", nerves, vessels, highlight, skin = SKIN_DEF, id = "bd" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}sk`} x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stopColor={shade(skin, 0.18)} /><stop offset="0.6" stopColor={skin} /><stop offset="1" stopColor={shade(skin, -0.22)} /></linearGradient>
      <linearGradient id={`${id}xr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FE8FF" stopOpacity="0.32" /><stop offset="1" stopColor="#3A8AD8" stopOpacity="0.22" /></linearGradient>
    </defs>
    <ellipse cx={0} cy={6} rx={170} ry={22} fill="#000" opacity={0.28} />
    {mode === "skin" ? (
      <g>
        <g transform={LEGT}><SilLegs fill={`url(#${id}sk)`} /><KneeCues /></g>
        <SilFeet fill={`url(#${id}sk)`} />
        <g transform={UP}>
          <SilUpper fill={`url(#${id}sk)`} />
          <SkinCues />
          <ellipse cx={-40} cy={-860} rx={18} ry={10} fill="#FFFFFF" opacity={0.3} />
        </g>
      </g>
    ) : (
      <g>
        <g transform={LEGT}><SilLegs fill={`url(#${id}xr)`} stroke="#9FF4FF" sw={3} /><SkelLegs c={mode === "xray" ? "#E8FAFF" : "#CFEFFF"} /></g>
        <SilFeet fill={`url(#${id}xr)`} stroke="#9FF4FF" sw={3} />
        <g transform={UP}>
          <SilUpper fill={`url(#${id}xr)`} stroke="#9FF4FF" sw={3} />
          <SkelUpper c={mode === "xray" ? "#E8FAFF" : "#CFEFFF"} />
          {mode === "organs" && <Organs id={id} f={f} highlight={highlight} />}
        </g>
      </g>
    )}
    {vessels && <><g transform={LEGT}><VesselsLegs /></g><g transform={UP}><VesselsUpper /></g></>}
    {nerves && <g transform={UP}><Nerves f={f} /></g>}
  </g>
);

// ---------------------------------------------------------------------
// Brain (side view, facing left). lobes: tint lobes. hypo: glow the hypothalamus. Origin = centre.
// ---------------------------------------------------------------------
const CEREBRUM = "M-300 30 C -330 -110 -230 -250 -60 -270 C 110 -290 270 -210 300 -60 C 318 30 280 90 200 110 C 120 128 40 100 -20 110 C -100 122 -160 150 -220 128 C -280 108 -300 76 -300 30 Z";
export const Brain: React.FC<{ x: number; y: number; s?: number; f?: number; lobes?: boolean; hypo?: boolean; id?: string }> = ({ x, y, s = 1, f = 0, lobes, hypo, id = "br" }) => {
  const r = rng(42);
  // gyri: rounded tube-like folds = deep sulcus outline + gyrus body + soft highlight, clipped to the cerebrum
  const paths = Array.from({ length: 64 }, () => {
    let px = -300 + r() * 600, py = -270 + r() * 380;
    let a = r() * Math.PI * 2;
    let d = `M${px.toFixed(0)} ${py.toFixed(0)}`;
    for (let k = 0; k < 4; k++) {
      a += (r() - 0.5) * 2.6;
      const nx = px + Math.cos(a) * 38, ny = py + Math.sin(a) * 38;
      const cx = px + Math.cos(a + 1.3) * 26, cy = py + Math.sin(a + 1.3) * 26;
      d += ` Q ${cx.toFixed(0)} ${cy.toFixed(0)} ${nx.toFixed(0)} ${ny.toFixed(0)}`;
      px = nx; py = ny;
    }
    return d;
  });
  const folds = (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={`s${i}`} d={d} stroke="#A8456A" strokeWidth={30} />)}
      {paths.map((d, i) => <path key={`g${i}`} d={d} stroke="#F2A0BC" strokeWidth={22} />)}
      {paths.map((d, i) => <path key={`h${i}`} d={d} stroke="#FFD0DE" strokeWidth={6} transform="translate(-3,-5)" opacity={0.75} />)}
    </g>
  );
  const hp = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}g`} cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFC0D4" /><stop offset="0.55" stopColor="#F29AB8" /><stop offset="1" stopColor="#C8607E" /></radialGradient>
        <radialGradient id={`${id}cb`} cx="0.4" cy="0.3" r="0.8"><stop offset="0" stopColor="#F4A8C0" /><stop offset="1" stopColor="#B8506E" /></radialGradient>
        <clipPath id={`${id}clip`}><path d={CEREBRUM} /></clipPath>
      </defs>
      <ellipse cx={0} cy={250} rx={260} ry={26} fill="#000" opacity={0.25} />
      {/* brainstem */}
      <path d="M40 90 Q 70 180 60 250 L 110 250 Q 120 180 110 90 Z" fill="#E08AA4" />
      <path d="M60 110 Q 80 180 72 246" stroke="#C8607E" strokeWidth={4} fill="none" />
      {/* cerebellum */}
      <path d="M100 100 Q 180 70 250 110 Q 280 150 230 190 Q 160 214 110 170 Q 90 140 100 100 Z" fill={`url(#${id}cb)`} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${108 + i * 4} ${110 + i * 16} Q 180 ${96 + i * 18} ${250 - i * 6} ${120 + i * 14}`} stroke="#A8405E" strokeWidth={3} fill="none" />)}
      {/* cerebrum */}
      <path d={CEREBRUM} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}clip)`}>
        {lobes && (
          <g opacity={0.55}>
            <path d="M-320 -300 L -40 -300 L -10 -40 L -120 40 L -320 40 Z" fill="#7FB8FF" />
            <path d="M-40 -300 L 200 -300 L 150 -60 L -10 -40 Z" fill="#7FE8B0" />
            <path d="M200 -300 L 340 -300 L 340 140 L 150 -60 Z" fill="#FFD27A" />
            <path d="M-120 40 L -10 -40 L 150 -60 L 200 140 L -320 140 Z" fill="#B48CFF" />
          </g>
        )}
        {folds}
        {/* lateral (Sylvian) fissure + central sulcus */}
        <path d="M-200 50 Q -80 -20 120 -50" stroke="#9A3A5A" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M-40 -280 Q -20 -170 -10 -40" stroke="#9A3A5A" strokeWidth={8} fill="none" strokeLinecap="round" />
        <ellipse cx={-110} cy={-180} rx={90} ry={34} fill="#FFFFFF" opacity={0.18} transform="rotate(-18,-110,-180)" />
      </g>
      <path d={CEREBRUM} fill="none" stroke="#B8506E" strokeWidth={5} />
      <path d="M260 -160 Q 296 -80 290 0" stroke="#5FF0E8" strokeWidth={4} fill="none" opacity={0.35} />
      {/* hypothalamus (underside, just in front of the brainstem) */}
      {hypo && (
        <g>
          <circle cx={10} cy={96} r={70} fill="#FFE066" opacity={0.18 * hp} />
          <ellipse cx={10} cy={96} rx={26} ry={16} fill="#FFD23F" stroke="#FFF4B8" strokeWidth={3} style={{ filter: "drop-shadow(0 0 12px #FFD23F)" }} />
        </g>
      )}
    </g>
  );
};
