// Home & family interiors: one Room engine (wall + wallpaper micro-texture, baseboard, floor type, light) + presets.
// Actor slot: floor, feet at y ≈ 960–1010, s ≈ 0.6–0.7.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Thing } from "./objects";
import { Grad, shade } from "./gen";

const W = 1920, H = 1080;
export const FLOOR_Y = 820;

type FloorKind = "wood" | "tile" | "carpet";
const Room: React.FC<{ wall: string; pattern: "stripes" | "dots" | "diamonds" | "plain"; floor: string; floorKind: FloorKind; light?: string; lightX?: number; children?: React.ReactNode }> = ({
  wall, pattern, floor, floorKind, light = "#FFE2A8", lightX = 1400, children,
}) => (
  <AbsoluteFill style={{ background: shade(wall, -0.4), overflow: "hidden" }}>
    <svg width={W} height={H}>
      <defs>
        <linearGradient id={`rw${wall}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(wall, -0.12)} /><stop offset="1" stopColor={shade(wall, 0.05)} /></linearGradient>
        <linearGradient id={`rf${floor}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(floor, 0.08)} /><stop offset="1" stopColor={shade(floor, -0.3)} /></linearGradient>
        <radialGradient id={`rl${light}`}><stop offset="0" stopColor={light} stopOpacity="0.35" /><stop offset="1" stopColor={light} stopOpacity="0" /></radialGradient>
        <radialGradient id="rvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.5" /></radialGradient>
      </defs>
      <rect width={W} height={FLOOR_Y} fill={`url(#rw${wall})`} />
      {/* wallpaper micro-texture */}
      {pattern === "stripes" && Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y={0} width={30} height={FLOOR_Y} fill={shade(wall, 0.08)} opacity={0.5} />)}
      {pattern === "dots" && Array.from({ length: 300 }, (_, i) => <circle key={i} cx={(i % 25) * 80 + (Math.floor(i / 25) % 2) * 40} cy={Math.floor(i / 25) * 70 + 20} r={5} fill={shade(wall, 0.12)} opacity={0.6} />)}
      {pattern === "diamonds" && Array.from({ length: 160 }, (_, i) => { const x = (i % 20) * 100 + (Math.floor(i / 20) % 2) * 50, y = Math.floor(i / 20) * 100 + 40; return <path key={i} d={`M${x} ${y - 16} L ${x + 12} ${y} L ${x} ${y + 16} L ${x - 12} ${y} Z`} fill={shade(wall, 0.1)} opacity={0.55} />; })}
      {/* crown + baseboard */}
      <rect x={0} y={0} width={W} height={26} fill={shade(wall, 0.3)} /><rect x={0} y={26} width={W} height={6} fill="#000" opacity={0.15} />
      <rect x={0} y={FLOOR_Y - 40} width={W} height={40} fill="#F4EEE2" /><rect x={0} y={FLOOR_Y - 40} width={W} height={8} fill="#FFFFFF" opacity={0.7} />
      {/* floor */}
      <rect x={0} y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill={`url(#rf${floor})`} />
      {floorKind === "wood" && Array.from({ length: 16 }, (_, i) => <line key={i} x1={W / 2 + (i - 8) * 70} y1={FLOOR_Y} x2={W / 2 + (i - 8) * 260} y2={H} stroke={shade(floor, -0.25)} strokeWidth={4} />)}
      {floorKind === "tile" && (
        <g stroke={shade(floor, -0.2)} strokeWidth={4}>
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={W / 2 + (i - 7) * 150} y1={FLOOR_Y} x2={W / 2 + (i - 7) * 420} y2={H} />)}
          {[0.18, 0.42, 0.72].map((t) => <line key={t} x1={0} y1={FLOOR_Y + (H - FLOOR_Y) * t} x2={W} y2={FLOOR_Y + (H - FLOOR_Y) * t} />)}
        </g>
      )}
      {floorKind === "carpet" && Array.from({ length: 220 }, (_, i) => <circle key={i} cx={(i * 131) % W} cy={FLOOR_Y + ((i * 47) % (H - FLOOR_Y))} r={3} fill={shade(floor, 0.12)} opacity={0.5} />)}
      <rect x={0} y={FLOOR_Y} width={W} height={14} fill="#000" opacity={0.25} />
      <circle cx={lightX} cy={300} r={700} fill={`url(#rl${light})`} />
      {children}
      <rect width={W} height={H} fill="url(#rvig)" />
    </svg>
  </AbsoluteFill>
);

