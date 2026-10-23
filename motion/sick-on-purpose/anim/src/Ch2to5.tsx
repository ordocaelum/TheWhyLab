// Chapters 2–5 + outro (script lines 21–62), built from the asset library.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Cell, Germ } from "./chars";
import { H, INK, lerp, Sparkle, sp, Stage, W } from "./kit";
import { SceneDef, useTalking } from "./timing";
import { CellField, Dapple, Foliage } from "./gen";
import { DocExpr, DocPose, DocV2 } from "./doc2";
import { LabBench, LabScreen, LabWide } from "./sets";
import { Desert } from "./landscapes";
import { Bedroom, Kitchen, LivingRoom } from "./interiors";
import { Street } from "./urban";
import { Thing } from "./objects";
import { AVATARS, Human2 } from "./human2";
import { Ant, Bat, Bee, Lizard, Mouse } from "./critters";
import { Robot } from "./robot";
import { SickInBed } from "./sickbed";

// sidekick robot, mouth synced to the sidekick voice track (CELL lines in lines.json)
const Bot: React.FC<{ x: number; y: number; s?: number; look?: number; mood?: "happy" | "smug" | "alert" | "sad" }> = ({ x, y, s = 0.8, look = 0, mood = "smug" }) => {
  const f = useCurrentFrame();
  const talk = useTalking("CELL");
  return <Robot x={x} y={y} s={s} f={f} talk={talk} mood={mood} look={look} />;
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const AV = (n: string) => AVATARS.find((a) => a.name === n)!.L;

// ---------- shared pieces ----------
const Over: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
// stamped title with ink drop-shadow
const Big: React.FC<{ t: string; x?: number; y: number; size?: number; c?: string; at?: number; rot?: number }> = ({ t, x = W / 2, y, size = 130, c = "#FFFFFF", at = 0, rot = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [at, at + 7, at + 12], [2.4, 0.92, 1], clamp);
  if (f < at) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={INK} dy={10}>{t}</text>
      <text textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={c}>{t}</text>
    </g>
  );
};
const Tag: React.FC<{ t: string; x: number; y: number; at?: number; c?: string; size?: number }> = ({ t, x, y, at = 0, c = "#FFD23F", size = 46 }) => {
  const f = useCurrentFrame();
  const s = sp(f, at, 10);
  const w = t.length * size * 0.72 + 60;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.5} rx={size * 0.75} fill={c} />
      <text textAnchor="middle" y={size * 0.12} fontFamily="Arial Black" fontSize={size} fill={INK}>{t}</text>
    </g>
  );
};
// Doc on the lab screen set, pointing at whatever the screen shows (1100x600 local coords)
const Screen: React.FC<{ children: React.ReactNode; expr?: DocExpr; pose?: DocPose }> = ({ children, expr = "neutral", pose = "point" }) => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return <LabScreen screen={children} actor={<DocV2 x={300} y={1260} s={1.0} f={f} talk={talk} pose={pose} expr={expr} />} />;
};
const ScrTitle: React.FC<{ t: string; y?: number; size?: number; c?: string }> = ({ t, y = 80, size = 56, c = "#F4EEE2" }) => (
  <text x={550} y={y} textAnchor="middle" fontFamily="Arial Black" fontSize={size} fill={c}>{t}</text>
);
// survival-style bar pair on the screen
const Bars: React.FC<{ items: { l: string; v: number; c: string }[]; at?: number; y0?: number }> = ({ items, at = 0, y0 = 500 }) => {
  const f = useCurrentFrame();
  const n = items.length, gap = 1100 / (n + 1);
  return (
    <g>
      <line x1={120} y1={y0} x2={980} y2={y0} stroke="#7FA8D8" strokeWidth={4} />
      {items.map((it, i) => {
        const h = it.v * 300 * lerp(f, at + i * 10, at + i * 10 + 30, 0, 1);
        const x = gap * (i + 1);
        return (
          <g key={i}>
            <rect x={x - 90} y={y0 - h} width={180} height={h} rx={14} fill={it.c} />
            <rect x={x - 76} y={y0 - h + 10} width={30} height={Math.max(0, h - 20)} rx={10} fill="#FFFFFF" opacity={0.25} />
            <text x={x} y={y0 + 50} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">{it.l}</text>
          </g>
        );
      })}
    </g>
  );
};
// wide lab shot with Doc somewhere
const Wide: React.FC<{ expr?: DocExpr; pose?: DocPose; x?: number; children?: React.ReactNode; lights?: number }> = ({ expr = "neutral", pose = "present", x = 1290, children, lights }) => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return <LabWide lights={lights}><DocV2 x={x} y={1010} s={0.62} f={f} talk={talk} pose={pose} expr={expr} look={-1} />{children}</LabWide>;
};
// heat shimmer lines
const Heat: React.FC<{ x: number; y: number; f: number; n?: number; c?: string }> = ({ x, y, f, n = 4, c = "#FFB347" }) => (
  <g stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7}>
    {Array.from({ length: n }, (_, i) => {
      const yy = y - ((f * 3 + i * 40) % 160);
      return <path key={i} d={`M${x - 60 + i * 40} ${yy} q 12 -16 0 -32 q -12 -16 0 -32`} opacity={1 - ((f * 3 + i * 40) % 160) / 160} />;
    })}
  </g>
);
// stylised big thermometer (vertical), t in 0..1
const Thermo: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-40} y={-520} width={80} height={520} rx={40} fill="#F4F6FF" />
    <rect x={-22} y={-500 + (1 - t) * 440} width={44} height={60 + t * 440} rx={22} fill="#FF4D3D" />
    <circle cx={0} cy={20} r={70} fill="#F4F6FF" /><circle cx={0} cy={20} r={52} fill="#FF4D3D" />
    <circle cx={-18} cy={4} r={14} fill="#FFFFFF" opacity={0.5} />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={40} y={-460 + i * 54} width={i % 2 ? 22 : 36} height={6} rx={3} fill="#1B1240" opacity={0.5} />)}
  </g>
);

