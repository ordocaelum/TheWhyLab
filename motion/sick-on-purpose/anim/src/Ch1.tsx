// Chapter 1: THE ALARM (script lines 6–20)
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Cell, Germ, Human, Scientist } from "./chars";
import { Framer, H, Headline, INK, lerp, Sparkle, sp, Stage, W } from "./kit";
import { Lab, Microscope } from "./lab";
import { SceneDef, useTalking } from "./timing";
import { CellField, Dapple, Foliage, MachineWall } from "./gen";
import { DocV2 } from "./doc2";
import { LabBench, LabScreen, LabWide } from "./sets";
import { Farm } from "./landscapes";
import { Thing } from "./objects";
import { Human2, Look } from "./human2";
import { Robot } from "./robot";
import { Body, Brain } from "./anatomy";
import { HeatRise, SickInBed } from "./sickbed";
import { Bedroom } from "./interiors";

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

// 6. "Let's take a closer look." Doc walks across LabWide to his slot.
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  const x = lerp(f, 0, 40, 1700, 1290, Easing.out(Easing.cubic));
  return (
    <LabWide>
      <DocV2 x={x} y={1010} s={0.62} f={f} talk={talk} pose={f < 40 ? "walk" : "present"} expr="happy" look={-1} />
    </LabWide>
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

// 8. ROBOT: shrunk down into the micro-world with Doc's crew, points out the immune cells that noticed
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("CELL");
  const x = lerp(f, 0, 30, W + 300, 1400, Easing.out(Easing.back(1.2)));
  return (
    <Micro>
      {[0, 1, 2].map((i) => <Germ key={i} x={420 + i * 220} y={620 - (i % 2) * 40} s={0.34} f={f + i * 7} />)}
      {[[300, 360], [980, 300], [760, 860]].map(([cx, cy], i) => <ImmuneCell key={i} x={cx} y={cy} r={80} f={f} alert={sp(f, 20 + i * 8, 8)} />)}
      <Robot x={x} y={900} s={0.7} f={f} talk={talk} mood="smug" look={-1} />
    </Micro>
  );
};

// 9. Immune cells release cytokine envelopes
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Micro>
      <ImmuneCell x={W / 2 - 300} y={560} r={110} f={f} />
      <ImmuneCell x={W / 2 + 300} y={560} r={95} f={f + 20} />
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

// 10. ROBOT: "Basically, they text the brain…" notifications in caps (Doc presenter, unamused)
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("CELL");
  const msgs = ["INVADERS!!!", "SEND HELP", "WHY IS IT HOT", "!!!!!!"];
  return (
    <Micro>
      {[[360, 380], [560, 640]].map(([cx, cy], i) => <ImmuneCell key={i} x={cx} y={cy} r={90} f={f + i * 9} alert={1} />)}
      <Robot x={1640} y={1040} s={0.6} f={f} talk={talk} mood="smug" look={-1} />
      {msgs.map((m, i) => {
        const s = sp(f, 10 + i * 18, 9);
        return (
          <g key={m} transform={`translate(${1000 + (i % 2) * 60},${220 + i * 140}) scale(${s})`}>
            <rect x={-300} y={-50} width={600} height={100} rx={50} fill="#FFFFFF" />
            <circle cx={-240} cy={0} r={30} fill="#2ED3C6" />
            <text x={-190} y={18} fontFamily="Arial Black" fontSize={50} fill={INK}>{m}</text>
          </g>
        );
      })}
    </Micro>
  );
};

