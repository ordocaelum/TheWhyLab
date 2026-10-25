// Episode 2: Why the Moon Looks Huge (It Isn't). Scenes keyed to motion/moon-illusion/script.md lines.
import React from "react";
import { AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { H, INK, lerp, Sparkle, sp, Stage, W } from "./kit";
import { LinesCtx, Line, makeTiming, OffsetCtx, useTalking } from "./timing";
import { Grain, rng } from "./gen";
import { DocExpr, DocPose, DocV2 } from "./doc2";
import { LabBench, LabWide } from "./sets";
import { Thing } from "./objects";
import { AVATARS, Human2, Look } from "./human2";
import { Robot, BotMood } from "./robot";
import { Presenter } from "./lab";
import { Brain } from "./anatomy";
import { Moon, MoonCity, MoonFields, MoonSea, MoonSpec, Orion, Ponzo, Stars } from "./moon";
import { AV, Bars, Big, Over, Screen, ScrTitle, Tag, Wide } from "./Ch2to5";
import MOON_LINES from "./moon_lines.json";

const LINES = MOON_LINES as Line[];
const T = makeTiming(LINES);

// ---------- shared ----------
const Bot: React.FC<{ x: number; y: number; s?: number; look?: number; mood?: BotMood; rot?: number }> = ({ x, y, s = 0.7, look = 0, mood = "smug", rot = 0 }) => {
  const f = useCurrentFrame();
  const talk = useTalking("CELL");
  return <g transform={`rotate(${rot},${x},${y - 300 * s})`}><Robot x={x} y={y} s={s} f={f} talk={talk} mood={mood} look={look} /></g>;
};
const DocAt: React.FC<{ x: number; y: number; s?: number; pose?: DocPose; expr?: DocExpr; look?: number }> = ({ x, y, s = 0.62, pose = "present", expr = "neutral", look = -1 }) => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return <DocV2 x={x} y={y} s={s} f={f} talk={talk} pose={pose} expr={expr} look={look} />;
};
const rise = (f: number, a: number, b: number, y0: number, y1: number) => lerp(f, a, b, y0, y1, Easing.inOut(Easing.cubic));
// scholar looks (robes = long shirt in muted colours)
const SCH = (id: string, skin: Look["skin"], hair: Look["hair"], top: string, facial: Look["facial"] = "beard"): Look => ({ id, skin, hair, hairStyle: "short", facial, build: "m", top, topStyle: "shirt", pants: top, shoes: "#6A4A2A", iris: "#4A3A2A" });
const OLIVE: Look["skin"] = ["#E8C49A", "#C99E74", "#A87C54", "#86603C"];
const BROWN: Look["skin"] = ["#C8946A", "#A8744A", "#86583A", "#6A4228"];
const GREY: Look["hair"] = ["#D8D4CC", "#A8A49C", "#7A766E"];
const DARK: Look["hair"] = ["#4A4A5A", "#26262F", "#141418"];
const ARISTOTLE = SCH("ar", OLIVE, GREY, "#F4EEDC");
const PTOLEMY = SCH("pt", OLIVE, DARK, "#C8A86A");
const CLEOMEDES = SCH("cl", OLIVE, GREY, "#8AA0C8", "moustache");
const HAYTHAM = SCH("ih", BROWN, DARK, "#3A6A5A");
const Era: React.FC<{ name: string; when: string }> = ({ name, when }) => (
  <Over><Tag t={name} x={W / 2} y={140} at={4} c="#FFD23F" size={60} /><Tag t={when} x={W / 2} y={240} at={12} c="#F4EEE2" size={40} /></Over>
);

// =========================== COLD OPEN ===========================
// 1. go outside after sunset, look east: moon starts to rise behind the city
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <MoonCity moon={{ x: 1160, y: rise(f, 0, 120, 880, 690), r: 170, tint: 1 }}>
      <Human2 L={AV("Marcus")} x={560} y={930} s={0.6} f={f} look={1} />
      <Human2 L={AV("Mei")} x={760} y={930} s={0.58} f={f + 9} look={1} />
    </MoonCity>
  );
};
// 2. Hunter's Moon climbs, looking enormous; people point and take photos
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonCity moon={{ x: 1160, y: rise(f, 0, 200, 690, 560), r: 190, tint: 1 }}>
        <Human2 L={AV("Marcus")} x={560} y={930} s={0.6} f={f} pose="point" expr="happy" />
        <Human2 L={AV("Mei")} x={760} y={930} s={0.58} f={f + 9} expr="surprised" />
        <Thing name="smartphone" x={830} y={600} s={0.35} f={f} shadow={false} />
      </MoonCity>
      <Over><Big t="THE HUNTER'S MOON" y={170} size={110} c="#FFD27A" at={20} /></Over>
    </AbsoluteFill>
  );
};
// 3. "It isn't." Doc on the roof; the giant moon gets an outline that matches a high moon exactly
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const ring = lerp(f, 60, 80, 0, 1);
  return (
    <AbsoluteFill>
      <MoonCity moon={{ x: 1160, y: 560, r: 190, tint: 1 }}>
        <DocAt x={560} y={940} pose="point" expr="serious" look={1} />
      </MoonCity>
      <Over>
        <g opacity={ring}>
          <Moon id="s3hi" x={1640} y={170} r={190 * 0.98} tint={0} glow={0.4} />
          <circle cx={1160} cy={560} r={196} fill="none" stroke="#7FE8FF" strokeWidth={6} strokeDasharray="18 12" />
          <circle cx={1640} cy={170} r={192} fill="none" stroke="#7FE8FF" strokeWidth={6} strokeDasharray="18 12" />
        </g>
        <Big t="SAME SIZE" x={1400} y={900} size={110} c="#7FE8FF" at={90} />
      </Over>
    </AbsoluteFill>
  );
};
// 4. Title card: MOON ILLUSION, robot waves
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const t = sp(f, 18, 10);
  return (
    <Stage k="deep" lx={W / 2} ly={480}>
      <Stars seed={21} n={120} y1={1080} />
      <Moon id="s4" x={W / 2} y={560} r={260 + Math.sin(f / 30) * 6} tint={0.6} />
      <Robot x={1560} y={1060 + (1 - sp(f, 0, 10)) * 500} s={0.75} f={f} wave={f > 30} mood="happy" />
      <g transform={`translate(${W / 2},230) scale(${t})`}>
        <text textAnchor="middle" fontFamily="Arial Black" fontSize={190} fill={INK} dy={14}>MOON ILLUSION</text>
        <text textAnchor="middle" fontFamily="Arial Black" fontSize={190} fill="#FFFFFF">MOON ILLUSION</text>
      </g>
      {[[300, 300], [1700, 260], [420, 880]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} at={24 + i * 6} size={30} color="#FFD27A" />)}
    </Stage>
  );
};