// =========================== CHAPTER 2: THE FURNACE ===========================
// 21. "That weapon is fever."
const S21: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="alarm" lx={W / 2} ly={460}>
      <Thermo x={W / 2 - 520} y={880} t={lerp(f, 0, 40, 0.3, 0.9)} s={1.2} />
      <Heat x={W / 2 - 520} y={260} f={f} />
      <Big t="FEVER" x={W / 2 + 200} y={600} size={260} c="#FFE066" at={6} rot={-4} />
    </Stage>
  );
};
// 22. heat makes life harder for invaders + speeds the immune response (lab screen)
const S22: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="happy">
      <rect x={0} y={0} width={1100} height={600} fill="#FF4D3D" opacity={lerp(f, 0, 60, 0, 0.18)} />
      <ScrTitle t="TURN UP THE HEAT" />
      {[0, 1, 2].map((i) => <Germ key={i} x={220 + i * 150} y={360 + (i % 2) * 40} s={0.32} f={f + i * 9} shrug={lerp(f, 30, 60, 0, 1)} />)}
      <Heat x={370} y={300} f={f} n={5} />
      <Tag t="GERMS: SLOWER" x={370} y={540} at={30} c="#FF8A7A" size={36} />
      {[0, 1].map((i) => <Cell key={i} x={lerp(f, 60 + i * 10, 110, 1200, 760 + i * 170)} y={360} s={0.35} f={f} mood="alert" look={-1} />)}
      <Tag t="DEFENCE: FASTER" x={840} y={540} at={90} c="#2FE08A" size={36} />
    </Screen>
  );
};
// 23. CELL: "Why did the germ leave the party? It couldn't stand the heat."
const S23: React.FC = () => {
  const f = useCurrentFrame();
  const leave = lerp(f, 60, 110, 0, 1, Easing.in(Easing.cubic));
  return (
    <Stage k="dusk" lx={W / 2} ly={420}>
      <Dapple seed={4} color="#FF4FD8" o={0.18} />
      {/* party: disco ball + bunting */}
      <line x1={W / 2} y1={0} x2={W / 2} y2={140} stroke="#CFD8FF" strokeWidth={4} />
      <circle cx={W / 2} cy={190} r={60} fill="#CFD8FF" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={W / 2 - 50 + (i % 4) * 26} y={150 + Math.floor(i / 4) * 30} width={20} height={20} fill="#FFFFFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 4 + i))} />)}
      <path d={`M0 90 ${Array.from({ length: 13 }, (_, i) => `Q ${i * 160 + 80} 150 ${(i + 1) * 160} 90`).join(" ")}`} stroke="#FFD23F" strokeWidth={4} fill="none" />
      <Thermo x={1640} y={900} t={0.85} s={0.7} />
      <Bot x={720} y={1000} s={0.75} look={1} />
      <g transform={`translate(${1100 + leave * 900},${700}) rotate(${leave * 20})`}>
        <Germ x={0} y={0} s={0.45} f={f} shrug={1} />
      </g>
      <Heat x={1100 + leave * 900} y={560} f={f} n={3} />
      <Big t="COULDN'T STAND THE HEAT" y={380} size={84} c="#FFE066" at={70} />
    </Stage>
  );
};
// 24. Every extra degree costs ~10% more energy
const S24: React.FC = () => {
  const f = useCurrentFrame();
  const drain = lerp(f, 40, 200, 1, 0.35);
  return (
    <Stage k="alarm" lx={W / 2} ly={480} rays={false}>
      <Thermo x={420} y={860} t={0.75} s={1.0} />
      <g transform="translate(1180,560)">
        <rect x={-300} y={-160} width={560} height={320} rx={50} fill="#1B1240" stroke="#F4F6FF" strokeWidth={16} />
        <rect x={260} y={-60} width={50} height={120} rx={14} fill="#F4F6FF" />
        <rect x={-276} y={-136} width={512 * drain} height={272} rx={34} fill={drain > 0.5 ? "#2FE08A" : "#FFB347"} />
        <rect x={-266} y={-126} width={Math.max(0, 512 * drain - 20)} height={40} rx={20} fill="#FFFFFF" opacity={0.25} />
      </g>
      <Big t="+1°C ≈ +10% ENERGY" y={200} size={100} c="#FFE066" at={10} />
      <Big t="(MAYBE MORE)" y={330} size={56} c="#F4EEE2" at={120} />
    </Stage>
  );
};
// 25. "Where does that energy come from? Everything else."
const S25: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wide expr="thinking" pose="chin">
      {["WALKING", "TALKING", "EATING", "SOCIALISING"].map((t, i) => (
        <g key={t} opacity={lerp(f, 60 + i * 12, 80 + i * 12, 1, 0.25)}>
          <Tag t={t} x={420 + (i % 2) * 330} y={260 + i * 120} at={10 + i * 8} c="#7FE8FF" size={40} />
        </g>
      ))}
      <path d={`M1060 640 Q 960 ${560} 900 600`} stroke="#FFD23F" strokeWidth={8} fill="none" strokeDasharray="20 14" opacity={lerp(f, 70, 90, 0, 1)} />
    </Wide>
  );
};
// 26. walking burns energy → exhausted; losing heat → curl into a ball
const S26: React.FC = () => {
  const f = useCurrentFrame();
  const second = f > 120;
  return (
    <AbsoluteFill>
      {!second ? (
        <LivingRoom><Human2 L={AV("Mateo")} x={lerp(f, 0, 120, 600, 900)} y={1000} s={0.66} f={f / 2} pose="walk" expr="unamused" /></LivingRoom>
      ) : (
        <Bedroom night noBed><SickInBed id="b26" x={720} y={870} s={0.6} f={f} shiver /></Bedroom>
      )}
      <Over>
        {!second ? <Big t="EXHAUSTED" y={200} size={120} c="#FFD23F" at={20} /> : <Big t="CURL UP. KEEP HEAT." y={200} size={110} c="#7FE8FF" at={126} />}
      </Over>
    </AbsoluteFill>
  );
};
// 27. extra sleep tuned to power the fever
const S27: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bedroom night noBed><SickInBed id="b27" x={720} y={870} s={0.6} f={f} blanket="#5A7AD8" /></Bedroom>
      <Over>
        {[0, 1, 2].map((i) => {
          const t = ((f + i * 25) % 75) / 75;
          return <text key={i} x={W / 2 - 220 + t * 160} y={620 - t * 220} fontFamily="Arial Black" fontSize={60 + i * 20} fill="#CFD8FF" opacity={1 - t}>Z</text>;
        })}
        <path d={`M900 640 L ${W / 2 + 400} 380`} stroke="#FFD23F" strokeWidth={8} strokeDasharray="18 12" opacity={lerp(f, 60, 80, 0, 1)} />
        <g transform={`translate(${W / 2 + 480},330)`} opacity={lerp(f, 70, 90, 0, 1)}>
          <circle r={90} fill="#FF7A1F" opacity={0.35 + 0.15 * Math.sin(f / 4)} />
          <path d={`M-40 40 Q -60 -40 0 ${-110 - 10 * Math.sin(f / 3)} Q 60 -40 40 40 Z`} fill="#FF7A1F" />
          <path d="M-20 40 Q -26 -10 0 -60 Q 26 -10 20 40 Z" fill="#FFE066" />
        </g>
        <Big t="SLEEP POWERS THE FEVER" y={170} size={84} c="#FFE2A8" at={90} />
      </Over>
    </AbsoluteFill>
  );
};
// 28. "And this strategy is old. Really, really old."
const S28: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(f, 0, 110, 0, -900, Easing.inOut(Easing.cubic));
  const ages = ["TODAY", "10,000 YRS", "1 MILLION", "100 MILLION", "300 MILLION+"];
  return (
    <Stage k="deep" lx={W / 2} ly={460}>
      <g transform={`translate(${x},0)`}>
        <line x1={0} y1={640} x2={3200} y2={640} stroke="#CFD8FF" strokeWidth={8} />
        {ages.map((a, i) => (
          <g key={a} transform={`translate(${300 + i * 560},640)`}>
            <circle r={18} fill="#FFD23F" />
            <text y={90} textAnchor="middle" fontFamily="Arial Black" fontSize={52} fill="#F4EEE2">{a}</text>
          </g>
        ))}
      </g>
      <Thing name="hourglass" x={W / 2} y={460} s={1.6} f={f} shadow={false} />
      <Big t="REALLY, REALLY OLD" y={940} size={90} c="#FFD23F" at={60} />
    </Stage>
  );
};
// 29. desert iguanas infected; cold-blooded, can't make fever inside
const S29: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Desert>
        <Lizard x={900} y={960} s={1.4} f={0} />
        {[0, 1, 2].map((i) => <Germ key={i} x={760 + i * 120} y={820 - (i % 2) * 30} s={0.16} f={f + i * 5} />)}
      </Desert>
      <Over>
        <Tag t="DESERT IGUANA" x={900} y={700} at={10} size={42} />
        <g opacity={lerp(f, 120, 140, 0, 1)}>
          <Thermo x={1500} y={900} t={0.35} s={0.75} />
          <Big t="COLD-BLOODED" x={1500} y={330} size={70} c="#7FE8FF" at={130} />
        </g>
      </Over>
    </AbsoluteFill>
  );
};
// 30. they crawl toward the heat; +2°C
const S30: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(f, 10, 150, 520, 1180, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Desert>
        <ellipse cx={1400} cy={950} rx={260} ry={60} fill="#C87A3A" />
        <ellipse cx={1400} cy={930} rx={230} ry={40} fill="#E8A05A" />
        <ellipse cx={1400} cy={880} rx={420} ry={260} fill="#FFD27A" opacity={0.18 + 0.05 * Math.sin(f / 5)} />
        <Heat x={1400} y={860} f={f} n={5} />
        <Lizard x={x} y={x > 1100 ? 925 : 960} s={1.2} f={f < 150 ? f : 0} />
      </Desert>
      <Over><Big t="+2°C" x={1400} y={330} size={200} c="#FF4D3D" at={150} /></Over>
    </AbsoluteFill>
  );
};
// 31. held cool → more died; held warm → survived better
const S31: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="serious">
      <ScrTitle t="INFECTED IGUANAS" />
      <Bars at={20} items={[{ l: "KEPT COOL", v: 0.35, c: "#7FB8FF" }, { l: "KEPT WARM", v: 0.9, c: "#FF8A3D" }]} />
      <text x={550} y={140} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#9FB0D8" opacity={lerp(f, 40, 60, 0, 1)}>SURVIVAL (ILLUSTRATIVE)</text>
      <Lizard x={367} y={170} s={0.45} f={0} c="#7AA8C8" />
      <Lizard x={733} y={170} s={0.45} f={f} />
    </Screen>
  );
};
// 32. fish swim to warmer water (2023)
const S32: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(f, 20, 200, 380, 1420, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs><linearGradient id="water" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0B3A6A" /><stop offset="0.55" stopColor="#1A6A8A" /><stop offset="1" stopColor="#C8703A" /></linearGradient></defs>
        <rect width={W} height={H} fill="url(#water)" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${i * 300 - 100} 0 L ${i * 300 + 40} 0 L ${i * 300 + 240} ${H} L ${i * 300 + 60} ${H} Z`} fill="#FFFFFF" opacity={0.04} />)}
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(i * 137) % W} cy={H - ((f * 2 + i * 90) % H)} r={4 + (i % 3) * 3} fill="#CFF4FF" opacity={0.4} />)}
        <rect x={0} y={960} width={W} height={120} fill="#3A2A1A" opacity={0.6} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${80 + i * 160} 980 q ${10 + Math.sin(f / 10 + i) * 14} -90 0 -180`} stroke="#2E8A5A" strokeWidth={14} fill="none" strokeLinecap="round" />)}
        <Thing name="fish" x={x} y={560 + Math.sin(f / 8) * 20} s={1.3} f={f} shadow={false} />
        {[0, 1, 2].map((i) => <Germ key={i} x={x - 120 - i * 60} y={500 + i * 40} s={0.1} f={f} />)}
        <text x={260} y={140} fontFamily="Arial Black" fontSize={60} fill="#7FE8FF">COLD</text>
        <text x={1660} y={140} textAnchor="end" fontFamily="Arial Black" fontSize={60} fill="#FFB347">WARM</text>
        <Big t="2023" y={330} size={180} c="#FFFFFF" at={8} />
        <Big t="FISH FEVER" y={960} size={90} c="#FFD23F" at={200} />
      </svg>
    </AbsoluteFill>
  );
};
// hive comb backdrop
const Comb: React.FC<{ f: number; heat: number; fungus?: number }> = ({ f, heat, fungus = 0 }) => {
  const r = 70, cells: [number, number][] = [];
  for (let row = -1; row < 10; row++) for (let col = -1; col < 18; col++) cells.push([col * r * 1.73 + (row % 2 ? r * 0.865 : 0), row * r * 1.5]);
  return (
    <g>
      <rect width={W} height={H} fill="#5A3A0A" />
      {cells.map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d={Array.from({ length: 6 }, (_, k) => `${k ? "L" : "M"}${Math.cos(Math.PI / 6 + (k * Math.PI) / 3) * r * 0.95} ${Math.sin(Math.PI / 6 + (k * Math.PI) / 3) * r * 0.95}`).join(" ") + " Z"} fill={i % 7 === 0 ? "#F4E8C8" : "#E8A82A"} stroke="#8A5A0A" strokeWidth={8} />
          {i % 7 === 0 && <ellipse cx={0} cy={4} rx={26} ry={34} fill="#FFF8E8" />}
          {fungus > 0 && i % 7 === 0 && <circle cx={0} cy={4} r={36 * fungus} fill="#E8F0E0" opacity={0.85} />}
        </g>
      ))}
      <rect width={W} height={H} fill="#FF4D1F" opacity={heat * 0.25 + heat * 0.05 * Math.sin(f / 3)} />
    </g>
  );
};
// 33. honeybees heat the nursery comb against a fungus
const S33: React.FC = () => {
  const f = useCurrentFrame();
  const heat = lerp(f, 60, 200, 0, 1);
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <Comb f={f} heat={heat} />
        {Array.from({ length: 7 }, (_, i) => {
          const buzz = heat > 0.1 ? Math.sin(f * 3 + i) * 5 : 0;
          return <Bee key={i} x={260 + i * 230 + buzz} y={420 + (i % 3) * 170} s={1.1} f={f + i * 3} flip={i % 2 === 1} />;
        })}
        <Big t="HIVE FEVER" y={200} size={130} c="#FFF2B0" at={90} />
      </svg>
    </AbsoluteFill>
  );
};
// 34. later study: not enough on its own
const S34: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <Comb f={f} heat={0.6} fungus={lerp(f, 30, 180, 0.2, 1)} />
        <rect width={W} height={H} fill="#0B1033" opacity={0.35} />
        {Array.from({ length: 4 }, (_, i) => <Bee key={i} x={420 + i * 360} y={560 + (i % 2) * 120} s={1} f={f / 3} flip={i % 2 === 1} />)}
        <Big t="NOT ENOUGH ON ITS OWN" y={220} size={96} c="#FF8A7A" at={60} rot={-3} />
        <Big t="EVOLUTION ISN'T PERFECT" y={940} size={64} c="#F4EEE2" at={200} />
      </svg>
    </AbsoluteFill>
  );
};