// 11. Bloodstream + vagus nerve: the anatomy body, organs on, vagus glowing gut -> brain
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const vis = lerp(f, 20, 50, 0, 1);
  return (
    <Stage k="lab" lx={W / 2} ly={460} head={<Headline big="THE VAGUS NERVE" top={40} />}>
      <CellField seed={21} base="#3FA8C9" far="#0B1033" count={60} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.5} />
      <Body id="s11" x={W / 2} y={1050} s={0.78} f={f} mode="organs" vessels={f > 10} nerves={f > 30} highlight={f > 30 ? "intestines" : undefined} />
      <g opacity={vis}>
        <path d="M1080 760 L 1340 760" stroke="#FFE066" strokeWidth={4} />
        <text x={1360} y={774} fontFamily="Arial Black" fontSize={40} fill="#FFE066">GUT</text>
        <path d="M1000 330 L 1340 330" stroke="#FFE066" strokeWidth={4} />
        <text x={1360} y={344} fontFamily="Arial Black" fontSize={40} fill="#FFE066">BRAIN</text>
        <path d="M900 560 L 560 560" stroke="#FF4D6D" strokeWidth={4} />
        <text x={540} y={574} textAnchor="end" fontFamily="Arial Black" fontSize={40} fill="#FF8A9A">BLOODSTREAM</text>
      </g>
    </Stage>
  );
};

// brain control room (12, 15, 16), shown on Doc's lab screen (1100x600 box)
const SWITCHES = ["ENERGY", "SLEEP", "HUNGER", "SOCIAL", "MOOD"];
const Panel: React.FC<{ flips?: number[]; title?: string }> = ({ flips = [], title }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <text x={550} y={90} textAnchor="middle" fontFamily="Arial Black" fontSize={64} fill="#F4EEE2">{title ?? "BRAIN HQ"}</text>
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={60 + i * 34} cy={40} r={9} fill={i % 2 ? "#2FE08A" : "#FF4D6D"} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />)}
      {SWITCHES.map((s, i) => {
        const on = flips[i] === undefined ? 1 : lerp(f, flips[i], flips[i] + 8, 1, 0);
        const x = 230 + i * 190;
        return (
          <g key={s}>
            <rect x={x - 60} y={150} width={120} height={300} rx={40} fill="#0B1033" stroke="#2A4A7A" strokeWidth={4} />
            <rect x={x - 50} y={162 + (1 - on) * 150} width={100} height={130} rx={30} fill={on > 0.5 ? "#2FE08A" : "#FF4D6D"} />
            <rect x={x - 40} y={172 + (1 - on) * 150} width={80} height={22} rx={11} fill="#FFFFFF" opacity={0.3} />
            <text x={x} y={510} textAnchor="middle" fontFamily="Arial Black" fontSize={32} fill="#F4EEE2">{s}</text>
          </g>
        );
      })}
    </g>
  );
};
const ScreenScene: React.FC<{ flips?: number[]; title?: string; expr?: "neutral" | "happy" | "serious" }> = ({ flips, title, expr = "neutral" }) => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return <LabScreen screen={<Panel flips={flips} title={title} />} actor={<DocV2 x={300} y={1260} s={1.0} f={f} talk={talk} pose="point" expr={expr} />} />;
};
const S12: React.FC = () => <ScreenScene title="BRAIN HQ" />;