// =========================== CHAPTER 1: THE SAME MOON ===========================
// 5. "Let's start with what's actually up there."
const S5: React.FC = () => <Wide expr="happy" pose="present" />;
// 6. distance + size on the screen
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const d = lerp(f, 20, 80, 0, 1);
  return (
    <Screen expr="neutral">
      <ScrTitle t="THE MOON" />
      <circle cx={150} cy={330} r={95} fill="#3A7AD8" /><path d="M90 300 q 30 -30 60 0 t 50 20" stroke="#2FA06A" strokeWidth={22} fill="none" strokeLinecap="round" />
      <text x={150} y={470} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2">EARTH</text>
      <line x1={260} y1={330} x2={260 + 640 * d} y2={330} stroke="#FFD23F" strokeWidth={6} strokeDasharray="16 10" />
      {d > 0.95 && <Moon id="s6" x={950} y={330} r={26} tint={0} glow={0.5} />}
      <text x={600} y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={42} fill="#FFD23F" opacity={d}>~384,000 KM</text>
      <text x={950} y={420} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2" opacity={lerp(f, 90, 110, 0, 1)}>~3,500 KM WIDE</text>
    </Screen>
  );
};
// 7–9. lasers off the Apollo mirrors: drifting away ~4 cm a year; robot joke; Doc deadpan
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const shot = (f % 40) / 40;
  return (
    <Screen expr="neutral">
      <ScrTitle t="LASER RANGING" />
      <circle cx={150} cy={330} r={95} fill="#3A7AD8" />
      <Moon id="s7" x={950} y={330} r={70} tint={0} glow={0.4} />
      <rect x={900} y={300} width={22} height={16} fill="#C8C8D8" />
      <line x1={240} y1={330} x2={240 + 650 * Math.min(1, shot * 2)} y2={330} stroke="#FF2D3D" strokeWidth={5} opacity={shot < 0.5 ? 1 : 0} />
      <line x1={890} y1={336} x2={890 - 650 * Math.max(0, shot * 2 - 1)} y2={336} stroke="#FF2D3D" strokeWidth={5} opacity={shot >= 0.5 ? 1 : 0} />
      <Tag t="+ ALMOST 4 CM / YEAR" x={550} y={500} at={60} c="#FFD23F" size={42} />
    </Screen>
  );
};
const S8: React.FC = () => (
  <Wide expr="unamused" pose="crossed" x={1450}><Bot x={820} y={1010} s={0.62} look={1} mood="sad" /></Wide>
);
// 10. half a degree, high or low
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const wedge = (cx: number, cy: number, a: number) => (
    <g>
      <path d={`M120 520 L ${cx} ${cy - 18} L ${cx} ${cy + 18} Z`} fill="#FFD23F" opacity={0.25} />
      <Moon id={`s10${a}`} x={cx} y={cy} r={18} tint={a ? 0 : 0.9} glow={0.3} />
    </g>
  );
  return (
    <Screen expr="neutral">
      <ScrTitle t="ABOUT ½ DEGREE" />
      <rect x={0} y={520} width={1100} height={80} fill="#1E3A2A" />
      <circle cx={120} cy={505} r={14} fill="#F4EEE2" />
      {wedge(980, 470, 0)}
      {f > 60 && wedge(760, 160, 1)}
      <text x={550} y={575} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#F4EEE2" opacity={lerp(f, 90, 110, 0, 1)}>RISING OR OVERHEAD: THE SAME</text>
    </Screen>
  );
};
// 11. the pea test: low moon, then high moon, same pea covers it
const Pea: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <path d={`M-100 ${H + 40} Q ${x - 300} ${y + 300} ${x - r * 0.4} ${y + r * 1.1}`} stroke="#C99470" strokeWidth={90} fill="none" strokeLinecap="round" />
    <ellipse cx={x - r * 0.3} cy={y + r * 1.2} rx={70} ry={50} fill="#C99470" />
    <path d={`M${x - r * 0.2} ${y + r * 1.0} q 10 -40 0 -${r * 0.25}`} stroke="#B07A58" strokeWidth={30} strokeLinecap="round" />
    <circle cx={x} cy={y} r={r} fill="#6AB84A" /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#A8E08A" opacity={0.7} />
  </g>
);
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const high = f > 160;
  const my = high ? 220 : 720, r = 120;
  const px = lerp(f % 160, 20, 70, 300, 820, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 820, y: my, r, tint: high ? 0 : 1 }} night={high ? 0.95 : 0.55} />
      <Over>
        <Pea x={px} y={my} r={r + 3} />
        <Tag t={high ? "HOURS LATER: STILL COVERED" : "ARM'S LENGTH: COVERED"} x={1400} y={high ? 640 : 220} at={high ? 230 : 70} c="#FFFFFF" size={40} />
      </Over>
    </AbsoluteFill>
  );
};
// 12. ROBOT: "I tried that. Now I have a pea and no friends." (alone on the roof with a pea)
const S12: React.FC = () => (
  <MoonCity moon={{ x: 1400, y: 560, r: 160, tint: 0.9 }}>
    <Bot x={760} y={960} s={0.62} look={1} mood="sad" />
    <circle cx={830} cy={720} r={12} fill="#6AB84A" />
  </MoonCity>
);
// 13. photos hours apart: same disc
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const stack = lerp(f, 100, 150, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Screen expr="neutral">
      <ScrTitle t="SAME DISC" />
      {[0, 1, 2, 3].map((i) => {
        const x = 170 + i * 250, y = 330;
        const tx = x + (550 - x) * stack;
        return (
          <g key={i} transform={`translate(${tx},${y})`} opacity={sp(f, 10 + i * 12, 12)}>
            <rect x={-105} y={-130} width={210} height={260} rx={10} fill="#0B1228" stroke="#F4EEE2" strokeWidth={6} opacity={1 - stack * 0.7} />
            <Moon id={`s13${i}`} x={0} y={60 - i * 50} r={42} tint={1 - i / 3} glow={0.3} />
          </g>
        );
      })}
      {stack > 0.9 && <circle cx={550} cy={330 + 60 - 75} r={46} fill="none" stroke="#7FE8FF" strokeWidth={5} strokeDasharray="10 8" />}
    </Screen>
  );
};
// 14. horizon moon ~1.5% farther: you're one Earth radius closer when it's overhead
const S14: React.FC = () => {
  const f = useCurrentFrame();
  const show = lerp(f, 30, 60, 0, 1);
  return (
    <Screen expr="neutral">
      <ScrTitle t="ABOUT 1.5% FARTHER" />
      <circle cx={300} cy={380} r={150} fill="#3A7AD8" />
      <circle cx={300} cy={380} r={6} fill="#FFD23F" />
      <circle cx={300} cy={230} r={10} fill="#FF8A1F" />
      <Moon id="s14a" x={300} y={120} r={0} tint={0} glow={0} />
      <g opacity={show}>
        <line x1={300} y1={225} x2={980} y2={225} stroke="#FF8A1F" strokeWidth={5} strokeDasharray="14 8" />
        <text x={700} y={210} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#FF8A1F">ON THE HORIZON</text>
        <line x1={300} y1={380} x2={300} y2={230} stroke="#FFD23F" strokeWidth={5} />
        <text x={330} y={320} fontFamily="Arial Black" fontSize={24} fill="#FFD23F">1 EARTH RADIUS</text>
        <text x={330} y={350} fontFamily="Arial Black" fontSize={24} fill="#FFD23F">CLOSER WHEN OVERHEAD</text>
      </g>
      <Moon id="s14m" x={1010} y={225} r={26} tint={0.6} glow={0.4} />
    </Screen>
  );
};
// 15. air isn't a magnifying glass; refraction squashes the low moon
const S15: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  const x = lerp(f, 40, 55, 0, 1);
  return (
    <AbsoluteFill>
      <LabBench actor={<DocV2 x={760} y={960} s={1.0} f={f} talk={talk} pose="point" expr="skeptical" />} />
      <Over>
        <Thing name="magnifier" x={1300} y={420} s={1.4} f={f} shadow={false} />
        <line x1={1140} y1={260} x2={1140 + 320 * x} y2={260 + 320 * x} stroke="#FF4D6D" strokeWidth={22} strokeLinecap="round" />
        <line x1={1460} y1={260} x2={1460 - 320 * x} y2={260 + 320 * x} stroke="#FF4D6D" strokeWidth={22} strokeLinecap="round" opacity={x > 0.5 ? 1 : 0} />
        <Moon id="s15" x={1600} y={760} r={110} tint={1} squash={lerp(f, 90, 130, 1, 0.9)} glow={0.5} />
        <Tag t="SLIGHTLY SQUASHED" x={1600} y={940} at={120} c="#FFD23F" size={36} />
      </Over>
    </AbsoluteFill>
  );
};
// 16. colour is real: long path through air scatters blue
const S16: React.FC = () => {
  const f = useCurrentFrame();
  const R = rng(5);
  return (
    <Screen expr="happy" pose="present">
      <ScrTitle t="WHY IT'S ORANGE" />
      <path d="M0 600 Q 550 380 1100 600" fill="#2A6AC8" opacity={0.35} />
      <path d="M0 600 Q 550 440 1100 600" fill="#1E3A2A" />
      <circle cx={550} cy={470} r={10} fill="#F4EEE2" />
      <line x1={550} y1={470} x2={550} y2={140} stroke="#F4F1E6" strokeWidth={6} />
      <line x1={550} y1={470} x2={1060} y2={430} stroke="#FFA050" strokeWidth={6} />
      {Array.from({ length: 14 }, (_, i) => { const t = R(), x = 600 + t * 420, y = 465 - t * 35; const k = ((f + i * 9) % 50) / 50; return <circle key={i} cx={x + Math.cos(i) * k * 60} cy={y - k * 70} r={6} fill="#5AA8FF" opacity={1 - k} />; })}
      <Moon id="s16a" x={550} y={120} r={30} tint={0} glow={0.3} />
      <Moon id="s16b" x={1060} y={430} r={30} tint={1} glow={0.4} />
      <text x={820} y={560} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#5AA8FF">BLUE SCATTERED AWAY</text>
    </Screen>
  );
};
// 17. light different, size not
const S17: React.FC = () => (
  <AbsoluteFill>
    <MoonSea moon={{ x: 960, y: 600, r: 130, tint: 0.9 }} />
    <Over><Tag t="COLOUR: REAL" x={560} y={200} at={6} c="#FFB060" size={52} /><Tag t="SIZE: SAME" x={1360} y={200} at={40} c="#7FE8FF" size={52} /></Over>
  </AbsoluteFill>
);

