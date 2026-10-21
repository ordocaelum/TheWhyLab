// Landscape presets batch 2: Jungle, Canyon, Swamp, VolcanoIsland, Savanna (same engine as landscapes.tsx).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Thing } from "./objects";
import { Foliage, mix } from "./gen";
import { Clouds, Frame, Ground, GROUND_Y, Haze, Ridge, Sky } from "./landscapes";

const W = 1920, H = 1080;

export const Jungle: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#04140A">
      <Sky top="#1E5A4A" mid="#6AB88A" low="#E8F4C8" sun={{ x: 960, y: 300, r: 60, c: "#FFF2C4" }} />
      {[-1, 0, 1, 2].map((i) => <polygon key={i} points={`${860 + i * 90},0 ${900 + i * 90},0 ${700 + i * 260},${GROUND_Y} ${560 + i * 260},${GROUND_Y}`} fill="#FFF8C8" opacity={0.08 + 0.03 * Math.sin(f / 30 + i)} />)}
      <Ridge seed={61} base={700} amp={260} kind="hills" c={mix("#1E5A3A", "#6AB88A", 0.5)} />
      <Haze y={700} c="#C8E8C0" o={0.4} />
      <Foliage seed={62} base="#1E6A3A" y0={-120} y1={360} count={26} scale={[0.8, 1.4]} sway={3} light="#E8FF7A" />
      <Ridge seed={63} base={820} amp={120} kind="hills" c="#2A7A3A" />
      <Ground c="#3A8A3A" texture="grass" seed={64} />
      {[[200, 920, 1.3], [1700, 930, 1.4]].map(([x, y, s], i) => <Thing key={i} name="palm" x={x} y={y} s={s} f={f} />)}
      {[[520, 940], [1350, 950], [1560, 990]].map(([x, y], i) => <Thing key={i} name={i % 2 ? "bush-flowering" : "bush-round"} x={x} y={y} s={0.6} />)}
      {[[760, 990], [1200, 1000]].map(([x, y], i) => <Thing key={i} name="flower" x={x} y={y} s={0.4} f={f + i * 20} />)}
      <Thing name="butterfly" x={1150} y={760} s={0.4} f={f} shadow={false} />
      <Thing name="bird" x={1520} y={560} s={0.45} f={f} shadow={false} />
      {children}
      <g style={{ filter: "blur(4px)" }}><Foliage seed={65} base="#0E3A1E" y0={1000} y1={1180} count={12} scale={[1.2, 1.8]} sway={4} /></g>
    </Frame>
  );
};

export const Canyon: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Frame tint="#2A0A04">
    <Sky top="#4A8AD8" mid="#A8D0F0" low="#FFE8C8" sun={{ x: 1600, y: 200, r: 60, c: "#FFF2C4" }} />
    <Clouds seed={71} n={3} y0={60} y1={200} />
    {([[72, 520, 160, "#D88A6A", 0.55], [73, 640, 200, "#C8603A", 0.3], [74, 780, 160, "#A84A2A", 0]] as [number, number, number, string, number][]).map(([s, b, a, col, m]) => (
      <g key={s}>
        <Ridge seed={s} base={b} amp={a} kind="peaks" c={mix(col, "#A8D0F0", m)} />
        {[0, 1, 2].map((k) => <rect key={k} x={0} y={b - 20 + k * 30} width={W} height={8} fill="#000" opacity={0.08} />)}
      </g>
    ))}
    <Haze y={620} c="#FFD8B8" o={0.35} />
    <Ground c="#C8784A" texture="rock" seed={75} />
    {[[300, 940, 0.9], [1500, 960, 1.1]].map(([x, y, s], i) => <Thing key={i} name="rocks" x={x} y={y} s={s} />)}
    {[[880, 930, 0.6], [1750, 920, 0.8]].map(([x, y, s], i) => <g key={i}><Thing name="cactus" x={x} y={y} s={s} /><ellipse cx={x} cy={y - 40 * s} rx={130 * s} ry={70 * s} fill="#D08A5A" /></g>)}
    {children}
    <g style={{ filter: "blur(5px)" }}><Thing name="rocks" x={1980} y={1180} s={2.4} shadow={false} /></g>
  </Frame>
);