// 13. Doc points at the desk thermostat on his bench; temperature readout climbs 37 -> 39
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  const temp = lerp(f, 60, 200, 37, 39, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <LabBench actor={<DocV2 x={760} y={960} s={1.0} f={f} talk={talk} pose="point" expr="neutral" />} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g opacity={lerp(f, 10, 30, 0, 1)}>
          <circle cx={1540} cy={640} r={240} fill="#0B1228" opacity={0.6} />
          <Brain id="s13" x={1540} y={660} s={0.6} f={f} hypo />
        </g>
        <g transform="translate(1500,260)">
          <rect x={-250} y={-150} width={500} height={200} rx={24} fill="#0B1228" opacity={0.88} />
          <text x={0} y={-100} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#F4EEE2">HYPOTHALAMUS</text>
          <text x={0} y={-62} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#FF8A1F">THE BODY'S THERMOSTAT</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="Arial Black" fontSize={84} fill="#FF4D3D">{temp.toFixed(1)}°</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// 14. Shivering under the blanket while the inner furnace roars
const S14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bedroom night noBed>
        <SickInBed id="s14" x={720} y={870} s={0.6} f={f} shiver blanket="#5A7AD8" />
      </Bedroom>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <HeatRise x={830} y={700} f={f} w={460} h={220} />
        {[[600, 300], [1320, 260], [1700, 520]].map(([x, y], i) => (
          <text key={i} x={x} y={y} fontFamily="Arial Black" fontSize={70} fill="#CFD8FF" opacity={0.6 + 0.4 * Math.sin(f / 5 + i)}>❄</text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// 15. "And second, it changes you." Control room, all on
const S15: React.FC = () => <ScreenScene title="IT CHANGES YOU" expr="serious" />;

// 16. Switches flip one per beat (spread across the line)
const S16: React.FC = () => <ScreenScene title="SWITCHING OFF" flips={[20, 70, 130, 190, 250]} />;

// 17 & 18. Stamp: SICKNESS BEHAVIOUR (18 adds the robot's interruption)
const Stamp: React.FC<{ cell?: boolean }> = ({ cell }) => {
  const f = useCurrentFrame();
  const botTalk = useTalking("CELL");
  const s = interpolate(f, [8, 16, 22], [3, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage k="verdict" lx={W / 2} ly={480}>
      <CellField seed={41} base="#3FE0B0" far="#0B1033" count={60} />
      <rect width={W} height={H} fill="#0B1033" opacity={0.5} />
      <g transform={`translate(${W / 2},${H / 2 - 40}) rotate(-6) scale(${cell ? 1 : s})`} opacity={cell || f > 8 ? 1 : 0}>
        <rect x={-760} y={-130} width={1520} height={260} rx={30} fill="none" stroke="#FF4D6D" strokeWidth={20} />
        <text textAnchor="middle" y={45} fontFamily="Arial Black" fontSize={120} fill="#FF4D6D">SICKNESS BEHAVIOUR</text>
      </g>
      {cell && <Robot x={lerp(f, 0, 16, -200, 300)} y={1060} s={0.6} f={f} talk={botTalk} mood="alert" look={1} />}
    </Stage>
  );
};
const S17: React.FC = () => <Stamp />;
const S18: React.FC = () => <Stamp cell />;

// 19. Benjamin Hart, 1988: a vet on the farm with sick animals (library animals, avatar rig)
const VET: Look = { id: "vet", skin: ["#F6D2B0", "#E6B48E", "#C99470", "#A87452"], hair: ["#C8C2BA", "#9A948C", "#6A645C"], hairStyle: "short", facial: "moustache", glasses: true, build: "m", top: "#F4F6FF", topStyle: "shirt", pants: "#3A4A6A", iris: "#4A6A8A" };
const S19: React.FC = () => {
  const f = useCurrentFrame();
  const yr = sp(f, 40, 10);
  return (
    <AbsoluteFill>
      <Farm>
        <Human2 L={VET} x={520} y={990} s={0.62} f={f} pose="chin" expr="thinking" />
        <Thing name="dog" x={820} y={1000} s={0.55} f={f} />
        <Thing name="cat" x={1000} y={1010} s={0.5} f={f} />
        <Thing name="rabbit" x={1160} y={1010} s={0.45} f={f} />
      </Farm>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2},230) scale(${yr})`}>
          <text textAnchor="middle" fontFamily="Arial Black" fontSize={200} fill={INK} dy={12}>1988</text>
          <text textAnchor="middle" fontFamily="Arial Black" fontSize={200} fill="#FFFFFF">1988</text>
        </g>
      </svg>
    </AbsoluteFill>
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
  { line: 10, C: S10, doc: "bl", expr: "unamused" },
  { line: 11, C: S11 },
  { line: 12, C: S12 },
  { line: 13, C: S13 },
  { line: 14, C: S14 },
  { line: 15, C: S15 },
  { line: 16, C: S16 },
  { line: 17, C: S17, doc: "br" },
  { line: 18, C: S18, doc: "br", expr: "unamused" },
  { line: 19, C: S19 },
  { line: 20, C: S20, doc: "bl", expr: "happy" },
];