// =========================== CHAPTER 2: TWO THOUSAND YEARS OF ARGUING ===========================
// 18. noticed for a very long time: timeline slides back
const S18: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(f, 0, 120, 0, -1100, Easing.inOut(Easing.cubic));
  const eras = ["TODAY", "1962", "~1000 YEARS AGO", "~1800 YEARS AGO", "~2300+ YEARS AGO"];
  return (
    <Stage k="dusk" lx={W / 2} ly={420} rays={false}>
      <Stars seed={8} n={80} y1={500} />
      <g transform={`translate(${x},0)`}>
        <line x1={0} y1={700} x2={3400} y2={700} stroke="#F4EEE2" strokeWidth={8} />
        {eras.map((e, i) => <g key={e} transform={`translate(${300 + i * 620},700)`}><circle r={20} fill="#FFD23F" /><text y={90} textAnchor="middle" fontFamily="Arial Black" fontSize={50} fill="#F4EEE2">{e}</text><Moon id={`s18${i}`} x={0} y={-260} r={70} tint={0.8} glow={0.4} /></g>)}
      </g>
    </Stage>
  );
};
const ScholarScene: React.FC<{ L: Look; name: string; when: string; lens?: boolean; book?: boolean; haze?: boolean }> = ({ L, name, when, lens, book, haze }) => {
  const f = useCurrentFrame();
  const cross = lerp(f, 90, 110, 0, 1);
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 1220, y: 690, r: 150, tint: 1 }} night={0.7}>
        <Human2 L={L} x={620} y={985} s={0.62} f={f} pose={book ? "present" : "chin"} expr="thinking" look={1} />
        {book && <g transform="translate(700,640) rotate(-8)"><rect x={-70} y={-50} width={140} height={100} rx={8} fill="#7A3A2A" /><rect x={-62} y={-42} width={124} height={84} rx={4} fill="#F4EEDC" /><line x1={0} y1={-42} x2={0} y2={42} stroke="#7A3A2A" strokeWidth={4} /></g>}
      </MoonFields>
      <Over>
        {lens && <g><ellipse cx={1220} cy={690} rx={230} ry={70} fill="#CFE8FF" opacity={0.25} stroke="#CFE8FF" strokeWidth={6} /><g opacity={cross}><line x1={1000} y1={520} x2={1440} y2={860} stroke="#FF4D6D" strokeWidth={22} strokeLinecap="round" /><line x1={1440} y1={520} x2={1000} y2={860} stroke="#FF4D6D" strokeWidth={22} strokeLinecap="round" /></g></g>}
        {haze && <rect x={0} y={560} width={W} height={260} fill="#C8B8D8" opacity={0.25 + 0.05 * Math.sin(f / 10)} />}
      </Over>
      <Era name={name} when={when} />
    </AbsoluteFill>
  );
};
const S19: React.FC = () => <ScholarScene L={ARISTOTLE} name="ARISTOTLE" when="4th CENTURY BC" />;
const S20: React.FC = () => <ScholarScene L={PTOLEMY} name="PTOLEMY" when="'THE AIR IS ENLARGING IT'" lens />;
const S21: React.FC = () => <ScholarScene L={CLEOMEDES} name="CLEOMEDES" when="~1,800 YEARS AGO" haze />;
// 22. ROBOT: "I also blame the air. For most things."
const S22: React.FC = () => (
  <MoonFields moon={{ x: 1300, y: 690, r: 140, tint: 1 }} night={0.7}>
    <Bot x={760} y={1000} s={0.6} look={1} mood="smug" />
  </MoonFields>
);
// 23. Ibn al-Haytham: it's about how far away the moon seems
const S23: React.FC = () => <ScholarScene L={HAYTHAM} name="IBN AL-HAYTHAM" when="~1,000 YEARS AGO" book />;
// 24. books on vision, kept part of the old air explanation
const S24: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="happy" pose="present">
      <ScrTitle t="BOOK OF OPTICS" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={160} y={480 - i * 56} width={300 - (i % 2) * 20} height={48} rx={6} fill={["#7A3A2A", "#3A6A5A", "#8A6A2A", "#4A3A7A", "#6A2A3A"][i]} opacity={sp(f, i * 6, 12)} />)}
      <circle cx={760} cy={330} r={46} fill="#F4EEE2" /><circle cx={775} cy={330} r={20} fill="#2A4A7A" />
      {[-60, 0, 60].map((d, i) => <line key={i} x1={1000} y1={330 + d * 2} x2={800} y2={330 + d * 0.2} stroke="#FFD23F" strokeWidth={4} opacity={lerp(f, 30 + i * 8, 50 + i * 8, 0, 1)} />)}
      <Tag t="+ SOME OF THE OLD 'AIR' IDEA" x={760} y={540} at={120} c="#FFB060" size={32} />
    </Screen>
  );
};
// 25. stuff in between makes the horizon feel far
const S25: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 1300, y: 700, r: 130, tint: 1 }} night={0.6}>
        <Human2 L={AV("Sofia")} x={300} y={1000} s={0.55} f={f} look={1} />
      </MoonFields>
      <Over>
        {Array.from({ length: 14 }, (_, i) => { const t = i / 13; return <circle key={i} cx={380 + t * 880} cy={940 - t * 230} r={10 - t * 5} fill="#FFD23F" opacity={lerp(f, 10 + i * 6, 20 + i * 6, 0, 1)} />; })}
        {["FIELDS", "TREES", "HILLS", "HOUSES"].map((t, i) => <Tag key={t} t={t} x={520 + i * 220} y={860 - i * 60} at={20 + i * 14} c="#FFFFFF" size={30} />)}
      </Over>
    </AbsoluteFill>
  );
};
// 26. the flattened dome
const S26: React.FC = () => {
  const f = useCurrentFrame();
  const a = lerp(f, 30, 200, Math.PI * 0.97, Math.PI * 0.5);
  const mx = W / 2 + Math.cos(a) * 760, my = 860 - Math.sin(a) * 330;
  return (
    <Stage k="deep" lx={W / 2} ly={420} rays={false}>
      <Stars seed={11} n={70} y1={900} />
      <path d={`M${W / 2 - 760} 860 A 760 760 0 0 1 ${W / 2 + 760} 860`} fill="none" stroke="#9FB0D8" strokeWidth={4} strokeDasharray="14 12" opacity={0.6} />
      <path d={`M${W / 2 - 760} 860 A 760 330 0 0 1 ${W / 2 + 760} 860`} fill="#7FE8FF" opacity={0.08} stroke="#7FE8FF" strokeWidth={8} />
      <rect x={0} y={860} width={W} height={220} fill="#1E3A2A" />
      <circle cx={W / 2} cy={840} r={18} fill="#F4EEE2" />
      <line x1={W / 2} y1={840} x2={mx} y2={my} stroke="#FFD23F" strokeWidth={4} opacity={0.7} />
      <Moon id="s26" x={mx} y={my} r={46} tint={Math.max(0, Math.cos(a) * -1)} glow={0.4} />
      <Tag t="FAR AT THE EDGES" x={400} y={680} at={20} c="#7FE8FF" size={36} />
      <Tag t="CLOSE AT THE TOP" x={W / 2} y={460} at={60} c="#7FE8FF" size={36} />
    </Stage>
  );
};
// 27. same image in the eye; the one that seems farther must be bigger
const S27: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="lab" lx={W / 2} ly={420} rays={false}>
      <circle cx={260} cy={540} r={70} fill="#F4EEE2" /><circle cx={290} cy={540} r={28} fill="#2A4A7A" />
      <path d="M330 540 L 1800 260 M330 540 L 1800 820" stroke="#FFD23F" strokeWidth={4} opacity={0.6} />
      <Moon id="s27a" x={800} y={540} r={90} tint={0} glow={0.2} />
      <g opacity={lerp(f, 40, 70, 0, 1)}><Moon id="s27b" x={1600} y={540} r={240} tint={1} glow={0.3} /></g>
      <Tag t="SEEMS NEAR → SMALL" x={800} y={240} at={20} c="#FFFFFF" size={36} />
      <Tag t="SEEMS FAR → BIG" x={1600} y={180} at={60} c="#FFD27A" size={36} />
    </Stage>
  );
};
// 28. Ponzo: the two bars are the same length
const S28: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="dusk" lx={W / 2} ly={420} rays={false}>
      <Ponzo x={W / 2} y={560} s={1.15} measure={lerp(f, 90, 180, 0.001, 1, Easing.inOut(Easing.cubic))} />
      <Big t="SAME LENGTH" y={150} size={90} c="#FFD23F" at={180} />
    </Stage>
  );
};