// =========================== CHAPTER 3: THE HUNGER STRIKE ===========================
// 35. you stop wanting to eat
const S35: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(f, 40, 70, 0, 1);
  return (
    <AbsoluteFill>
      <Kitchen>
        <Human2 L={AV("Priya")} x={760} y={1000} s={0.68} f={f} pose="crossed" expr="unamused" look={1} />
        <Thing name="burger" x={1060 + push * 200} y={760} s={0.9} f={f} />
      </Kitchen>
      <Over><Big t="NO APPETITE" y={190} size={130} c="#FFD23F" at={20} rot={-3} /></Over>
    </AbsoluteFill>
  );
};
// 36. "Surely you need fuel to fight?"
const S36: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wide expr="skeptical" pose="shrug">
      <Thing name="battery" x={560} y={700} s={1.4} f={f} />
      <Big t="?" x={560} y={420} size={200} c="#FFD23F" at={20} />
    </Wide>
  );
};
// 37/38. Yale 2016 mice: bacterial vs viral
const MiceScreen: React.FC<{ viral?: boolean }> = ({ viral }) => {
  const f = useCurrentFrame();
  const fedOK = viral ? 0.85 : 0.25, unfedOK = viral ? 0.3 : 0.8;
  return (
    <Screen expr={viral ? "surprised" : "neutral"}>
      <ScrTitle t={viral ? "VIRAL (FLU): IT FLIPS" : "YALE 2016: BACTERIAL"} c={viral ? "#FFD23F" : "#F4EEE2"} />
      <Bars at={30} items={[{ l: "NOT FED", v: unfedOK, c: "#2FE08A" }, { l: "FED ANYWAY", v: fedOK, c: viral ? "#2FE08A" : "#FF4D6D" }]} />
      <Mouse x={367} y={180} s={0.7} f={f} sick={unfedOK < 0.5} />
      <Mouse x={733} y={180} s={0.7} f={f} sick={fedOK < 0.5} />
      <Thing name="apple" x={830} y={180} s={0.35} f={f} shadow={false} />
      <text x={550} y={130} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#9FB0D8">SURVIVAL</text>
    </Screen>
  );
};
const S37: React.FC = () => <MiceScreen />;
const S38: React.FC = () => <MiceScreen viral />;
// 39. not starving the germ: tissue tolerance. Different invaders, different fuel
const S39: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Screen expr="thinking" pose="present">
      <ScrTitle t="DIFFERENT INVADERS" y={90} />
      <ScrTitle t="DIFFERENT FUEL RULES" y={160} c="#FFD23F" />
      <g transform="translate(300,380)"><Germ x={0} y={0} s={0.4} f={f} /><text y={170} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">BACTERIA</text></g>
      <g transform="translate(800,380)">
        <circle r={70} fill="#B48CFF" />
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + f / 40; return <circle key={i} cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} r={14} fill="#FF7AC8" />; })}
        <text y={170} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4EEE2">VIRUS</text>
      </g>
      <text x={550} y={400} textAnchor="middle" fontFamily="Arial Black" fontSize={80} fill="#7FE8FF">≠</text>
    </Screen>
  );
};
// 40. CELL: "So 'feed a cold, starve a fever' was right all along?"
const S40: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="morning" lx={W / 2} ly={420}>
      <CellField seed={52} base="#7A5AA8" far="#1B1440" count={40} />
      <rect width={W} height={H} fill="#1B1440" opacity={0.45} />
      <Bot x={1400} y={1000} s={0.8} look={-1} mood="happy" />
      <g transform={`translate(640,500) rotate(-3) scale(${sp(f, 6, 10)})`}>
        <rect x={-420} y={-160} width={840} height={320} rx={30} fill="#F4EEE2" />
        <rect x={-420} y={-160} width={840} height={60} rx={30} fill="#FFD23F" />
        <text textAnchor="middle" y={10} fontFamily="Arial Black" fontSize={70} fill={INK}>FEED A COLD,</text>
        <text textAnchor="middle" y={100} fontFamily="Arial Black" fontSize={70} fill={INK}>STARVE A FEVER?</text>
      </g>
    </Stage>
  );
};
// 41. "Easy. Mice, not people. Not a diet plan."
const S41: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return (
    <AbsoluteFill>
      <LabBench actor={<DocV2 x={760} y={960} s={1.0} f={f} talk={talk} pose="hips" expr="serious" />} />
      <Over>
        <Mouse x={1260} y={560} s={1.2} f={f} />
        <text x={1420} y={560} fontFamily="Arial Black" fontSize={140} fill="#FF4D6D" opacity={lerp(f, 20, 30, 0, 1)}>≠</text>
        <g opacity={lerp(f, 30, 40, 0, 1)}><Human2 L={AV("Claire")} x={1690} y={720} s={0.28} f={f} /></g>
        <Big t="NOT A DIET PLAN" x={1440} y={260} size={80} c="#FFD23F" at={110} rot={-3} />
      </Over>
    </AbsoluteFill>
  );
};