export const Swamp: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#020A08">
      <Sky top="#1A2A3A" mid="#4A6A5A" low="#9AB89A" sun={{ x: 1300, y: 330, r: 50, c: "#E8F4D8" }} />
      <Ridge seed={81} base={640} amp={180} kind="pines" c={mix("#1E3A2A", "#4A6A5A", 0.6)} />
      <Haze y={660} c="#A8C8A8" o={0.55} />
      <Ridge seed={82} base={760} amp={120} kind="hills" c="#2A4A2A" />
      <rect x={0} y={790} width={W} height={H - 790} fill="#1E3A2E" />
      <rect x={0} y={790} width={W} height={20} fill="#4A6A5A" opacity={0.5} />
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={(i * 337) % W} cy={860 + ((i * 53) % 180)} rx={120 + (i % 3) * 40} ry={6} fill="#9AB89A" opacity={0.15 + 0.08 * Math.sin(f / 20 + i)} />)}
      {[[1100, 920], [1350, 860], [1500, 990], [1750, 930]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={46} ry={14} fill="#3A8A4A" />
          <path d={`M${x} ${y} L ${x + 40} ${y - 6} L ${x + 40} ${y + 6} Z`} fill="#1E3A2E" />
          {i % 2 === 0 && <g transform={`translate(${x - 10},${y - 8})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-8} rx={6} ry={10} fill="#FFB8D0" transform={`rotate(${a})`} />)}</g>}
        </g>
      ))}
      {/* mudbank on the left for actors */}
      <path d={`M-20 ${GROUND_Y - 10} Q 400 ${GROUND_Y - 40} 820 ${GROUND_Y + 20} Q 900 ${H - 60} 700 ${H} L -20 ${H} Z`} fill="#3A3A22" />
      <Thing name="tree-stump" x={160} y={930} s={0.8} />
      <Thing name="log" x={520} y={970} s={0.7} />
      <Thing name="mushroom" x={340} y={990} s={0.3} />
      {[[620, 940], [80, 1000]].map(([x, y], i) => <Thing key={i} name="grass-tuft" x={x} y={y} s={0.5} f={f} shadow={false} />)}
      <Haze y={860} c="#C8D8C0" o={0.25} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="grass-tuft" x={1880} y={1160} s={2.0} f={f} shadow={false} /></g>
    </Frame>
  );
};

export const VolcanoIsland: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#1A0A0A">
      <Sky top="#3A2A6A" mid="#E87A5A" low="#FFC88A" sun={{ x: 400, y: 380, r: 80, c: "#FFD8A8" }} />
      <Thing name="volcano" x={1250} y={640} s={1.6} f={f} shadow={false} />
      <rect x={0} y={600} width={W} height={260} fill="#2A5A9A" />
      <rect x={0} y={600} width={W} height={50} fill="#E8885A" opacity={0.35} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-200 + ((f * (1 + i * 0.2) + i * 300) % 600)} ${650 + i * 35} ${Array.from({ length: 12 }, () => "q 40 -10 80 0").join(" ")}`} stroke="#FFD8C8" strokeWidth={4} fill="none" opacity={0.35} />)}
      <path d={`M0 ${840 + Math.sin(f / 12) * 6} Q 960 820 ${W} ${845 + Math.sin(f / 10) * 6} L ${W} 870 L 0 870 Z`} fill="#F4FAFF" opacity={0.7} />
      <Ground c="#E0C48A" texture="sand" seed={91} />
      {[[260, 930, 1.3], [1650, 920, 1.2], [1850, 940, 0.9]].map(([x, y, s], i) => <Thing key={i} name="palm" x={x} y={y} s={s} f={f + i * 10} />)}
      <Thing name="rocks" x={600} y={980} s={0.6} />
      <Thing name="seashell" x={1300} y={1000} s={0.3} />
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="palm" x={-80} y={1300} s={2.0} f={f} shadow={false} /></g>
    </Frame>
  );
};

const Acacia: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={160} ry={16} fill="#000" opacity={0.25} />
    <path d="M-14 0 Q -20 -150 -80 -260 M14 0 Q 30 -160 90 -250 M0 -120 Q 10 -200 0 -280" stroke="#5A3A22" strokeWidth={22} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-300} rx={260} ry={54} fill="#3A6A2A" />
    <ellipse cx={-20} cy={-316} rx={230} ry={40} fill="#5A8A3A" />
    <ellipse cx={-80} cy={-330} rx={100} ry={14} fill="#8AB85A" opacity={0.7} />
  </g>
);

export const Savanna: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Frame tint="#2A1404">
      <Sky top="#E8783A" mid="#F4B86A" low="#FFE8B8" sun={{ x: 960, y: 560, r: 160, c: "#FFD27A" }} />
      <Ridge seed={101} base={720} amp={60} kind="hills" c={mix("#B8783A", "#F4B86A", 0.5)} />
      <Acacia x={1450} y={760} s={0.6} />
      <Haze y={740} c="#FFE0B0" o={0.4} />
      <Ridge seed={102} base={830} amp={50} kind="hills" c="#C89A4A" />
      <Ground c="#D8A85A" texture="grass" seed={103} />
      <Acacia x={300} y={900} s={1.0} />
      {[[700, 960], [1200, 990], [1600, 970]].map(([x, y], i) => <Thing key={i} name="grass-tuft" x={x} y={y} s={0.6} f={f + i * 10} shadow={false} />)}
      <Thing name="rocks" x={1800} y={980} s={0.6} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 60 + ((f * 0.8) % 300)} ${300 + i * 20} q 10 -8 20 0 q 10 -8 20 0`} stroke="#3A1A0A" strokeWidth={4} fill="none" />)}
      {children}
      <g style={{ filter: "blur(5px)" }}><Thing name="grass-tuft" x={1880} y={1160} s={2.2} f={f} shadow={false} /></g>
    </Frame>
  );
};