// =========================== CHAPTER 3: YOUR BRAIN IS A BAD RULER ===========================
// 29. 1962: Kaufman and Rock test it
const S29: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LabWide>
      <Human2 L={AV("Kenji")} x={760} y={1010} s={0.56} f={f} pose="chin" expr="thinking" look={1} />
      <Human2 L={AV("Ethan")} x={1300} y={1010} s={0.56} f={f + 7} pose="point" look={-1} />
      <Thing name="telescope" x={1030} y={1010} s={0.7} f={f} />
      <Tag t="1962" x={W / 2} y={170} at={6} c="#FFD23F" size={70} />
    </LabWide>
  );
};
// 30. eye angle didn't matter much
const S30: React.FC = () => {
  const f = useCurrentFrame();
  const flip = lerp(f, 20, 40, 1, 0);
  const needle = -60 + Math.sin(f / 6) * 4;
  return (
    <Screen expr="neutral">
      <ScrTitle t="EYE ANGLE?" />
      <rect x={160} y={160} width={140} height={320} rx={44} fill="#0B1033" stroke="#2A4A7A" strokeWidth={4} />
      <rect x={172} y={172 + (1 - flip) * 160} width={116} height={140} rx={34} fill={flip > 0.5 ? "#2FE08A" : "#FF4D6D"} />
      <g transform="translate(720,440)">
        <path d="M-220 0 A 220 220 0 0 1 220 0" fill="none" stroke="#F4EEE2" strokeWidth={10} />
        <line x1={0} y1={0} x2={Math.cos((needle - 90) * Math.PI / 180) * -200} y2={Math.sin((needle - 90) * Math.PI / 180) * 200} stroke="#FF4D6D" strokeWidth={10} strokeLinecap="round" />
        <text y={70} textAnchor="middle" fontFamily="Arial Black" fontSize={32} fill="#F4EEE2">ILLUSION STRENGTH</text>
      </g>
      <Tag t="BARELY CHANGES" x={720} y={150} at={60} c="#FFD23F" size={36} />
    </Screen>
  );
};
// 31. block the landscape: the giant moon shrinks
const S31: React.FC = () => {
  const f = useCurrentFrame();
  const card = lerp(f, 20, 60, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 960, y: 690, r: lerp(f, 60, 110, 160, 110), tint: 1 }} night={0.6} />
      <Over>
        <rect x={0} y={H - card * 420} width={W} height={420} fill="#14123A" />
        <rect x={0} y={H - card * 420} width={W} height={12} fill="#7FE8FF" />
        <Tag t="LANDSCAPE HIDDEN" x={W / 2} y={H - card * 420 + 120} at={50} c="#7FE8FF" size={44} />
      </Over>
    </AbsoluteFill>
  );
};
// 32. 2000: father and son, artificial moons in the real sky
const S32: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LabWide>
      <Human2 L={AV("Arjun")} x={760} y={1010} s={0.56} f={f} pose="present" expr="happy" look={1} />
      <Human2 L={AV("Mateo")} x={1300} y={1010} s={0.5} f={f + 7} pose="chin" expr="thinking" look={-1} />
      <Thing name="telescope" x={1030} y={1010} s={0.7} f={f} />
      {[0, 1].map((i) => <Moon key={i} id={`s32${i}`} x={820 + i * 360} y={330 - i * 80} r={46} tint={i ? 0 : 0.8} glow={0.6 + 0.2 * Math.sin(f / 8 + i)} />)}
      <Tag t="2000" x={W / 2} y={150} at={6} c="#FFD23F" size={70} />
    </LabWide>
  );
};
// 33. horizon moon set ~4× farther
const S33: React.FC = () => {
  const f = useCurrentFrame();
  const g = lerp(f, 20, 80, 0, 1);
  return (
    <Screen expr="surprised" pose="present">
      <ScrTitle t="WHERE PEOPLE PUT THE MOON" />
      <line x1={120} y1={420} x2={1000} y2={420} stroke="#F4EEE2" strokeWidth={6} />
      <circle cx={120} cy={420} r={14} fill="#F4EEE2" />
      <Moon id="s33a" x={120 + 180 * g} y={300} r={30} tint={0} glow={0.3} />
      <Moon id="s33b" x={120 + 760 * g} y={300} r={30} tint={1} glow={0.3} />
      <text x={120 + 180 * g} y={480} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#F4EEE2">HIGH</text>
      <text x={120 + 760 * g} y={480} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#FFB060">HORIZON</text>
      <Tag t="≈ 4× FARTHER" x={760} y={190} at={80} c="#FFD23F" size={44} />
    </Screen>
  );
};
// 34. most say the giant moon looks closer
const S34: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonCity moon={{ x: 1300, y: 560, r: 190, tint: 1 }}>
        {["Amara", "Priya", "Claire"].map((n, i) => <Human2 key={n} L={AV(n)} x={420 + i * 230} y={930} s={0.56} f={f + i * 8} expr="surprised" look={1} />)}
      </MoonCity>
      <Over>{[0, 1, 2].map((i) => <Tag key={i} t="CLOSER!" x={420 + i * 230} y={380} at={20 + i * 10} c="#FFFFFF" size={34} />)}</Over>
    </AbsoluteFill>
  );
};
// 35. ROBOT: "far, and also near. That explains my driving."
const S35: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <MoonCity moon={{ x: 1450, y: 560, r: 150, tint: 0.9 }}>
      <Thing name="car" x={1000 + Math.sin(f / 5) * 20} y={950} s={0.9} f={f} />
      <Bot x={560} y={960} s={0.6} look={1} mood="happy" />
    </MoonCity>
  );
};
// 36. DOC: "Really, man?"
const S36: React.FC = () => <LabWide><DocAt x={W / 2} y={1150} s={0.95} pose="crossed" expr="unamused" look={0} /></LabWide>;
// 37. the paradox loop: FAR → BIG → CLOSE
const S37: React.FC = () => {
  const f = useCurrentFrame();
  const steps = ["FAR AWAY", "SO: BIG", "SO: CLOSE?!"];
  return (
    <Screen expr="thinking" pose="chin">
      <ScrTitle t="A PARADOX" />
      {steps.map((s, i) => (
        <g key={s} opacity={sp(f, 10 + i * 40, 10)}>
          <rect x={90 + i * 340} y={250} width={280} height={110} rx={24} fill={i === 2 ? "#FF4D6D" : "#2A4A7A"} />
          <text x={230 + i * 340} y={318} textAnchor="middle" fontFamily="Arial Black" fontSize={36} fill="#F4EEE2">{s}</text>
          {i < 2 && <path d={`M${375 + i * 340} 305 l 50 0 m -16 -16 l 16 16 l -16 16`} stroke="#FFD23F" strokeWidth={6} fill="none" />}
        </g>
      ))}
      <path d="M910 380 Q 550 560 230 380" stroke="#FFD23F" strokeWidth={5} fill="none" strokeDasharray="14 10" opacity={lerp(f, 130, 150, 0, 1)} />
    </Screen>
  );
};
// 38. relative size: tiny trees vs empty sky
const S38: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 480, y: 720, r: 110, tint: 1 }} night={0.6} />
      <div style={{ position: "absolute", left: W / 2, top: 0, width: W / 2, height: H, background: "#0B0F3A", borderLeft: "8px solid #FFD23F" }}>
        <svg width={W / 2} height={H}><Stars seed={14} n={40} /><Moon id="s38" x={W / 4} y={420} r={110} tint={0} glow={0.4} /></svg>
      </div>
      <Over><Tag t="NEXT TO TINY TREES" x={480} y={170} at={10} c="#FFFFFF" size={38} /><Tag t="ALONE IN A HUGE SKY" x={1440} y={170} at={30} c="#FFFFFF" size={38} /></Over>
    </AbsoluteFill>
  );
};
// 39. sailors: empty ocean, still giant
const S39: React.FC = () => (
  <AbsoluteFill>
    <MoonSea moon={{ x: 960, y: 600, r: 170, tint: 1 }} />
    <Over><Tag t="NOTHING TO COMPARE IT TO" x={W / 2} y={170} at={20} c="#FFFFFF" size={44} /></Over>
  </AbsoluteFill>
);
// 40. eyes focusing and pointing
const S40: React.FC = () => {
  const f = useCurrentFrame();
  const c = Math.sin(f / 15) * 10;
  return (
    <Screen expr="thinking" pose="chin">
      <ScrTitle t="YOUR EYES?" />
      {[380, 720].map((x, i) => <g key={x}><circle cx={x} cy={330} r={110} fill="#F4EEE2" /><circle cx={x + (i ? -1 : 1) * (20 + c)} cy={330} r={46} fill="#3A6AA8" /><circle cx={x + (i ? -1 : 1) * (20 + c)} cy={330} r={20} fill="#0B1228" /></g>)}
      <Tag t="FOCUS + POINTING" x={550} y={520} at={40} c="#FFD23F" size={36} />
    </Screen>
  );
};
// 41. bend over: upside-down view, smaller moon
const S41: React.FC = () => {
  const f = useCurrentFrame();
  const flip = f > 60;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: flip ? "rotate(180deg)" : undefined }}>
        <MoonFields moon={{ x: 960, y: 690, r: flip ? lerp(f, 60, 110, 150, 115) : 150, tint: 1 }} night={0.6} />
      </div>
      <Over><Tag t={flip ? "UPSIDE DOWN: SMALLER (FOR MANY)" : "BEND OVER..."} x={W / 2} y={160} at={flip ? 66 : 6} c="#FFFFFF" size={44} /></Over>
    </AbsoluteFill>
  );
};
// 42. ROBOT: "The neighbours are going to love this episode." (upside down on the roof)
const S42: React.FC = () => (
  <MoonCity moon={{ x: 1400, y: 560, r: 150, tint: 0.9 }}>
    <Bot x={760} y={700} s={0.6} rot={180} mood="happy" />
  </MoonCity>
);
// 43. constellations look bigger near the horizon too
const S43: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerp(f, 30, 180, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <MoonSea />
      <Over><Orion x={500 + t * 600} y={520 - t * 320} s={1.6 - t * 0.6} /><Tag t="ORION" x={500 + t * 600} y={760 - t * 320} at={10} c="#CFE0FF" size={34} /></Over>
    </AbsoluteFill>
  );
};
// 44. no single winning explanation: "we don't really know"
const S44: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="thinking" pose="chin">
      <g transform={`translate(550,300) scale(${sp(f, 60, 10)}) rotate(-3)`}>
        <rect x={-430} y={-110} width={860} height={220} rx={24} fill="#F4EEE2" />
        <text textAnchor="middle" y={-10} fontFamily="Arial Black" fontSize={62} fill={INK}>"WE DON'T</text>
        <text textAnchor="middle" y={64} fontFamily="Arial Black" fontSize={62} fill={INK}>REALLY KNOW"</text>
      </g>
      <text x={550} y={540} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#9FB0D8" opacity={lerp(f, 90, 110, 0, 1)}>A NASA SCIENTIST, ASKED THIS EXACT QUESTION</text>
    </Screen>
  );
};