// daylight window helper (sun or night)
const Window: React.FC<{ x: number; y: number; w?: number; h?: number; night?: boolean }> = ({ x, y, w = 380, h = 420, night }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-16} y={-16} width={w + 32} height={h + 32} rx={10} fill="#F4EEE2" />
      <defs><linearGradient id={`win${night ? 1 : 0}${x}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? "#120A33" : "#5AA8E8"} /><stop offset="1" stopColor={night ? "#3A2A6A" : "#CFEAFF"} /></linearGradient></defs>
      <rect width={w} height={h} fill={`url(#win${night ? 1 : 0}${x})`} />
      {night ? <circle cx={w * 0.7} cy={h * 0.25} r={30} fill="#FFF2C4" /> : <g>{[[0.3, 0.3], [0.7, 0.2]].map(([a, b], i) => <g key={i} transform={`translate(${((w * a + f * 0.3) % (w + 100)) - 50},${h * b})`}><circle cx={0} cy={0} r={24} fill="#FFFFFF" /><circle cx={28} cy={6} r={20} fill="#FFFFFF" /><circle cx={-26} cy={8} r={16} fill="#FFFFFF" /></g>)}<path d={`M0 ${h} L ${w * 0.3} ${h * 0.7} L ${w * 0.55} ${h * 0.85} L ${w} ${h * 0.6} L ${w} ${h} Z`} fill="#5AAA4A" /></g>}
      <rect x={w / 2 - 6} y={0} width={12} height={h} fill="#F4EEE2" /><rect x={0} y={h / 2 - 6} width={w} height={12} fill="#F4EEE2" />
      <path d={`M10 10 L ${w * 0.4} 10 L 10 ${h * 0.45} Z`} fill="#FFFFFF" opacity={0.15} />
      {!night && <polygon points={`${w},${h} ${w + 600},${FLOOR_Y + 260 - y} ${w + 900},${FLOOR_Y + 260 - y} ${w},${h * 0.4}`} fill="#FFF2C4" opacity={0.08} />}
    </g>
  );
};

// counter / stove for the kitchen
const Counter: React.FC<{ x: number; w: number }> = ({ x, w }) => (
  <g>
    <defs><Grad id="ctop" c="#E8E4DA" angle={90} /></defs>
    <rect x={x} y={FLOOR_Y - 330} width={w} height={30} rx={8} fill="url(#ctop)" />
    <rect x={x + 10} y={FLOOR_Y - 300} width={w - 20} height={300} fill="#4A6A9A" />
    {Array.from({ length: Math.floor(w / 200) }, (_, i) => <g key={i}><rect x={x + 26 + i * 200} y={FLOOR_Y - 280} width={170} height={250} rx={10} fill="#5A7AAA" /><rect x={x + 96 + i * 200} y={FLOOR_Y - 180} width={30} height={10} rx={5} fill="#D9A23F" /></g>)}
    {/* upper cabinets */}
    <rect x={x + 10} y={120} width={w - 20} height={200} fill="#5A7AAA" />
    {Array.from({ length: Math.floor(w / 200) }, (_, i) => <rect key={`u${i}`} x={x + 26 + i * 200} y={136} width={170} height={168} rx={10} fill="#6A8ABA" />)}
    {/* backsplash tiles */}
    {Array.from({ length: Math.floor(w / 60) * 3 }, (_, i) => <rect key={`t${i}`} x={x + 10 + (i % Math.floor(w / 60)) * 60} y={340 + Math.floor(i / Math.floor(w / 60)) * 50} width={56} height={46} fill="#F4F6FF" opacity={0.85} />)}
  </g>
);
const Stove: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x} y={FLOOR_Y - 330} width={260} height={330} rx={10} fill="#D6DCEA" />
    <rect x={x + 20} y={FLOOR_Y - 230} width={220} height={190} rx={12} fill="#2A2A3A" /><rect x={x + 40} y={FLOOR_Y - 210} width={180} height={50} rx={8} fill="#FF8A3A" opacity={0.3} />
    {[50, 100, 160, 210].map((k) => <circle key={k} cx={x + k} cy={FLOOR_Y - 300} r={12} fill="#2A2A3A" />)}
  </g>
);