// =========================== CHAPTER 4: THE WALL ===========================
// 42. "And then there's the loneliness."
const S42: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Street><Human2 L={AV("Kenji")} x={lerp(f, 0, 70, 900, 980)} y={1000} s={0.6} f={f / 2} pose="walk" expr="unamused" /></Street>
      <AbsoluteFill style={{ background: "#0B1033", opacity: lerp(f, 0, 50, 0, 0.45) }} />
    </AbsoluteFill>
  );
};
// 43. everyone feels far away; ignoring messages
const S43: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bedroom night noBed><SickInBed id="b43" x={720} y={870} s={0.6} f={f} blanket="#8A5AA8" /></Bedroom>
      <Over>
        {["hey you ok?", "party tonight!!", "call me?", "hello??"].map((m, i) => {
          const s = sp(f, 10 + i * 25, 10);
          return (
            <g key={m} transform={`translate(${1340 + (i % 2) * 80},${200 + i * 140}) scale(${s})`} opacity={lerp(f, 150, 190, 1, 0.35)}>
              <rect x={-230} y={-46} width={460} height={92} rx={46} fill="#FFFFFF" />
              <circle cx={-180} cy={0} r={28} fill="#2ED3C6" />
              <text x={-136} y={14} fontFamily="Arial" fontWeight={700} fontSize={40} fill={INK}>{m}</text>
            </g>
          );
        })}
        <Tag t="SEEN" x={1420} y={820} at={170} c="#9FB0D8" size={40} />
      </Over>
    </AbsoluteFill>
  );
};
// 44. volunteers given a harmless bacterial fragment
const S44: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return (
    <LabWide>
      <DocV2 x={1450} y={1010} s={0.62} f={f} talk={talk} pose="point" expr="neutral" look={-1} />
      {["Arjun", "Sofia", "Ethan"].map((n, i) => <Human2 key={n} L={AV(n)} x={520 + i * 230} y={1010} s={0.55} f={f + i * 7} expr="happy" />)}
      <Tag t="HARMLESS BACTERIAL FRAGMENT" x={W / 2} y={170} at={60} size={50} />
      <Tag t="IMMUNE ALARM: ON" x={W / 2} y={280} at={170} c="#FF8A7A" size={42} />
    </LabWide>
  );
};
// 45. within hours: more disconnected, mood dropped
const S45: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerp(f, 20, 150, 0, 1);
  const pts = Array.from({ length: 30 }, (_, i) => [140 + i * 30, 220 + (i / 29) ** 1.6 * 240 * 1 + Math.sin(i * 1.7) * 10] as const);
  const shown = pts.slice(0, Math.max(2, Math.round(t * pts.length)));
  return (
    <Screen expr="serious">
      <ScrTitle t="WITHIN HOURS" />
      <line x1={120} y1={500} x2={1040} y2={500} stroke="#7FA8D8" strokeWidth={4} /><line x1={120} y1={140} x2={120} y2={500} stroke="#7FA8D8" strokeWidth={4} />
      <text x={140} y={180} fontFamily="Arial Black" fontSize={30} fill="#9FB0D8">MOOD</text>
      <path d={`M${shown.map(([x, y]) => `${x} ${y}`).join(" L ")}`} stroke="#FF4D6D" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={1020} y={545} textAnchor="end" fontFamily="Arial Black" fontSize={28} fill="#9FB0D8">HOURS →</text>
      <g opacity={lerp(f, 100, 120, 0, 1)}><text x={1000} y={300} textAnchor="end" fontFamily="Arial Black" fontSize={44} fill="#FFD23F">"DISCONNECTED"</text></g>
    </Screen>
  );
};
// 46. photos two hours after the trigger picked out as "sick"
const S46: React.FC = () => {
  const f = useCurrentFrame();
  const names = ["Marcus", "Mei", "Mateo", "Amara"];
  return (
    <Stage k="lab" lx={W / 2} ly={420} rays={false}>
      <defs>{names.map((_, i) => <clipPath key={i} id={`ph${i}`}><rect x={180 + i * 400} y={240} width={360} height={440} rx={16} /></clipPath>)}</defs>
      {names.map((n, i) => {
        const s = sp(f, 6 + i * 8, 11);
        const sick = i === 1 || i === 3;
        return (
          <g key={n} transform={`translate(${360 + i * 400},460) scale(${s}) translate(${-(360 + i * 400)},-460)`}>
            <rect x={164 + i * 400} y={224} width={392} height={540} rx={20} fill="#F4F6FF" />
            <rect x={180 + i * 400} y={240} width={360} height={440} rx={16} fill={sick ? "#8AA0A8" : "#A8C8E8"} />
            <g clipPath={`url(#ph${i})`}><Human2 L={AV(n)} x={360 + i * 400} y={1180} s={0.95} f={0} expr={sick ? "unamused" : "happy"} /></g>
            {sick && <rect x={180 + i * 400} y={240} width={360} height={440} rx={16} fill="#7A8A6A" opacity={0.18} />}
            {sick && f > 110 + i * 10 && <g transform={`translate(${360 + i * 400},720) rotate(-6)`}><rect x={-110} y={-40} width={220} height={70} rx={14} fill="#FF4D6D" /><text textAnchor="middle" y={14} fontFamily="Arial Black" fontSize={44} fill="#FFFFFF">SICK</text></g>}
          </g>
        );
      })}
      <Big t="+2 HOURS" y={150} size={90} c="#FFFFFF" at={30} />
    </Stage>
  );
};
// 47. pale lips, droopy eyelids, tired mouth
const S47: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 0, 200, 1, 1.08);
  return (
    <Stage k="lab" lx={W / 2} ly={420} rays={false}>
      <g transform={`translate(${W / 2},540) scale(${z}) translate(${-W / 2},-540)`}>
        <Human2 L={AV("Mei")} x={W / 2} y={2700} s={3.2} f={0} expr="unamused" />
      </g>
      {[["DROOPY EYELIDS", 520, 470, 20], ["PALE LIPS", 600, 860, 60], ["TIRED MOUTH", 1360, 900, 100]].map(([t, x, y, at]) => (
        <Tag key={t as string} t={t as string} x={x as number} y={y as number} at={at as number} size={44} c="#FFFFFF" />
      ))}
      <Big t="MAYBE KEEP YOUR DISTANCE" y={150} size={70} c="#FFD23F" at={170} />
    </Stage>
  );
};
// 48. vampire bats: sick bat spends less time near roost-mates
const S48: React.FC = () => {
  const f = useCurrentFrame();
  const away = lerp(f, 80, 220, 0, 1);
  const roost = [[700, 380], [860, 360], [1020, 390], [1180, 370], [780, 520], [1100, 520]];
  const sick = [940 + away * 640, 520 + away * 140];
  return (
    <Stage k="deep" lx={W / 2} ly={200} rays={false}>
      <path d="M0 0 L 1920 0 L 1920 260 Q 1500 340 960 300 Q 420 340 0 260 Z" fill="#1B1240" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${60 + i * 140} 260 l 30 ${60 + (i % 3) * 40} l 30 -${60 + (i % 3) * 40}`} fill="#1B1240" />)}
      {roost.map(([x, y], i) => roost.slice(i + 1).map(([x2, y2], j) => <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#7FE8FF" strokeWidth={3} opacity={0.25} />))}
      {roost.map(([x, y], i) => <line key={`s${i}`} x1={x} y1={y} x2={sick[0]} y2={sick[1]} stroke="#7FE8FF" strokeWidth={3} opacity={0.35 * (1 - away)} />)}
      {roost.map(([x, y], i) => <Bat key={i} x={x} y={y} s={1.2} f={f + i * 4} />)}
      <Bat x={sick[0]} y={sick[1]} s={1.2} f={f} sick />
      <Tag t="SICK BAT" x={sick[0]} y={sick[1] + 110} at={60} c="#FF8A7A" size={36} />
      <Big t="LESS TIME NEAR ROOST-MATES" y={960} size={70} c="#F4EEE2" at={140} />
    </Stage>
  );
};
// 49. CELL: "Bats social distancing. Fang-tastic."
const S49: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="deep" lx={W / 2} ly={420}>
      <Bat x={700} y={420} s={2.2} f={f} />
      <Bat x={1220} y={420} s={2.2} f={f + 5} flip />
      <line x1={820} y1={600} x2={1100} y2={600} stroke="#FFD23F" strokeWidth={6} strokeDasharray="16 12" />
      <text x={960} y={660} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#FFD23F">2 M</text>
      <Bot x={1640} y={1040} s={0.6} look={-1} />
      <Big t="FANG-TASTIC" y={200} size={120} c="#FF8A1F" at={60} rot={-4} />
    </Stage>
  );
};
// 50. ants: the colony reorganises after fungus exposure
const S50: React.FC = () => {
  const f = useCurrentFrame();
  const split = lerp(f, 120, 260, 0, 1, Easing.inOut(Easing.cubic));
  const r = 14;
  const ants = Array.from({ length: r * 2 }, (_, i) => {
    const exposed = i < 9;
    const a = (i / (r * 2)) * Math.PI * 2;
    const hx = W / 2 + Math.cos(a) * 330, hy = 560 + Math.sin(a) * 250;
    const gx = exposed ? 460 + Math.cos(a * 3) * 150 : 1340 + Math.cos(a * 2) * 260, gy = 560 + Math.sin(a * 3) * 160;
    return { x: hx + (gx - hx) * split, y: hy + (gy - hy) * split, exposed, a };
  });
  return (
    <Stage k="jungle" lx={W / 2} ly={420} rays={false}>
      <Foliage seed={22} base="#1E4A2A" y0={-100} y1={1180} count={20} scale={[0.7, 1.2]} sway={2} />
      <rect width={W} height={H} fill="#2A1A0A" opacity={0.6} />
      {ants.map((p, i) => ants.slice(i + 1).filter((q) => (p.exposed === q.exposed || split < 0.5) && Math.hypot(p.x - q.x, p.y - q.y) < 260).map((q, j) => (
        <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#FFD23F" strokeWidth={2} opacity={p.exposed === q.exposed ? 0.3 : 0.3 * (1 - split * 2)} />
      )))}
      {ants.map((p, i) => <g key={i}><Ant x={p.x} y={p.y} s={1.1} f={f + i} c={p.exposed ? "#8A3A2A" : "#3A1A12"} flip={Math.cos(p.a) < 0} />{p.exposed && f > 40 && <circle cx={p.x} cy={p.y - 16} r={34} fill="none" stroke="#E8F0E0" strokeWidth={4} opacity={0.6} />}</g>)}
      <Tag t="EXPOSED" x={460} y={260} at={150} c="#FF8A7A" size={40} />
      <Tag t="PROTECTED" x={1340} y={260} at={160} c="#2FE08A" size={40} />
      <Big t="THE COLONY REORGANISES" y={980} size={72} c="#F4EEE2" at={40} />
    </Stage>
  );
};
// 51. not antisocial: building a wall around everyone you care about
const S51: React.FC = () => {
  const f = useCurrentFrame();
  const wall = lerp(f, 40, 110, 0, 1);
  return (
    <AbsoluteFill>
      <LivingRoom>
        <Human2 L={AV("Ethan")} x={420} y={1000} s={0.62} f={f} pose="crossed" expr="serious" look={1} />
        {[["Amara", 1180], ["Kenji", 1420], ["Sofia", 1640]].map(([n, x], i) => <Human2 key={n} L={AV(n as string)} x={x as number} y={1000} s={0.6} f={f + i * 6} expr="happy" look={-1} />)}
        <g opacity={wall}>
          <rect x={760} y={1000 - 760 * wall} width={60} height={760 * wall} rx={20} fill="#7FE8FF" opacity={0.45} />
          <rect x={770} y={1000 - 760 * wall} width={14} height={760 * wall} rx={7} fill="#FFFFFF" opacity={0.6} />
        </g>
      </LivingRoom>
      <Over><Big t="A WALL AROUND THEM" y={170} size={100} c="#FFD23F" at={110} /></Over>
    </AbsoluteFill>
  );
};

// =========================== CHAPTER 5: WHEN THE SWITCH GETS STUCK ===========================
// 52. "But there's a darker side to all this."
const S52: React.FC = () => <Wide expr="serious" pose="idle" lights={0.45} />;
// switch panel on the lab screen (shared by 53/54)
const SW = ["ENERGY", "SLEEP", "HUNGER", "SOCIAL", "MOOD"];
const Switches: React.FC<{ on: (i: number) => number; title: string; alarm?: boolean }> = ({ on, title, alarm }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {alarm && <rect width={1100} height={600} fill="#FF2D3D" opacity={0.12 + 0.12 * Math.sin(f / 3)} />}
      <ScrTitle t={title} />
      {SW.map((s, i) => {
        const v = on(i), x = 150 + i * 200;
        return (
          <g key={s}>
            <rect x={x - 60} y={150} width={120} height={300} rx={40} fill="#0B1033" stroke="#2A4A7A" strokeWidth={4} />
            <rect x={x - 50} y={162 + (1 - v) * 150} width={100} height={130} rx={30} fill={v > 0.5 ? "#2FE08A" : "#FF4D6D"} />
            <text x={x} y={510} textAnchor="middle" fontFamily="Arial Black" fontSize={32} fill="#F4EEE2">{s}</text>
          </g>
        );
      })}
    </g>
  );
};
// 53. temporary: germ gone, signal off, back to normal (switches flip back on)
const S53: React.FC = () => {
  const f = useCurrentFrame();
  return <Screen expr="neutral"><Switches title="GERM GONE → BACK ON" on={(i) => lerp(f, 40 + i * 14, 52 + i * 14, 0, 1)} /></Screen>;
};
// 54. the signal doesn't switch off: alarm keeps ringing
const S54: React.FC = () => {
  const f = useCurrentFrame();
  return <Screen expr="serious"><Switches title="THE ALARM KEEPS RINGING" on={() => 0} alarm={f > 90} /></Screen>;
};
// 55. interferon-alpha: some patients developed depression symptoms
const S55: React.FC = () => {
  const f = useCurrentFrame();
  const fill = lerp(f, 160, 260, 0, 1);
  return (
    <Stage k="deep" lx={W / 2} ly={420} rays={false}>
      <g transform={`translate(560,560) rotate(-12) scale(${sp(f, 6, 12)})`}>
        <rect x={-60} y={-260} width={120} height={60} rx={10} fill="#9FB0D8" />
        <rect x={-90} y={-210} width={180} height={420} rx={30} fill="#E8F4FF" opacity={0.9} />
        <rect x={-76} y={-60} width={152} height={250} rx={22} fill="#7FB8FF" />
        <rect x={-70} y={-190} width={30} height={360} rx={14} fill="#FFFFFF" opacity={0.5} />
      </g>
      <Big t="INTERFERON-ALPHA" x={1240} y={300} size={90} c="#7FE8FF" at={20} />
      <text x={1240} y={420} textAnchor="middle" fontFamily="Arial Black" fontSize={46} fill="#CFD8FF" opacity={lerp(f, 60, 80, 0, 1)}>BOOSTS THE IMMUNE SYSTEM</text>
      {/* "nearly half": 10 figures, ~half fill */}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} transform={`translate(${900 + i * 72},700)`} opacity={lerp(f, 140, 160, 0, 1)}>
          <circle cy={-60} r={22} fill={i < Math.round(fill * 4.5) ? "#B48CFF" : "#3A4A7A"} />
          <rect x={-24} y={-34} width={48} height={70} rx={20} fill={i < Math.round(fill * 4.5) ? "#B48CFF" : "#3A4A7A"} />
        </g>
      ))}
      <text x={1240} y={840} textAnchor="middle" fontFamily="Arial Black" fontSize={46} fill="#F4EEE2" opacity={lerp(f, 250, 270, 0, 1)}>NEARLY HALF, IN SOME STUDIES</text>
    </Stage>
  );
};
// 56. not all depression comes from inflammation (Doc at the bench, serious)
const S56: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return (
    <AbsoluteFill>
      <LabBench actor={<DocV2 x={760} y={960} s={1.0} f={f} talk={talk} pose="present" expr="serious" />} />
      <Over>
        <Tag t="DEPRESSION HAS MANY CAUSES" x={1360} y={300} at={30} c="#CFD8FF" size={44} />
        <Tag t="SOMETIMES: STUCK SICKNESS SIGNAL" x={1360} y={420} at={190} c="#B48CFF" size={40} />
      </Over>
    </AbsoluteFill>
  );
};

// =========================== OUTRO ===========================
// 57. lying in bed, aching, shivering, not hungry, ignoring messages
const S57: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bedroom night noBed><SickInBed id="b57" x={720} y={870} s={0.6} f={f} shiver={f > 60 && f < 120} /></Bedroom>
      <Over>
        {["ACHING", "SHIVERING", "NOT HUNGRY", "IGNORING MESSAGES"].map((t, i) => <Tag key={t} t={t} x={i % 2 ? 1460 : 460} y={220 + Math.floor(i / 2) * 140} at={20 + i * 30} c="#FFFFFF" size={40} />)}
      </Over>
    </AbsoluteFill>
  );
};
// 58. a strategy shared across nature: lizards, fish, bats, ants, and you
const S58: React.FC = () => {
  const f = useCurrentFrame();
  const at = (i: number) => sp(f, 20 + i * 28, 10);
  return (
    <Stage k="verdict" lx={W / 2} ly={420}>
      <g transform={`translate(260,640) scale(${at(0)})`}><Lizard x={0} y={0} s={1} f={f} /></g>
      <g transform={`translate(600,600) scale(${at(1)})`}><Thing name="fish" x={0} y={0} s={1} f={f} shadow={false} /></g>
      <g transform={`translate(920,560) scale(${at(2)})`}><Bat x={0} y={0} s={1.6} f={f} /></g>
      <g transform={`translate(1220,620) scale(${at(3)})`}><Ant x={0} y={0} s={2.2} f={f} /></g>
      <g transform={`translate(1600,860) scale(${at(4)})`}><Human2 L={AV("Marcus")} x={0} y={0} s={0.5} f={f} expr="happy" /></g>
      <Big t="YOU'RE NOT FALLING APART" y={200} size={90} c="#FFFFFF" at={8} />
      <Big t="YOU'RE RUNNING A STRATEGY" y={980} size={80} c="#2FE08A" at={200} />
    </Stage>
  );
};
// 59. CELL: "Or just call in sick. Doctor's orders."
const S59: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="morning" lx={W / 2} ly={420}>
      <CellField seed={61} base="#7A5AA8" far="#1B1440" count={40} />
      <rect width={W} height={H} fill="#1B1440" opacity={0.45} />
      <Bot x={860} y={1000} s={0.8} look={1} />
      <Thing name="smartphone" x={1180} y={640} s={1.4} f={f} shadow={false} />
      <Big t="DOCTOR'S ORDERS" y={200} size={110} c="#FFD23F" at={40} rot={-3} />
    </Stage>
  );
};
// 60. DOC: "I'm not that kind of doctor." (Really, man?)
const S60: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  return (
    <LabWide>
      <DocV2 x={W / 2} y={1150} s={0.95} f={f} talk={talk} pose="crossed" expr="unamused" />
    </LabWide>
  );
};
// 61. fever medicine isn't the enemy; very high/long fevers, any fever in a baby → call a doctor
const S61: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="alarm" lx={W / 2} ly={460} rays={false}>
      <Thermo x={360} y={900} t={0.95} s={1.1} />
      <Thing name="hospital" x={1500} y={880} s={1.6} f={f} />
      {[["VERY HIGH FEVER", 120], ["LONG-LASTING FEVER", 150], ["ANY FEVER IN A BABY", 180]].map(([t, at], i) => (
        <Tag key={t as string} t={t as string} x={860} y={300 + i * 130} at={at as number} c="#FFFFFF" size={44} />
      ))}
      <Big t="CALL A DOCTOR" x={860} y={820} size={110} c="#FFE066" at={230} />
    </Stage>
  );
};
// 62. rest isn't laziness, it's strategy. Fight through it, or let your body do its thing?
const S62: React.FC = () => {
  const f = useCurrentFrame();
  const talk = useTalking("DOC");
  const q = f > 120;
  return (
    <LabWide>
      <DocV2 x={1290} y={1010} s={0.62} f={f} talk={talk} pose={q ? "present" : "point"} expr="happy" look={-1} />
      {!q ? (
        <g>
          <text x={560} y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={100} fill="#CFD8FF" opacity={0.6}>LAZINESS</text>
          <line x1={280} y1={270} x2={280 + 560 * lerp(f, 30, 50, 0, 1)} y2={270} stroke="#FF4D6D" strokeWidth={16} strokeLinecap="round" />
          <Tag t="STRATEGY" x={560} y={460} at={60} c="#2FE08A" size={80} />
        </g>
      ) : (
        <g>
          <Tag t="FIGHT THROUGH IT?" x={520} y={300} at={126} c="#FF8A7A" size={56} />
          <Tag t="LET YOUR BODY WORK?" x={520} y={460} at={140} c="#2FE08A" size={56} />
          {[[300, 200], [820, 560]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} at={150 + i * 6} size={30} />)}
        </g>
      )}
    </LabWide>
  );
};

export const CH2TO5: SceneDef[] = [
  { line: 21, C: S21 },
  { line: 22, C: S22 },
  { line: 23, C: S23, doc: "bl", expr: "unamused" },
  { line: 24, C: S24 },
  { line: 25, C: S25 },
  { line: 26, C: S26 },
  { line: 27, C: S27 },
  { line: 28, C: S28, doc: "br" },
  { line: 29, C: S29 },
  { line: 30, C: S30 },
  { line: 31, C: S31 },
  { line: 32, C: S32 },
  { line: 33, C: S33 },
  { line: 34, C: S34, doc: "br", expr: "skeptical" },
  { line: 35, C: S35 },
  { line: 36, C: S36 },
  { line: 37, C: S37 },
  { line: 38, C: S38 },
  { line: 39, C: S39 },
  { line: 40, C: S40, doc: "bl", expr: "thinking" },
  { line: 41, C: S41 },
  { line: 42, C: S42 },
  { line: 43, C: S43 },
  { line: 44, C: S44 },
  { line: 45, C: S45 },
  { line: 46, C: S46 },
  { line: 47, C: S47 },
  { line: 48, C: S48 },
  { line: 49, C: S49, doc: "bl", expr: "unamused" },
  { line: 50, C: S50 },
  { line: 51, C: S51 },
  { line: 52, C: S52 },
  { line: 53, C: S53 },
  { line: 54, C: S54 },
  { line: 55, C: S55, doc: "bl", expr: "serious" },
  { line: 56, C: S56 },
  { line: 57, C: S57 },
  { line: 58, C: S58 },
  { line: 59, C: S59, doc: "bl", expr: "skeptical" },
  { line: 60, C: S60 },
  { line: 61, C: S61 },
  { line: 62, C: S62 },
];
