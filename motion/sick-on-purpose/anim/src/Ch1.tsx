// Chapter 1: THE ALARM (script lines 6–20)
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Cell, Germ, Human, Scientist } from "./chars";
import { Framer, H, Headline, INK, lerp, Sparkle, sp, Stage, W } from "./kit";
import { Lab, Microscope } from "./lab";
import { SceneDef, useTalking } from "./timing";
import { CellField, Dapple, Foliage, MachineWall } from "./gen";

// ---------- shared micro-world backdrop (inside the microscope) ----------
const Micro: React.FC<{ children?: React.ReactNode; iris?: number }> = ({ children, iris = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#3A0B2A", overflow: "hidden" }}>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id="tissue" cx="0.5" cy="0.45" r="0.8">
            <stop offset="0" stopColor="#FF8FA8" />
            <stop offset="0.55" stopColor="#C23E6A" />
            <stop offset="1" stopColor="#4A0B2A" />
          </radialGradient>
          <clipPath id="irisClip"><circle cx={W / 2} cy={H / 2} r={1200 * iris} /></clipPath>
        </defs>
        <g clipPath="url(#irisClip)">
          <rect width={W} height={H} fill="url(#tissue)" />
          <CellField seed={11} base="#F27A9A" far="#4A0B3A" count={80} />
          <rect width={W} height={H} fill="#3A0B2A" opacity={0.25} />
          <Dapple seed={3} color="#FFD0E0" o={0.14} />
          {children}
        </g>
        <circle cx={W / 2} cy={H / 2} r={1200 * iris} fill="none" stroke="#05030F" strokeWidth={60} />
        <radialGradient id="mvig" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
        <rect width={W} height={H} fill="url(#mvig)" />
      </svg>
    </AbsoluteFill>
  );
};