// =================== PRESETS ===================
export const Bedroom: React.FC<{ children?: React.ReactNode; night?: boolean }> = ({ children, night }) => {
  const f = useCurrentFrame();
  return (
    <Room wall="#7A6AB8" pattern="dots" floor="#9A6A4A" floorKind="wood" light={night ? "#9FB8FF" : "#FFE2A8"} lightX={1500}>
      <Window x={1360} y={150} night={night} />
      <Thing name="picture-frame" x={560} y={360} s={0.7} shadow={false} />
      <Thing name="wall-clock" x={960} y={330} s={0.4} f={f} shadow={false} />
      <Thing name="rug" x={900} y={1010} s={1.7} shadow={false} />
      <Thing name="bed" x={640} y={930} s={1.55} />
      <Thing name="side-table" x={1230} y={900} s={0.95} />
      <Thing name="alarm-clock" x={1180} y={710} s={0.38} f={f} />
      <Thing name="vase" x={1280} y={712} s={0.42} />
      <Thing name="floor-lamp" x={150} y={900} s={0.85} />
      <Thing name="backpack" x={1760} y={980} s={0.55} />
      {children}
    </Room>
  );
};

export const LivingRoom: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Room wall="#3A8A8A" pattern="diamonds" floor="#B88A5A" floorKind="wood" lightX={500}>
      <Window x={140} y={150} w={360} h={400} />
      <Thing name="bookshelf" x={1720} y={830} s={1.0} />
      <Thing name="picture-frame" x={960} y={330} s={0.8} shadow={false} />
      <Thing name="tv" x={1300} y={720} s={0.7} f={f} />
      <rect x={1100} y={720} width={400} height={110} rx={10} fill="#5A3A26" />
      <Thing name="rug" x={900} y={1020} s={2.0} shadow={false} />
      <Thing name="sofa" x={800} y={930} s={1.1} />
      <Thing name="houseplant" x={1550} y={950} s={0.8} f={f} />
      <Thing name="armchair" x={260} y={980} s={0.7} />
      <Thing name="side-table" x={460} y={980} s={0.55} />
      <Thing name="mug" x={460} y={865} s={0.25} f={f} />
      {children}
    </Room>
  );
};

export const Kitchen: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Room wall="#E8C86A" pattern="stripes" floor="#D8D4CC" floorKind="tile" lightX={960}>
      <Counter x={-20} w={1100} />
      <Stove x={1080} />
      <Thing name="fridge" x={1560} y={FLOOR_Y + 10} s={1.25} />
      <Thing name="cooking-pot" x={1210} y={FLOOR_Y - 330} s={0.45} f={f} />
      <Thing name="kettle" x={180} y={FLOOR_Y - 330} s={0.45} f={f} />
      <Thing name="toaster" x={400} y={FLOOR_Y - 330} s={0.45} />
      <Thing name="cutting-board" x={700} y={FLOOR_Y - 330} s={0.5} />
      <Thing name="water-glass" x={940} y={FLOOR_Y - 330} s={0.35} />
      <Thing name="wall-clock" x={1300} y={330} s={0.35} f={f} shadow={false} />
      {children}
    </Room>
  );
};

export const HomeOffice: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <Room wall="#4A5A8A" pattern="plain" floor="#7A5A7A" floorKind="carpet" lightX={700}>
      <Window x={1380} y={150} w={360} h={400} />
      <Thing name="calendar" x={520} y={480} s={0.6} shadow={false} />
      <Thing name="sticky-notes" x={780} y={440} s={0.5} shadow={false} />
      <Thing name="bookshelf" x={160} y={830} s={0.9} />
      <Thing name="desk" x={900} y={900} s={1.1} />
      <Thing name="monitor" x={820} y={614} s={0.6} f={f} />
      <Thing name="desk-lamp" x={1060} y={614} s={0.55} />
      <Thing name="pencil-cup" x={640} y={614} s={0.35} />
      <Thing name="office-chair" x={880} y={1000} s={0.8} />
      <Thing name="filing-cabinet" x={1640} y={870} s={0.75} />
      <Thing name="trash-bin" x={1420} y={960} s={0.45} />
      <Thing name="houseplant" x={1820} y={960} s={0.7} f={f} />
      {children}
    </Room>
  );
};

export const INTERIORS = { Bedroom, LivingRoom, Kitchen, HomeOffice };