// =========================== CHAPTER 4: WHAT REALLY CHANGES ===========================
const Orbit: React.FC<{ at: number; label?: "SUPERMOON" | "MICROMOON" }> = ({ at, label }) => {
  const f = useCurrentFrame();
  const a = at === 0 ? f / 30 : at;
  const cx = 550, cy = 330, rx = 380, ry = 200, off = 70;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#9FB0D8" strokeWidth={4} strokeDasharray="12 10" />
      <circle cx={cx - off} cy={cy} r={50} fill="#3A7AD8" />
      <Moon id={`orb${label ?? ""}`} x={cx + Math.cos(a) * rx} y={cy + Math.sin(a) * ry} r={label === "SUPERMOON" ? 34 : label === "MICROMOON" ? 22 : 28} tint={0} glow={0.4} />
      {label && <Tag t={label} x={cx + Math.cos(a) * rx} y={cy + Math.sin(a) * ry - 90} at={10} c="#FFD23F" size={30} />}
    </g>
  );
};
const S45: React.FC = () => <Screen expr="neutral"><ScrTitle t="A SLIGHTLY OVAL ORBIT" /><Orbit at={0} /></Screen>;
const S46: React.FC = () => <Screen expr="neutral"><ScrTitle t="CLOSEST + FULL" /><Orbit at={Math.PI} label="SUPERMOON" /></Screen>;
const Discs: React.FC<{ micro?: boolean }> = ({ micro }) => {
  const f = useCurrentFrame();
  return (
    <Stage k="deep" lx={W / 2} ly={420} rays={false}>
      <Stars seed={19} n={80} y1={1080} />
      <Moon id="dbig" x={620} y={540} r={300} tint={0} glow={0.6 + (micro ? 0 : 0.3)} />
      <Moon id="dsml" x={1380} y={560} r={263} tint={0} glow={0.3} />
      <Tag t="+ UP TO 14% WIDER, 30% BRIGHTER" x={620} y={150} at={20} c="#FFD23F" size={40} />
      {micro && <Tag t="MICROMOON" x={1380} y={920} at={8} c="#9FB0D8" size={44} />}
      {!micro && <Tag t="SMALLEST FULL MOON" x={1380} y={920} at={40} c="#9FB0D8" size={36} />}
    </Stage>
  );
};
const S47: React.FC = () => <Discs />;
const S48: React.FC = () => <Discs micro />;
// 49. supermoon +14% vs your brain +~33–50%
const S49: React.FC = () => (
  <Screen expr="happy" pose="present">
    <ScrTitle t="WHICH ADDS MORE?" />
    <Bars at={10} items={[{ l: "SUPERMOON", v: 0.3, c: "#9FB0D8" }, { l: "YOUR BRAIN", v: 0.9, c: "#FF8A1F" }]} />
    <text x={367} y={180} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">~14%</text>
    <text x={733} y={120} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">~33–50%</text>
  </Screen>
);
// 50–51. ROBOT: "my brain is the real supermoon." Doc lets it go
const S50: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="deep" lx={W / 2} ly={420}>
      <Stars seed={23} n={70} y1={1080} />
      <Bot x={760} y={1020} s={0.7} look={1} mood="happy" />
      <g opacity={lerp(f, 10, 30, 0, 1)}><Brain id="s50" x={1300} y={420} s={0.55} f={f} /></g>
      <Tag t="SUPERMOON?" x={1300} y={690} at={20} c="#FFD23F" size={40} />
    </Stage>
  );
};
const S51: React.FC = () => <Wide expr="happy" pose="shrug" />;
// 52. shallow evening angle in autumn
const S52: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="neutral">
      <ScrTitle t="THE MOON'S PATH AT DUSK" />
      <rect x={0} y={440} width={1100} height={160} fill="#1E3A2A" />
      <line x1={300} y1={440} x2={480} y2={120} stroke="#9FB0D8" strokeWidth={5} strokeDasharray="12 10" />
      <text x={330} y={110} fontFamily="Arial Black" fontSize={26} fill="#9FB0D8">SPRING: STEEP</text>
      <line x1={560} y1={440} x2={1040} y2={290} stroke="#FFD23F" strokeWidth={7} />
      <text x={760} y={270} fontFamily="Arial Black" fontSize={30} fill="#FFD23F">AUTUMN: SHALLOW</text>
      <Moon id="s52" x={lerp(f, 20, 160, 600, 960)} y={lerp(f, 20, 160, 428, 316)} r={22} tint={1} glow={0.4} />
    </Screen>
  );
};
// 53. rises only ~30 min later each night
const S53: React.FC = () => {
  const f = useCurrentFrame();
  const night = Math.min(2, Math.floor(f / 80));
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 900 + night * 70, y: 720 - (f % 80) * 0.6, r: 120, tint: 1 }} night={0.5 + night * 0.05} />
      <Over>
        <Tag t={`NIGHT ${night + 1}`} x={W / 2} y={160} at={night * 80} c="#FFFFFF" size={50} />
        <Tag t="~30 MIN LATER, NOT ~50" x={W / 2} y={270} at={20} c="#FFD23F" size={40} />
      </Over>
    </AbsoluteFill>
  );
};
// 54. before electric lights: hunters stocking up (the old story)
const S54: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonFields moon={{ x: 1200, y: 640, r: 140, tint: 0.9 }} night={0.75}>
        <Human2 L={SCH("hunter", ["#F2CCA8", "#DDB088", "#C08E68", "#9E6E4A"], ["#8A6044", "#5E3E28", "#3A2416"], "#6A4A2A")} x={640} y={985} s={0.6} f={f / 2} pose="walk" look={1} />
        <g transform="translate(720,700)"><line x1={0} y1={-60} x2={0} y2={0} stroke="#3A2A20" strokeWidth={4} /><rect x={-22} y={0} width={44} height={56} rx={8} fill="#3A2A20" /><rect x={-16} y={6} width={32} height={42} rx={6} fill="#FFD27A" /><circle cx={0} cy={28} r={70} fill="#FFD27A" opacity={0.18} /></g>
      </MoonFields>
      <Over><Tag t="'HUNTER'S MOON'" x={W / 2} y={160} at={40} c="#FFD27A" size={56} /></Over>
    </AbsoluteFill>
  );
};
// 55. a run of supermoons: three or four, depending who's counting
const S55: React.FC = () => {
  const f = useCurrentFrame();
  const months = ["NOV", "DEC", "JAN", "FEB"];
  return (
    <Stage k="deep" lx={W / 2} ly={420} rays={false}>
      <Stars seed={29} n={80} y1={1080} />
      {months.map((m, i) => (
        <g key={m} transform={`translate(${330 + i * 420},560) scale(${sp(f, 10 + i * 14, 11)})`} opacity={i === 3 ? 0.45 : 1}>
          <rect x={-170} y={-220} width={340} height={420} rx={24} fill="#F4EEE2" />
          <rect x={-170} y={-220} width={340} height={90} rx={24} fill="#FF4D6D" />
          <text y={-158} textAnchor="middle" fontFamily="Arial Black" fontSize={52} fill="#FFFFFF">{m}</text>
          <Moon id={`s55${i}`} x={0} y={50} r={100} tint={0} glow={0.2} />
          {i === 3 && <text y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={160} fill={INK}>?</text>}
        </g>
      ))}
      <Big t="SUPERMOON SEASON" y={170} size={96} c="#FFD23F" at={60} />
    </Stage>
  );
};