// plain immune cell (not the mascot) for crowds
const ImmuneCell: React.FC<{ x: number; y: number; r?: number; f: number; alert?: number }> = ({ x, y, r = 70, f, alert = 0 }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 10 + x) * 6})`}>
    <ellipse cx={0} cy={r * 1.05} rx={r * 0.8} ry={r * 0.15} fill="#000" opacity={0.2} />
    <circle r={r} fill="#C9D4FF" />
    <circle cx={-r * 0.12} cy={-r * 0.12} r={r * 0.85} fill="#EEF1FF" />
    <circle cx={r * 0.15} cy={r * 0.1} r={r * 0.4} fill="#9FA8E8" />
    <circle cx={-r * 0.25} cy={-r * 0.45} r={r * 0.15} fill="#FFFFFF" opacity={0.8} />
    {alert > 0 && (
      <g transform={`translate(0,${-r - 50}) scale(${alert})`}>
        <rect x={-9} y={-60} width={18} height={44} rx={9} fill="#FFE066" />
        <circle cx={0} cy={0} r={10} fill="#FFE066" />
      </g>
    )}
  </g>
);

const Envelope: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={70} fill="#FFE066" opacity={0.25} />
    <rect x={-46} y={-32} width={92} height={64} rx={10} fill="#FFF4C4" />
    <path d="M-46 -26 L 0 8 L 46 -26" stroke="#E0A83A" strokeWidth={7} fill="none" strokeLinejoin="round" />
  </g>
);

// 6. "Let's take a closer look." Doc walks to the microscope.
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  const x = lerp(f, 0, 45, 1500, 1000, Easing.inOut(Easing.cubic));
  return (
    <Lab>
      <Scientist x={x} y={1030} s={0.82} f={f} talk={talk} look={-1} />
    </Lab>
  );
};

// 7. Into the microscope → bacteria in a cut, immune cells notice
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const dive = lerp(f, 0, 40, 1, 9, Easing.in(Easing.cubic));
  if (f < 40) {
    return (
      <Lab zoom={dive} cx={668} cy={378}>
        <Microscope x={720} y={760} s={0.8} glow={f / 40} />
      </Lab>
    );
  }
  const t = f - 40;
  return (
    <Micro iris={lerp(t, 0, 20, 0.05, 1)}>
      {/* the cut: a dark gash across the tissue */}
      <path d="M300 620 Q 960 520 1620 640 Q 960 700 300 620 Z" fill="#5A0B2A" />
      {[0, 1, 2].map((i) => (
        <Germ key={i} x={700 + i * 260} y={600 - (i % 2) * 40} s={0.38} f={f + i * 7} rot={-10 + i * 12} />
      ))}
      {[[260, 360], [1660, 330], [1600, 860]].map(([x, y], i) => (
        <ImmuneCell key={i} x={x} y={y} f={f} alert={sp(t, 40 + i * 6, 8)} />
      ))}
    </Micro>
  );
};

// 8. CELL: "Hi. Immune cell. We noticed."
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("CELL");
  const x = lerp(f, 0, 30, W + 300, 1320, Easing.out(Easing.back(1.2)));
  const tag = sp(f, 25, 10);
  return (
    <Micro>
      {[0, 1, 2].map((i) => <Germ key={i} x={420 + i * 220} y={620 - (i % 2) * 40} s={0.34} f={f + i * 7} />)}
      <Cell x={x} y={560} s={0.9} f={f} mood={talk ? "alert" : "happy"} look={-1} />
      <g transform={`translate(1320,330) scale(${tag})`}>
        <rect x={-110} y={-40} width={220} height={80} rx={40} fill="#FF8A1F" />
        <rect x={-110} y={30} width={220} height={10} rx={5} fill="#B5480A" />
        <text textAnchor="middle" y={18} fontFamily="Arial Black" fontSize={50} fill={INK}>CELL</text>
      </g>
    </Micro>
  );
};

// 9. Immune cells release cytokine envelopes
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Micro>
      <ImmuneCell x={W / 2 - 300} y={560} r={110} f={f} />
      <Cell x={W / 2 + 300} y={560} s={0.6} f={f} look={-1} />
      {Array.from({ length: 10 }, (_, i) => {
        const t = f - 20 - i * 9;
        if (t < 0) return null;
        const a = (i / 10) * Math.PI * 2;
        const d = t * 9;
        const ox = i % 2 ? W / 2 - 300 : W / 2 + 300;
        return <Envelope key={i} x={ox + Math.cos(a) * d} y={560 + Math.sin(a) * d * 0.7} s={0.6 + Math.min(t / 30, 0.4)} />;
      })}
      <Sparkle x={W / 2} y={300} at={30} size={30} color="#FFE066" />
    </Micro>
  );
};

// 10. CELL: "Basically, we text the brain…" notifications in caps (Doc presenter, unamused)
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const msgs = ["INVADERS!!!", "SEND HELP", "WHY IS IT HOT", "!!!!!!"];
  return (
    <Micro>
      <Cell x={1560} y={760} s={0.55} f={f} mood="happy" look={-1} />
      {msgs.map((m, i) => {
        const s = sp(f, 10 + i * 18, 9);
        return (
          <g key={m} transform={`translate(${1060 + (i % 2) * 60},${220 + i * 140}) scale(${s})`}>
            <rect x={-300} y={-50} width={600} height={100} rx={50} fill="#FFFFFF" />
            <circle cx={-240} cy={0} r={30} fill="#2ED3C6" />
            <text x={-190} y={18} fontFamily="Arial Black" fontSize={50} fill={INK}>{m}</text>
          </g>
        );
      })}
    </Micro>
  );
};

// 11. Bloodstream + vagus nerve "cable" from gut to brain
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const draw = lerp(f, 30, 140, 1, 0, Easing.inOut(Easing.cubic));
  const pulse = (f % 40) / 40;
  return (
    <Stage k="lab" lx={W / 2} ly={460} head={<Headline big="THE VAGUS NERVE" top={50} />}>
      <CellField seed={21} base="#3FA8C9" far="#0B1033" count={60} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.45} />
      {/* body silhouette */}
      <g transform={`translate(${W / 2},560)`}>
        <circle cx={0} cy={-250} r={110} fill="#2A4A8A" />
        <rect x={-150} y={-140} width={300} height={430} rx={140} fill="#2A4A8A" />
        <rect x={-150} y={-140} width={200} height={430} rx={100} fill="#3A5CA8" />
        {/* brain */}
        <path d="M-60 -260 C -70 -310 -20 -330 0 -320 C 20 -330 70 -310 60 -260 C 66 -230 30 -215 0 -220 C -30 -215 -66 -230 -60 -260 Z" fill="#FF7AB8" />
        {/* gut */}
        <path d="M-70 120 q 30 -40 70 0 t 70 0 q -20 50 -70 40 t -70 -40 Z" fill="#FF9E7A" />
        {/* blood vessels with travelling envelopes */}
        <path d="M-110 -100 V 250 M110 -100 V 250" stroke="#FF4D6D" strokeWidth={10} opacity={0.7} />
        {[0, 1].map((i) => <circle key={i} cx={i ? 110 : -110} cy={250 - ((pulse + i * 0.5) % 1) * 350} r={14} fill="#FFE066" />)}
        {/* vagus nerve */}
        <path d="M0 130 C -40 40 40 -60 0 -160 S 0 -210 0 -220" stroke="#FFE066" strokeWidth={12} fill="none" strokeLinecap="round"
          strokeDasharray="420" strokeDashoffset={420 * draw} style={{ filter: "drop-shadow(0 0 12px #FFE066)" }} />
      </g>
    </Stage>
  );
};

// brain control room (12, 15, 16)
const SWITCHES = ["ENERGY", "SLEEP", "HUNGER", "SOCIAL", "MOOD"];
const ControlRoom: React.FC<{ flips?: number[]; title?: string }> = ({ flips = [], title }) => {
  const f = useCurrentFrame();
  return (
    <Stage k="dusk" lx={W / 2} ly={420} rays={false} head={title ? <Headline big={title} top={50} /> : undefined}>
      <MachineWall seed={5} base="#3B1A6B" />
      <rect x={480} y={330} width={960} height={560} rx={50} fill="#1A0B3D" />
      <rect x={480} y={330} width={960} height={70} rx={35} fill="#3B1A6B" />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={540 + i * 50} cy={365} r={12} fill={i % 2 ? "#2FE08A" : "#FF4D6D"} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />
      ))}
      {SWITCHES.map((s, i) => {
        const on = flips[i] === undefined ? 1 : lerp(f, flips[i], flips[i] + 8, 1, 0);
        const x = 600 + i * 180;
        return (
          <g key={s}>
            <rect x={x - 55} y={480} width={110} height={240} rx={40} fill="#0B1033" />
            <rect x={x - 45} y={490 + (1 - on) * 110} width={90} height={110} rx={30} fill={on > 0.5 ? "#2FE08A" : "#FF4D6D"} />
            <rect x={x - 35} y={498 + (1 - on) * 110} width={70} height={20} rx={10} fill="#FFFFFF" opacity={0.3} />
            <text x={x} y={790} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#FFFFFF">{s}</text>
          </g>
        );
      })}
    </Stage>
  );
};
const S12: React.FC = () => <ControlRoom title="BRAIN HQ" />;

// 13. Thermostat dial 37 → 39
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const temp = lerp(f, 60, 200, 37, 39, Easing.inOut(Easing.cubic));
  const ang = -120 + ((temp - 35) / 6) * 240;
  return (
    <Stage k="alarm" lx={W / 2} ly={560} head={<Headline big="HYPOTHALAMUS" small="THE BODY'S THERMOSTAT" top={40} />}>
      <MachineWall seed={9} base="#7A0F1A" />
      <g transform={`translate(${W / 2},640)`}>
        <circle r={290} fill="#2A0508" />
        <circle r={270} fill="#F4EEE2" />
        <circle r={250} fill="#FFFFFF" />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={-5} y={-240} width={10} height={i % 2 ? 26 : 44} rx={5} fill={INK} transform={`rotate(${-120 + i * 20})`} />
        ))}
        <g transform={`rotate(${ang})`}>
          <rect x={-10} y={-200} width={20} height={210} rx={10} fill="#FF4D3D" />
        </g>
        <circle r={36} fill={INK} />
        <text y={140} textAnchor="middle" fontFamily="Arial Black" fontSize={110} fill="#FF4D3D">{temp.toFixed(1)}°</text>
      </g>
    </Stage>
  );
};

// 14. Shivering under the blanket while the inner furnace roars
const S14: React.FC = () => {
  const f = useCurrentFrame();
  const shake = Math.sin(f * 1.8) * 6;
  const fire = 0.6 + 0.4 * Math.sin(f / 3);
  return (
    <Stage k="morning" lx={W / 2} ly={520} rays={false}>
      <CellField seed={31} base="#7A5AA8" far="#1B1440" count={40} />
      <rect width={W} height={H} fill="#1B1440" opacity={0.55} />
      <Dapple seed={8} color="#FFE2A8" o={0.1} />
      <g transform={`translate(${W / 2 + shake},800)`}>
        <ellipse cx={0} cy={120} rx={420} ry={30} fill="#000" opacity={0.3} />
        <path d="M-380 100 C -380 -260 380 -260 380 100 Z" fill="#E0567A" />
        <path d="M-360 90 C -360 -240 340 -240 340 80 Z" fill="#FF7A9A" />
        <circle cx={0} cy={-300} r={110} fill="#C9C49A" />
        <circle cx={-10} cy={-308} r={98} fill="#E4E0B8" />
        {[-38, 38].map((ex) => <rect key={ex} x={ex - 20} y={-312} width={40} height={10} rx={5} fill="#1B1240" />)}
        {/* inner furnace glow */}
        <circle cx={0} cy={-20} r={150 * fire} fill="#FFB347" opacity={0.35} />
        <path d={`M-40 40 Q -60 -40 0 ${-120 - fire * 30} Q 60 -40 40 40 Z`} fill="#FF7A1F" opacity={0.85} />
        <path d={`M-20 40 Q -26 -10 0 ${-60 - fire * 20} Q 26 -10 20 40 Z`} fill="#FFE066" />
      </g>
      {[[600, 360], [1320, 330], [700, 600]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontFamily="Arial Black" fontSize={70} fill="#CFD8FF" opacity={0.6 + 0.4 * Math.sin(f / 5 + i)}>❄</text>
      ))}
    </Stage>
  );
};

// 15. "And second, it changes you." Control room, all on
const S15: React.FC = () => <ControlRoom title="IT CHANGES YOU" />;

// 16. Switches flip one per beat (spread across the line)
const S16: React.FC = () => <ControlRoom flips={[20, 70, 130, 190, 250]} />;

// 17 & 18. Stamp: SICKNESS BEHAVIOUR (18 adds Cell's interruption)
const Stamp: React.FC<{ cell?: boolean }> = ({ cell }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [8, 16, 22], [3, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage k="verdict" lx={W / 2} ly={480}>
      <CellField seed={41} base="#3FE0B0" far="#0B1033" count={60} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.5} />
      <g transform={`translate(${W / 2},${H / 2 - 40}) rotate(-6) scale(${cell ? 1 : s})`} opacity={cell || f > 8 ? 1 : 0}>
        <rect x={-760} y={-130} width={1520} height={260} rx={30} fill="none" stroke="#FF4D6D" strokeWidth={20} />
        <text textAnchor="middle" y={45} fontFamily="Arial Black" fontSize={120} fill="#FF4D6D">SICKNESS BEHAVIOUR</text>
      </g>
      {cell && <Cell x={lerp(f, 0, 16, -200, 260)} y={860} s={0.55} f={f} mood="alert" look={1} />}
    </Stage>
  );
};
const S17: React.FC = () => <Stamp />;
const S18: React.FC = () => <Stamp cell />;

// 19. Benjamin Hart, 1988, the vet with sick animals
const Animal: React.FC<{ x: number; y: number; c: string; s?: number; ears?: boolean }> = ({ x, y, c, s = 1, ears }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={150} ry={18} fill="#000" opacity={0.3} />
    <rect x={-110} y={-110} width={60} height={110} rx={26} fill={c} filter="brightness(0.85)" />
    <rect x={50} y={-110} width={60} height={110} rx={26} fill={c} filter="brightness(0.85)" />
    <ellipse cx={0} cy={-150} rx={150} ry={80} fill={c} />
    <circle cx={150} cy={-200} r={60} fill={c} />
    {ears && <ellipse cx={130} cy={-262} rx={18} ry={34} fill={c} />}
    <path d="M170 -205 q 10 8 20 0" stroke="#1B1240" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M130 -140 q 18 -18 36 0" stroke="#B8FFFA" strokeWidth={0} />
  </g>
);
const S19: React.FC = () => {
  const f = useCurrentFrame();
  const yr = sp(f, 40, 10);
  return (
    <Stage k="jungle" lx={W / 2} ly={480}>
      <Foliage seed={2} base="#1E6B4A" y0={120} y1={480} count={22} scale={[0.6, 1]} sway={2} />
      <rect width={W} height={H} fill="#0B1A40" opacity={0.35} />
      <rect x={0} y={880} width={W} height={200} fill="#0B1A40" opacity={0.6} />
      <Human x={360} y={900} s={0.95} f={f} shirt="#F4F1FF" />
      <Animal x={850} y={900} c="#C8956A" s={0.8} ears />
      <Animal x={1280} y={900} c="#F4EEE2" s={1.05} />
      <Animal x={1700} y={900} c="#7A4A2A" s={0.95} ears />
      <g transform={`translate(${W / 2},230) scale(${yr})`}>
        <text textAnchor="middle" fontFamily="Arial Black" fontSize={200} fill={INK} dy={12}>1988</text>
        <text textAnchor="middle" fontFamily="Arial Black" fontSize={200} fill="#E8FF7A">1988</text>
      </g>
      <Foliage seed={7} base="#123B2A" y0={1020} y1={1200} count={16} scale={[0.8, 1.3]} sway={4} />
    </Stage>
  );
};

// 20. WEAKNESS crossed out → STRATEGY
const S20: React.FC = () => {
  const f = useCurrentFrame();
  const cross = lerp(f, 40, 60, 0, 1);
  const st = interpolate(f, [100, 108, 114], [3, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage k="verdict" lx={W / 2} ly={480}>
      <Foliage seed={12} base="#1E6B4A" y0={-100} y1={1180} count={30} scale={[0.7, 1.3]} sway={3} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.55} />
      <text x={W / 2} y={420} textAnchor="middle" fontFamily="Arial Black" fontSize={170} fill="#CFD8FF" opacity={1 - cross * 0.5}>WEAKNESS</text>
      <line x1={W / 2 - 520} y1={370} x2={W / 2 - 520 + 1040 * cross} y2={370} stroke="#FF4D6D" strokeWidth={22} strokeLinecap="round" />
      {f > 100 && (
        <g transform={`translate(${W / 2},700) rotate(-4) scale(${st})`}>
          <rect x={-560} y={-120} width={1120} height={220} rx={30} fill="#2FE08A" />
          <text textAnchor="middle" y={52} fontFamily="Arial Black" fontSize={150} fill={INK}>STRATEGY</text>
        </g>
      )}
      {f > 110 && [[420, 600], [1500, 560], [1300, 880]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} at={112 + i * 5} size={30} />)}
    </Stage>
  );
};

export const CH1: SceneDef[] = [
  { line: 6, C: S6 },
  { line: 7, C: S7 },
  { line: 8, C: S8 },
  { line: 9, C: S9 },
  { line: 10, C: S10, doc: "bl" },
  { line: 11, C: S11 },
  { line: 12, C: S12, doc: "bl" },
  { line: 13, C: S13 },
  { line: 14, C: S14 },
  { line: 15, C: S15, doc: "br" },
  { line: 16, C: S16 },
  { line: 17, C: S17, doc: "br" },
  { line: 18, C: S18, doc: "br" },
  { line: 19, C: S19 },
  { line: 20, C: S20, doc: "bl" },
];