// =========================== OUTRO ===========================
// 56. enjoy it this weekend
const S56: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <MoonCity moon={{ x: 1160, y: rise(f, 0, 200, 760, 600), r: 190, tint: 1 }}>
      {["Marcus", "Mei", "Mateo", "Sofia"].map((n, i) => <Human2 key={n} L={AV(n)} x={360 + i * 200} y={930} s={0.55} f={f + i * 6} expr="happy" look={1} />)}
    </MoonCity>
  );
};
// 57. try the pea, the photo, the upside-down thing (3-up montage)
const S57: React.FC = () => {
  const f = useCurrentFrame();
  const pane = (i: number, child: React.ReactNode, label: string) => (
    <div key={i} style={{ position: "absolute", left: i * 640, top: 0, width: 640, height: H, overflow: "hidden", borderRight: i < 2 ? "8px solid #0B1033" : undefined, opacity: sp(f, i * 25, 12) }}>
      <div style={{ position: "absolute", left: -640, top: 0, width: W, height: H, transform: label === "UPSIDE DOWN" ? "rotate(180deg)" : undefined }}>{child}</div>
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", fontFamily: "Arial Black", fontSize: 54, color: "#FFD23F", textShadow: "0 6px 0 #2A0F5A" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {pane(0, <MoonFields moon={{ x: 960, y: 640, r: 110, tint: 1 }} night={0.6} />, "THE PEA")}
      {pane(1, <MoonSea moon={{ x: 960, y: 560, r: 110, tint: 0.7 }} />, "THE PHOTO")}
      {pane(2, <MoonFields moon={{ x: 960, y: 690, r: 110, tint: 1 }} night={0.6} />, "UPSIDE DOWN")}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><circle cx={320} cy={640} r={113} fill="#6AB84A" opacity={sp(f, 20, 12)} /></svg>
    </AbsoluteFill>
  );
};
// 58. two photos side by side: same moon
const S58: React.FC = () => {
  const f = useCurrentFrame();
  const slide = lerp(f, 70, 120, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Stage k="lab" lx={W / 2} ly={420} rays={false}>
      <g transform="translate(960,560)">
        <rect x={-440} y={-430} width={880} height={860} rx={60} fill="#1B1240" />
        <rect x={-410} y={-380} width={820} height={760} rx={30} fill="#0B1228" />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${(i ? 200 : -200) * (1 - slide)},0)`}>
            <rect x={-180} y={-300} width={360} height={600} rx={14} fill={i ? "#0B0F3A" : "#3A2A5A"} stroke="#F4EEE2" strokeWidth={6} opacity={1 - slide * 0.6} />
            <Moon id={`s58${i}`} x={0} y={i ? -100 : 150} r={70} tint={i ? 0 : 1} glow={0.3} />
          </g>
        ))}
      </g>
      <Big t="SAME MOON" y={150} size={96} c="#7FE8FF" at={120} />
    </Stage>
  );
};
// 59. your brain still insists
const S59: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MoonCity moon={{ x: 1400, y: 560, r: 170, tint: 1 }} roof>
        <Human2 L={AV("Mateo")} x={720} y={930} s={0.6} f={f} pose="chin" expr="skeptical" look={1} />
      </MoonCity>
      <Over><g opacity={lerp(f, 30, 50, 0, 1)}><Brain id="s59" x={720} y={330} s={0.4} f={f} /><text x={720} y={520} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFD23F">"NO, IT'S BIGGER."</text></g></Over>
    </AbsoluteFill>
  );
};
// 60. the most interesting thing is the brain looking at it
const S60: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, 240, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Stage k="deep" lx={W / 2} ly={420} rays={false}>
      <Stars seed={31} n={100} y1={1080} />
      <g opacity={1 - z}><Moon id="s60" x={W / 2} y={540} r={300} tint={0.5} /></g>
      <g opacity={z} transform={`translate(${W / 2},560) scale(${0.6 + z * 0.4})`}><Brain id="s60b" x={0} y={0} s={1.1} f={f} lobes /></g>
    </Stage>
  );
};
// 61–62. ROBOT: "Also the moon." DOC: "Fine. Also the moon."
const S61: React.FC = () => (
  <MoonCity moon={{ x: 1300, y: 520, r: 200, tint: 0.8 }}>
    <Bot x={600} y={960} s={0.6} look={1} mood="happy" />
    <DocAt x={900} y={940} s={0.6} pose="crossed" expr="unamused" look={1} />
  </MoonCity>
);
// 63. end card
const S63: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <LabWide>
      <DocAt x={1290} y={1010} pose="present" expr="happy" />
      <Bot x={900} y={1010} s={0.55} look={1} mood="happy" />
      <Tag t="BIGGER WHEN IT RISES? OR IMMUNE?" x={W / 2} y={160} at={20} c="#FFD23F" size={48} />
      <Tag t="SUBSCRIBE" x={W / 2} y={280} at={60} c="#FF4D6D" size={44} />
    </LabWide>
  );
};

type MoonScene = { line: number; C: React.FC; doc?: "bl" | "br"; expr?: DocExpr };
const SCENES: MoonScene[] = [
  { line: 1, C: S1 }, { line: 2, C: S2 }, { line: 3, C: S3 }, { line: 4, C: S4 },
  { line: 5, C: S5 }, { line: 6, C: S6 }, { line: 7, C: S7 }, { line: 8, C: S8 }, { line: 10, C: S10 }, { line: 11, C: S11 },
  { line: 12, C: S12, doc: "br", expr: "unamused" }, { line: 13, C: S13 }, { line: 14, C: S14 }, { line: 15, C: S15 }, { line: 16, C: S16 }, { line: 17, C: S17, doc: "br", expr: "happy" },
  { line: 18, C: S18, doc: "br" }, { line: 19, C: S19 }, { line: 20, C: S20 }, { line: 21, C: S21 }, { line: 22, C: S22, doc: "br", expr: "skeptical" },
  { line: 23, C: S23 }, { line: 24, C: S24 }, { line: 25, C: S25 }, { line: 26, C: S26 }, { line: 27, C: S27 }, { line: 28, C: S28 },
  { line: 29, C: S29 }, { line: 30, C: S30 }, { line: 31, C: S31 }, { line: 32, C: S32 }, { line: 33, C: S33 }, { line: 34, C: S34 },
  { line: 35, C: S35, doc: "br", expr: "unamused" }, { line: 36, C: S36 }, { line: 37, C: S37 }, { line: 38, C: S38 }, { line: 39, C: S39 },
  { line: 40, C: S40 }, { line: 41, C: S41 }, { line: 42, C: S42, doc: "br", expr: "unamused" }, { line: 43, C: S43, doc: "bl" }, { line: 44, C: S44 },
  { line: 45, C: S45 }, { line: 46, C: S46 }, { line: 47, C: S47, doc: "bl" }, { line: 48, C: S48, doc: "bl" }, { line: 49, C: S49 },
  { line: 50, C: S50, doc: "br", expr: "skeptical" }, { line: 51, C: S51 }, { line: 52, C: S52 }, { line: 53, C: S53 }, { line: 54, C: S54 }, { line: 55, C: S55, doc: "bl", expr: "happy" },
  { line: 56, C: S56, doc: "bl", expr: "happy" }, { line: 57, C: S57 }, { line: 58, C: S58 }, { line: 59, C: S59 }, { line: 60, C: S60 },
  { line: 61, C: S61 }, { line: 63, C: S63 },
];

const spans = SCENES.map((s, i) => {
  const from = i === 0 ? 0 : T.lineStart(s.line) - 5;
  const next = SCENES[i + 1]?.line;
  const to = next ? T.lineStart(next) - 5 : T.TOTAL;
  return { from, dur: Math.max(1, to - from) };
});
export const MOON_FRAMES = spans[spans.length - 1].from + spans[spans.length - 1].dur;
export const MOON_SCENE_STARTS = spans.map((s) => s.from);
export const MOON_HAS_VO = !(LINES[0] as Line & { placeholder?: boolean }).placeholder;

export const MoonEpisode: React.FC = () => (
  <LinesCtx.Provider value={LINES}>
    <AbsoluteFill style={{ background: "#05030F" }}>
      {MOON_HAS_VO && <Audio src={staticFile("moon_vo.wav")} />}
      {SCENES.map((s, i) => (
        <Sequence key={i} from={spans[i].from} durationInFrames={spans[i].dur}>
          <OffsetCtx.Provider value={spans[i].from}>
            <s.C />
            {s.doc && <Presenter side={s.doc} enter={spans[i].from} expr={s.expr} />}
          </OffsetCtx.Provider>
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  </LinesCtx.Provider>
);
