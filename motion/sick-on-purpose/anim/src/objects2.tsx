// Object library batch 2 (50): office, kitchen, vehicles, weather, buildings, sports, signs, science.
// Same conventions as objects.tsx: origin = bottom centre, ~300 px tall at s=1, Part kit shading.
import React from "react";
import { circ, ell, Line, Part, rr, Shine } from "./objkit";
import type { ObjDef } from "./objects";

const wheel = (p: string, x: number, y: number, r: number, k: string) => (
  <g key={k}><Part id={p + "w" + k} d={circ(x, y, r)} c="#2A2A3A" /><Part id={p + "h" + k} d={circ(x, y, r * 0.5)} c="#9FA8C8" /></g>
);

// ---------- OFFICE ----------
const office: ObjDef[] = [
  { name: "desk", cat: "office", w: 260, draw: (p) => (<g>
    <Part id={p + "t"} d={rr(-280, -260, 560, 40, 12)} c="#A8724A" />
    <Part id={p + "d"} d={rr(100, -222, 160, 222, 8)} c="#94603E" />
    {[-170, -100, -30].map((y) => <g key={y}><Line d={`M120 ${y} H 240`} c="#7A4A2A" w={4} /><rect x={168} y={y - 46} width={24} height={8} rx={4} fill="#D9A23F" /></g>)}
    <Part id={p + "l"} d={rr(-260, -222, 24, 222, 6)} c="#8A5A3A" />
    <Shine x={-150} y={-252} rx={90} ry={6} r={0} o={0.35} />
  </g>) },
  { name: "office-chair", cat: "office", w: 150, draw: (p) => (<g>
    {[-80, -30, 30, 80].map((x) => <g key={x}><Line d={`M0 -40 L ${x} -10`} c="#2A2A3A" w={12} />{wheel(p, x, -8, 12, String(x))}</g>)}
    <Part id={p + "p"} d={rr(-10, -150, 20, 110, 6)} c="#9FA8C8" />
    <Part id={p + "s"} d={rr(-110, -180, 220, 50, 22)} c="#2A3E7A" />
    <Part id={p + "b"} d={rr(-90, -400, 180, 220, 50)} c="#2A3E7A" />
    <Line d="M-50 -360 V -220 M50 -360 V -220" c="#1E2E5A" w={5} o={0.7} />
  </g>) },
  { name: "filing-cabinet", cat: "office", w: 120, draw: (p) => (<g>
    <Part id={p + "c"} d={rr(-110, -420, 220, 420, 12)} c="#7A86A8" />
    {[-400, -270, -140].map((y) => <g key={y}><Part id={p + "d" + y} d={rr(-94, y, 188, 118, 8)} c="#8A96B8" /><Part id={p + "h" + y} d={rr(-34, y + 20, 68, 18, 9)} c="#D9A23F" /><rect x={-28} y={y + 50} width={56} height={30} rx={4} fill="#F4EEE2" /></g>)}
  </g>) },
  { name: "printer", cat: "office", w: 180, draw: (p, f) => (<g>
    <Part id={p + "b"} d={rr(-180, -170, 360, 170, 22)} c="#D6D0EC" />
    <Part id={p + "t"} d={rr(-150, -200, 300, 40, 12)} c="#B4ACD6" />
    <Part id={p + "pp"} d={`M-110 ${-90 + Math.min(80, (f % 90))} L 110 ${-90 + Math.min(80, (f % 90))} L 110 -60 L -110 -60 Z`} c="#FFFFFF" rim={false} />
    <rect x={-130} y={-80} width={260} height={16} rx={8} fill="#2A2F5A" />
    <circle cx={140} cy={-140} r={10} fill="#2FE08A" opacity={0.5 + 0.5 * Math.sin(f / 5)} />
  </g>) },
  { name: "calculator", cat: "office", w: 100, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-100, -300, 200, 300, 24)} c="#3A3F6A" />
    <rect x={-80} y={-280} width={160} height={70} rx={10} fill="#BFE8C8" />
    <text x={70} y={-230} textAnchor="end" fontFamily="Arial Black" fontSize={40} fill="#2A3A2A">42</text>
    {Array.from({ length: 12 }, (_, i) => <Part key={i} id={p + "k" + i} d={rr(-80 + (i % 3) * 56, -190 + Math.floor(i / 3) * 44, 46, 34, 8)} c={i % 3 === 2 ? "#FF8A1F" : "#9FA8C8"} rim={false} />)}
  </g>) },
  { name: "pencil-cup", cat: "office", w: 80, draw: (p) => (<g>
    {[[-30, -10, "#FFD23F"], [0, 6, "#3FC1C9"], [26, 14, "#FF7A9A"]].map(([x, a, c], i) => (
      <g key={i} transform={`rotate(${a},${x},-120)`}><Part id={p + "p" + i} d={rr((x as number) - 10, -300, 20, 200, 4)} c={c as string} /><path d={`M${(x as number) - 10} -300 L ${x} -330 L ${(x as number) + 10} -300 Z`} fill="#F2C27A" /></g>
    ))}
    <Part id={p + "c"} d="M-70 -160 L 70 -160 L 60 0 L -60 0 Z" c="#2A3E7A" />
  </g>) },
  { name: "sticky-notes", cat: "office", w: 120, draw: (p) => (<g>
    {[["#FFE066", -10, 0], ["#FF9EB0", 10, -20], ["#7FE8FF", -4, -40]].map(([c, a, y], i) => (
      <g key={i} transform={`rotate(${a},0,-120)`}><Part id={p + "n" + i} d={rr(-110, (y as number) - 220, 220, 220, 6)} c={c as string} />
        {[0, 1, 2].map((k) => <Line key={k} d={`M-70 ${(y as number) - 170 + k * 40} H ${k === 2 ? 20 : 70}`} c="#2A2F5A" w={5} o={0.3} />)}</g>
    ))}
  </g>) },
  { name: "trash-bin", cat: "office", w: 100, draw: (p) => (<g>
    <Part id={p + "b"} d="M-90 -260 L 90 -260 L 70 0 L -70 0 Z" c="#6A6E8A" />
    {[-50, -15, 20, 55].map((x) => <Line key={x} d={`M${x} -230 L ${x * 0.8} -30`} c="#4A4E6A" w={6} />)}
    <Part id={p + "l"} d={rr(-104, -280, 208, 28, 10)} c="#7A7E9A" />
    <Part id={p + "pp"} d="M-40 -280 Q -20 -330 10 -300 Q 40 -340 50 -280 Z" c="#F4EEE2" />
  </g>) },
];

// ---------- KITCHEN ----------
const kitchen: ObjDef[] = [
  { name: "fridge", cat: "kitchen", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -560, 300, 560, 30)} c="#E8EEF8" />
    <Line d="M-150 -380 H 150" c="#B4BCD6" w={6} />
    <Part id={p + "h1"} d={rr(100, -520, 16, 110, 8)} c="#9FA8C8" /><Part id={p + "h2"} d={rr(100, -340, 16, 160, 8)} c="#9FA8C8" />
    {[["#FF7A9A", -90, -480], ["#FFD23F", -40, -300], ["#3FC1C9", -100, -220]].map(([c, x, y], i) => <Part key={i} id={p + "m" + i} d={circ(x as number, y as number, 16)} c={c as string} />)}
    <Shine x={-110} y={-300} rx={10} ry={160} r={0} o={0.4} />
  </g>) },
  { name: "cooking-pot", cat: "kitchen", w: 160, draw: (p, f) => (<g>
    {[-1, 1].map((sd) => <Part key={sd} id={p + "h" + sd} d={rr(sd < 0 ? -190 : 140, -160, 50, 24, 10)} c="#2A2A3A" />)}
    <Part id={p + "b"} d="M-150 -190 L 150 -190 L 140 -20 Q 136 0 116 0 L -116 0 Q -136 0 -140 -20 Z" c="#C2384A" />
    <Part id={p + "l"} d={ell(0, -196, 156, 26)} c="#9A2A38" /><Part id={p + "k"} d={rr(-20, -240, 40, 30, 10)} c="#2A2A3A" />
    {[0, 1, 2].map((i) => <Line key={i} d={`M${-60 + i * 60} -250 q 16 -24 0 -48 q -16 -24 0 -48`} c="#FFFFFF" w={8} o={0.25 + 0.2 * Math.sin(f / 8 + i)} />)}
  </g>) },
  { name: "frying-pan", cat: "kitchen", w: 200, draw: (p) => (<g>
    <Part id={p + "h"} d={rr(120, -60, 200, 30, 15)} c="#2A2A3A" />
    <Part id={p + "p"} d={ell(-20, -50, 170, 50)} c="#3A3A4A" /><Part id={p + "i"} d={ell(-20, -58, 140, 36)} c="#4A4A5A" rim={false} />
    <Part id={p + "e"} d={ell(-40, -62, 60, 22)} c="#FFFFFF" rim={false} /><Part id={p + "y"} d={circ(-36, -66, 18)} c="#FFC23A" />
  </g>) },
  { name: "kettle", cat: "kitchen", w: 130, draw: (p, f) => (<g>
    <Line d="M-80 -200 Q 0 -330 80 -200" c="#2A2A3A" w={18} />
    <Part id={p + "s"} d="M100 -120 L 180 -200 L 190 -180 L 120 -90 Z" c="#3FC1C9" />
    <Part id={p + "b"} d="M-120 -40 Q -130 -220 0 -230 Q 130 -220 120 -40 Q 110 0 80 0 L -80 0 Q -110 0 -120 -40 Z" c="#3FC1C9" ang={50} />
    <Line d={`M185 -200 q 14 -24 0 -48`} c="#FFFFFF" w={7} o={0.3 + 0.2 * Math.sin(f / 6)} /><Shine x={-60} y={-150} rx={18} ry={40} />
  </g>) },
  { name: "toaster", cat: "kitchen", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-160, -220, 320, 220, 60)} c="#B8C0DA" />
    {[-60, 60].map((x) => <g key={x}><rect x={x - 46} y={-226} width={92} height={18} rx={9} fill="#2A2A3A" /><Part id={p + "t" + x} d={rr(x - 40, -280, 80, 70, 14)} c="#E0A05A" /></g>)}
    <Part id={p + "k"} d={rr(150, -140, 30, 20, 8)} c="#2A2A3A" /><Shine x={-100} y={-160} rx={14} ry={40} />
  </g>) },
  { name: "plate-fork", cat: "kitchen", w: 180, draw: (p) => (<g>
    <Part id={p + "p"} d={ell(0, -40, 170, 40)} c="#F4EEE2" /><Part id={p + "i"} d={ell(0, -44, 120, 26)} c="#FFFFFF" rim={false} />
    <Part id={p + "f"} d={rr(190, -150, 16, 150, 6)} c="#B8C0DA" />{[188, 196, 204].map((x) => <Line key={x} d={`M${x} -150 V -200`} c="#B8C0DA" w={4} />)}
  </g>) },
  { name: "water-glass", cat: "kitchen", w: 80, draw: (p) => (<g>
    <path d="M-70 -260 L 70 -260 L 56 0 L -56 0 Z" fill="#CFE8FF" opacity={0.3} />
    <Part id={p + "w"} d="M-64 -160 L 64 -160 L 56 -6 L -56 -6 Z" c="#7FC8FF" rim={false} />
    <Line d="M-70 -260 L -56 0 L 56 0 L 70 -260" c="#E8F4FF" w={5} o={0.8} /><Shine x={-44} y={-140} rx={6} ry={60} r={-4} o={0.5} />
  </g>) },
  { name: "cutting-board", cat: "kitchen", w: 200, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-200, -50, 400, 50, 16)} c="#C8945A" /><circle cx={170} cy={-25} r={10} fill="#8A5A3A" />
    <Part id={p + "k"} d="M-120 -60 L 80 -60 L 100 -80 L -120 -80 Z" c="#D6DCEA" /><Part id={p + "kh"} d={rr(-200, -84, 84, 28, 10)} c="#2A2A3A" />
    {[0, 1, 2].map((i) => <Part key={i} id={p + "c" + i} d={circ(40 + i * 40, -64, 14)} c="#FF8A2A" />)}
  </g>) },
];

// ---------- VEHICLES ----------
const vehicles: ObjDef[] = [
  { name: "car", cat: "vehicles", w: 230, draw: (p) => (<g>
    <Part id={p + "b"} d="M-230 -40 L -230 -110 Q -220 -140 -170 -144 L -110 -220 Q -90 -240 -60 -240 L 80 -240 Q 110 -240 130 -210 L 170 -144 Q 230 -140 236 -100 L 236 -40 Z" c="#E23A4A" />
    <Part id={p + "w"} d="M-96 -210 L -50 -210 L -50 -150 L -150 -150 Z M-30 -210 L 80 -210 Q 96 -210 110 -190 L 140 -150 L -30 -150 Z" c="#7FE8FF" rim={false} />
    {wheel(p, -140, -40, 46, "a")}{wheel(p, 140, -40, 46, "b")}
    <rect x={200} y={-120} width={30} height={20} rx={8} fill="#FFE9A8" /><Shine x={-100} y={-170} rx={60} ry={8} r={0} o={0.3} />
  </g>) },
  { name: "bus", cat: "vehicles", w: 280, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-280, -300, 560, 260, 40)} c="#FFC23A" />
    {[-240, -140, -40, 60, 160].map((x) => <Part key={x} id={p + "w" + x} d={rr(x, -270, 80, 90, 12)} c="#7FE8FF" rim={false} />)}
    <Line d="M-280 -140 H 280" c="#C8901A" w={10} />
    {wheel(p, -170, -40, 46, "a")}{wheel(p, 170, -40, 46, "b")}
  </g>) },
  { name: "bicycle", cat: "vehicles", w: 210, draw: () => (<g>
    {[-130, 130].map((x) => <g key={x}><circle cx={x} cy={-100} r={90} fill="none" stroke="#2A2A3A" strokeWidth={12} /><circle cx={x} cy={-100} r={12} fill="#9FA8C8" /></g>)}
    <Line d="M-130 -100 L -30 -100 L 60 -230 L -70 -230 Z M-30 -100 L -70 -230 M60 -230 L 130 -100" c="#2E8A5A" w={12} />
    <Line d="M-70 -230 L -80 -260 M-110 -264 H -50 M60 -230 L 50 -280 L 90 -290" c="#2A2A3A" w={10} />
  </g>) },
  { name: "truck", cat: "vehicles", w: 280, draw: (p) => (<g>
    <Part id={p + "c"} d={rr(-280, -320, 360, 260, 16)} c="#F4EEE2" /><Line d="M-260 -200 H 60" c="#3FC1C9" w={20} />
    <Part id={p + "k"} d="M90 -60 L 90 -240 L 200 -240 Q 240 -240 260 -180 L 280 -120 L 280 -60 Z" c="#2A3E7A" />
    <Part id={p + "w"} d="M110 -220 L 196 -220 Q 220 -220 236 -170 L 110 -170 Z" c="#7FE8FF" rim={false} />
    {wheel(p, -190, -50, 44, "a")}{wheel(p, -60, -50, 44, "b")}{wheel(p, 190, -50, 44, "c")}
  </g>) },
  { name: "airplane", cat: "vehicles", w: 260, draw: (p) => (<g transform="translate(0,-150)">
    <Part id={p + "w"} d="M-40 -10 L -140 -150 L -90 -150 L 60 -10 Z" c="#9FA8C8" /><Part id={p + "t"} d="M-230 -20 L -280 -110 L -240 -110 L -190 -20 Z" c="#E23A4A" />
    <Part id={p + "b"} d="M-260 -40 Q -260 0 -200 10 L 220 10 Q 300 0 290 -30 Q 270 -60 200 -60 L -200 -60 Q -260 -60 -260 -40 Z" c="#F4EEE2" />
    {[-120, -70, -20, 30, 80, 130].map((x) => <Part key={x} id={p + "o" + x} d={circ(x, -30, 10)} c="#2A4A8A" rim={false} />)}
    <Part id={p + "w2"} d="M-20 0 L -120 120 L -70 120 L 70 0 Z" c="#B8C0DA" />
  </g>) },
  { name: "sailboat", cat: "vehicles", w: 210, draw: (p) => (<g>
    <Part id={p + "h"} d="M-200 -80 L 200 -80 L 150 0 L -150 0 Z" c="#2A3E7A" /><Line d="M-190 -60 H 190" c="#F4EEE2" w={6} />
    <Line d="M0 -80 V -420" c="#6A4A2A" w={12} />
    <Part id={p + "s1"} d="M10 -410 L 10 -100 L 170 -100 Z" c="#F4EEE2" /><Part id={p + "s2"} d="M-10 -360 L -10 -100 L -140 -100 Z" c="#FF7A9A" />
  </g>) },
  { name: "train", cat: "vehicles", w: 260, draw: (p, f) => (<g>
    <Part id={p + "b"} d={rr(-250, -260, 330, 200, 24)} c="#2E8A5A" /><Part id={p + "c"} d={rr(40, -360, 180, 300, 20)} c="#2A6A4A" />
    <Part id={p + "w"} d={rr(70, -330, 120, 90, 12)} c="#FFE9A8" rim={false} />
    <Part id={p + "s"} d={rr(-200, -360, 60, 110, 10)} c="#2A2A3A" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-170 - i * 30} cy={-390 - i * 40 - (f % 30)} r={26 + i * 8} fill="#F4EEE2" opacity={0.5 - i * 0.12} />)}
    {[-180, -60, 70, 170].map((x) => wheel(p, x, -50, 40, String(x)))}
  </g>) },
  { name: "helicopter", cat: "vehicles", w: 240, draw: (p, f) => (<g transform="translate(0,-60)">
    <Line d="M-120 0 H 140 M-80 0 V -40 M100 0 V -40" c="#2A2A3A" w={10} />
    <Part id={p + "t"} d="M80 -150 L 280 -130 L 290 -110 L 80 -100 Z" c="#E0A83A" /><Part id={p + "tr"} d={rr(270, -170, 16, 80, 6)} c="#2A2A3A" />
    <Part id={p + "b"} d="M-150 -100 Q -160 -230 -20 -240 L 60 -240 Q 140 -230 140 -130 Q 130 -60 40 -50 L -80 -50 Q -150 -60 -150 -100 Z" c="#E0A83A" />
    <Part id={p + "w"} d="M-130 -110 Q -130 -210 -40 -220 L -20 -220 L -20 -110 Z" c="#7FE8FF" rim={false} />
    <Line d="M-10 -240 V -280" c="#2A2A3A" w={10} /><g transform={`translate(-10,-280) scale(${Math.cos(f * 0.9)},1)`}><Line d="M-260 0 H 260" c="#2A2A3A" w={10} /></g>
  </g>) },
];

// ---------- WEATHER ----------
const cloudD = "M-160 -40 Q -200 -40 -200 -90 Q -200 -140 -150 -140 Q -140 -220 -60 -220 Q 0 -270 60 -220 Q 150 -230 160 -150 Q 210 -140 210 -90 Q 210 -40 160 -40 Z";
const weather: ObjDef[] = [
  { name: "cloud", cat: "weather", w: 200, draw: (p) => (<g><Part id={p + "c"} d={cloudD} c="#F4F6FF" ang={60} /><Shine x={-40} y={-190} rx={50} ry={14} r={0} o={0.6} /></g>) },
  { name: "rain-cloud", cat: "weather", w: 200, draw: (p, f) => (<g>
    {Array.from({ length: 7 }, (_, i) => <Line key={i} d={`M${-150 + i * 50} ${-150 + ((f * 6 + i * 30) % 120)} l -10 30`} c="#7FC8FF" w={7} />)}
    <g transform="translate(0,-130)"><Part id={p + "c"} d={cloudD} c="#9FA8C8" ang={60} /></g>
  </g>) },
  { name: "sun", cat: "weather", w: 160, draw: (p, f) => (<g transform="translate(0,-180)">
    <g transform={`rotate(${f * 0.6})`}>{Array.from({ length: 12 }, (_, i) => <path key={i} d="M-14 -130 L 0 -190 L 14 -130 Z" fill="#FFC23A" transform={`rotate(${i * 30})`} />)}</g>
    <circle r={160} fill="#FFE066" opacity={0.15} /><Part id={p + "s"} d={circ(0, 0, 110)} c="#FFD23F" ang={50} /><Shine x={-40} y={-40} rx={30} ry={14} o={0.5} />
  </g>) },
  { name: "snowflake", cat: "weather", w: 140, draw: (_, f) => (<g transform={`translate(0,-170) rotate(${f * 0.4})`}>
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`rotate(${i * 60})`}><Line d="M0 0 V -150 M0 -60 l -30 -30 M0 -60 l 30 -30 M0 -110 l -22 -22 M0 -110 l 22 -22" c="#CFE8FF" w={12} /></g>)}
    <circle r={22} fill="#FFFFFF" />
  </g>) },
  { name: "storm-cloud", cat: "weather", w: 200, draw: (p, f) => (<g>
    <path d="M10 -120 L -40 -30 L 0 -30 L -30 60 L 60 -60 L 20 -60 L 50 -120 Z" fill="#FFE066" opacity={f % 40 < 6 ? 1 : 0.6} transform="translate(0,-40)" />
    <g transform="translate(0,-80)"><Part id={p + "c"} d={cloudD} c="#5A5E7A" ang={60} /></g>
  </g>) },
  { name: "rainbow", cat: "weather", w: 220, draw: (p) => (<g>
    {["#FF4D6D", "#FF8A1F", "#FFD23F", "#2FE08A", "#3FC1C9", "#7A5AD8"].map((c, i) => <path key={c} d={`M${-220 + i * 22} 0 A ${220 - i * 22} ${220 - i * 22} 0 0 1 ${220 - i * 22} 0`} stroke={c} strokeWidth={22} fill="none" />)}
    <g transform="translate(-200,30) scale(0.45)"><Part id={p + "c1"} d={cloudD} c="#F4F6FF" /></g><g transform="translate(200,30) scale(0.45)"><Part id={p + "c2"} d={cloudD} c="#F4F6FF" /></g>
  </g>) },
];

// ---------- BUILDINGS ----------
const windows = (p: string, x0: number, y0: number, cols: number, rows: number, w: number, h: number, gx: number, gy: number, c = "#FFE9A8") =>
  Array.from({ length: cols * rows }, (_, i) => <rect key={p + i} x={x0 + (i % cols) * gx} y={y0 + Math.floor(i / cols) * gy} width={w} height={h} rx={4} fill={(i * 7) % 5 === 0 ? "#2A3E7A" : c} />);
const buildings: ObjDef[] = [
  { name: "house", cat: "buildings", w: 230, draw: (p) => (<g>
    <Part id={p + "w"} d={rr(-200, -260, 400, 260, 8)} c="#F4DEB8" />
    <Part id={p + "r"} d="M-240 -250 L 0 -440 L 240 -250 Z" c="#C2384A" ang={60} /><Part id={p + "ch"} d={rr(110, -420, 50, 110, 6)} c="#8A4A3A" />
    <Part id={p + "d"} d={rr(-40, -150, 80, 150, 8)} c="#8A5A3A" />
    {[-150, 90].map((x) => <g key={x}><Part id={p + "win" + x} d={rr(x, -200, 70, 70, 8)} c="#7FC8FF" rim={false} /><Line d={`M${x + 35} -200 V -130 M${x} -165 H ${x + 70}`} c="#F4EEE2" w={5} /></g>)}
  </g>) },
  { name: "skyscraper", cat: "buildings", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-130, -620, 260, 620, 10)} c="#3A5A9A" /><Part id={p + "s"} d={rr(60, -620, 70, 620, 6)} c="#2A4A8A" />
    <Part id={p + "t"} d={rr(-60, -680, 120, 70, 8)} c="#2A3E7A" /><Line d="M0 -680 V -760" c="#9FA8C8" w={6} /><circle cx={0} cy={-764} r={8} fill="#FF4D6D" />
    {windows(p, -110, -600, 4, 14, 36, 24, 46, 40)}
  </g>) },
  { name: "factory", cat: "buildings", w: 260, draw: (p, f) => (<g>
    <Part id={p + "b"} d="M-260 0 L -260 -200 L -170 -260 L -170 -200 L -80 -260 L -80 -200 L 10 -260 L 10 -200 L 260 -200 L 260 0 Z" c="#8A6A5A" />
    <Part id={p + "s"} d={rr(120, -440, 60, 240, 6)} c="#6A4A3A" />
    {[0, 1, 2].map((i) => <circle key={i} cx={150 + i * 20} cy={-480 - i * 46 - (f % 40)} r={30 + i * 12} fill="#9FA8C8" opacity={0.5 - i * 0.12} />)}
    {windows(p, -230, -160, 8, 2, 44, 40, 60, 70)}
  </g>) },
  { name: "hospital", cat: "buildings", w: 250, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-240, -380, 480, 380, 12)} c="#F4F6FF" /><Part id={p + "x"} d="M-30 -340 H 30 V -300 H 70 V -240 H 30 V -200 H -30 V -240 H -70 V -300 H -30 Z" c="#E23A4A" rim={false} />
    {windows(p, -210, -170, 9, 2, 32, 40, 48, 60, "#7FC8FF")}
    <Part id={p + "d"} d={rr(-50, -80, 100, 80, 6)} c="#3FC1C9" />
  </g>) },
  { name: "barn", cat: "buildings", w: 240, draw: (p) => (<g>
    <Part id={p + "b"} d="M-220 0 L -220 -240 L -150 -340 L 150 -340 L 220 -240 L 220 0 Z" c="#B8323F" />
    <Part id={p + "r"} d="M-240 -236 L -160 -360 L 160 -360 L 240 -236 L 220 -236 L 150 -336 L -150 -336 L -220 -236 Z" c="#F4EEE2" />
    <Part id={p + "d"} d={rr(-90, -200, 180, 200, 6)} c="#9A2A38" /><Line d="M-90 -200 L 90 0 M90 -200 L -90 0" c="#F4EEE2" w={10} />
    <Part id={p + "h"} d={rr(-40, -300, 80, 60, 6)} c="#F4EEE2" />
  </g>) },
];

// ---------- SPORTS / LEISURE ----------
const sports: ObjDef[] = [
  { name: "soccer-ball", cat: "sports", w: 100, draw: (p) => (<g>
    <Part id={p + "b"} d={circ(0, -110, 110)} c="#F4F6FF" ang={50} />
    {[[0, -110], [-70, -160], [70, -160], [-60, -40], [60, -40]].map(([x, y], i) => <path key={i} d={`M${x} ${(y as number) - 26} l 25 18 l -10 30 h -30 l -10 -30 Z`} fill="#2A2A3A" />)}
  </g>) },
  { name: "basketball", cat: "sports", w: 100, draw: (p) => (<g>
    <Part id={p + "b"} d={circ(0, -110, 110)} c="#FF8A2A" ang={50} />
    <Line d="M-110 -110 H 110 M0 -220 V 0 M-76 -190 Q -20 -110 -76 -30 M76 -190 Q 20 -110 76 -30" c="#6A2A0A" w={6} />
  </g>) },
  { name: "dumbbell", cat: "sports", w: 170, draw: (p) => (<g>
    <Part id={p + "h"} d={rr(-120, -84, 240, 26, 12)} c="#9FA8C8" />
    {[-1, 1].map((sd) => <g key={sd}><Part id={p + "a" + sd} d={rr(sd < 0 ? -170 : 120, -140, 50, 140, 12)} c="#2A2A3A" /><Part id={p + "b" + sd} d={rr(sd < 0 ? -120 : 96, -120, 24, 100, 8)} c="#3A3A4A" /></g>)}
  </g>) },
  { name: "trophy", cat: "sports", w: 110, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-90, -60, 180, 60, 10)} c="#5A3A26" /><Part id={p + "s"} d={rr(-24, -130, 48, 74, 8)} c="#D9A23F" />
    {[-1, 1].map((sd) => <Line key={sd} d={`M${sd * 90} -330 Q ${sd * 160} -330 ${sd * 140} -260 Q ${sd * 120} -210 ${sd * 70} -210`} c="#D9A23F" w={16} />)}
    <Part id={p + "c"} d="M-100 -350 L 100 -350 Q 100 -170 0 -140 Q -100 -170 -100 -350 Z" c="#F4CF7A" ang={50} />
    <text x={0} y={-250} textAnchor="middle" fontFamily="Arial Black" fontSize={70} fill="#A8721F">1</text><Shine x={-50} y={-300} rx={12} ry={40} r={10} />
  </g>) },
  { name: "guitar", cat: "sports", w: 110, draw: (p) => (<g transform="rotate(-20,0,-200)">
    <Part id={p + "n"} d={rr(-14, -480, 28, 300, 6)} c="#5A3A26" /><Part id={p + "hd"} d={rr(-24, -540, 48, 70, 10)} c="#3A2416" />
    <Part id={p + "b"} d="M0 -260 C -100 -260 -110 -170 -70 -140 C -130 -110 -130 0 0 0 C 130 0 130 -110 70 -140 C 110 -170 100 -260 0 -260 Z" c="#E0782A" ang={50} />
    <circle cx={0} cy={-130} r={30} fill="#3A2416" /><Part id={p + "br"} d={rr(-40, -70, 80, 16, 6)} c="#3A2416" />
    {[-6, -2, 2, 6].map((x) => <Line key={x} d={`M${x} -480 V -62`} c="#E8E8F0" w={2} />)}
  </g>) },
];

// ---------- SIGNS ----------
const signs: ObjDef[] = [
  { name: "warning-sign", cat: "signs", w: 130, draw: (p) => (<g>
    <Part id={p + "p"} d={rr(-10, -200, 20, 200, 6)} c="#9FA8C8" />
    <Part id={p + "s"} d="M0 -440 L 140 -190 Q 146 -176 130 -176 L -130 -176 Q -146 -176 -140 -190 Z" c="#FFD23F" />
    <rect x={-12} y={-380} width={24} height={110} rx={12} fill="#2A2A3A" /><circle cx={0} cy={-236} r={16} fill="#2A2A3A" />
  </g>) },
  { name: "stop-sign", cat: "signs", w: 120, draw: (p) => (<g>
    <Part id={p + "p"} d={rr(-10, -240, 20, 240, 6)} c="#9FA8C8" />
    <Part id={p + "s"} d="M-56 -450 L 56 -450 L 136 -370 L 136 -256 L 56 -176 L -56 -176 L -136 -256 L -136 -370 Z" c="#E23A4A" />
    <text x={0} y={-290} textAnchor="middle" fontFamily="Arial Black" fontSize={72} fill="#FFFFFF">STOP</text>
  </g>) },
  { name: "traffic-light", cat: "signs", w: 90, draw: (p, f) => (<g>
    <Part id={p + "p"} d={rr(-12, -200, 24, 200, 6)} c="#3A3F6A" /><Part id={p + "b"} d={rr(-70, -520, 140, 330, 30)} c="#2A2A3A" />
    {["#FF4D3D", "#FFD23F", "#2FE08A"].map((c, i) => { const on = Math.floor(f / 30) % 3 === i; return <g key={c}><circle cx={0} cy={-460 + i * 100} r={40} fill={c} opacity={on ? 1 : 0.25} />{on && <circle cx={0} cy={-460 + i * 100} r={64} fill={c} opacity={0.2} />}</g>; })}
  </g>) },
  { name: "map-pin", cat: "signs", w: 90, draw: (p, f) => (<g transform={`translate(0,${-Math.abs(Math.sin(f / 10)) * 16})`}>
    <Part id={p + "p"} d="M0 0 C -40 -80 -110 -150 -110 -230 A 110 110 0 0 1 110 -230 C 110 -150 40 -80 0 0 Z" c="#E23A4A" ang={50} />
    <circle cx={0} cy={-230} r={44} fill="#FFFFFF" /><Shine x={-50} y={-280} rx={14} ry={24} r={20} />
  </g>) },
  { name: "speech-bubble", cat: "signs", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d="M-170 -340 Q -170 -380 -130 -380 L 130 -380 Q 170 -380 170 -340 L 170 -160 Q 170 -120 130 -120 L -20 -120 L -80 -40 L -70 -120 L -130 -120 Q -170 -120 -170 -160 Z" c="#FFFFFF" />
    {[-80, 0, 80].map((x) => <circle key={x} cx={x} cy={-250} r={20} fill="#2A0F5A" />)}
  </g>) },
];

// ---------- SCIENCE ----------
const science: ObjDef[] = [
  { name: "atom", cat: "science", w: 150, draw: (p, f) => (<g transform="translate(0,-180)">
    {[0, 60, 120].map((a) => <ellipse key={a} cx={0} cy={0} rx={160} ry={52} fill="none" stroke="#3FC1C9" strokeWidth={8} transform={`rotate(${a})`} />)}
    {[0, 60, 120].map((a, i) => { const t = f / 10 + i * 2; return <circle key={i} cx={Math.cos(t) * 160} cy={Math.sin(t) * 52} r={14} fill="#FFE066" transform={`rotate(${a})`} />; })}
    <Part id={p + "n"} d={circ(0, 0, 40)} c="#FF4D6D" />
  </g>) },
  { name: "dna-helix", cat: "science", w: 100, draw: (_, f) => (<g>
    {Array.from({ length: 14 }, (_, i) => { const y = -20 - i * 30, ph = i * 0.6 + f / 12, x = Math.sin(ph) * 70; return (
      <g key={i}><Line d={`M${-x} ${y} H ${x}`} c={i % 2 ? "#FFD23F" : "#FF7A9A"} w={6} /><circle cx={x} cy={y} r={12} fill="#3FC1C9" /><circle cx={-x} cy={y} r={12} fill="#7A5AD8" /></g>); })}
  </g>) },
  { name: "magnet", cat: "science", w: 120, draw: (p) => (<g>
    <path d="M-130 -360 L -130 -150 A 130 130 0 0 0 130 -150 L 130 -360 L 60 -360 L 60 -150 A 60 60 0 0 1 -60 -150 L -60 -360 Z" fill="#E23A4A" />
    <Part id={p + "a"} d={rr(-130, -380, 70, 70, 6)} c="#D6DCEA" /><Part id={p + "b"} d={rr(60, -380, 70, 70, 6)} c="#D6DCEA" />
    <Shine x={-100} y={-200} rx={8} ry={60} r={0} o={0.4} />
  </g>) },
  { name: "solar-panel", cat: "science", w: 200, draw: (p) => (<g>
    <Line d="M0 0 V -150" c="#9FA8C8" w={14} />
    <g transform="translate(0,-170) skewX(-20)"><Part id={p + "p"} d={rr(-200, -150, 400, 160, 10)} c="#2A4A9A" />
      {[-100, 0, 100].map((x) => <Line key={x} d={`M${x} -150 V 10`} c="#7FB8FF" w={3} o={0.7} />)}<Line d="M-200 -70 H 200" c="#7FB8FF" w={3} o={0.7} /></g>
    <Shine x={-60} y={-280} rx={80} ry={10} r={-8} o={0.25} />
  </g>) },
  { name: "wind-turbine", cat: "science", w: 120, draw: (p, f) => (<g>
    <Part id={p + "t"} d="M-16 0 L -8 -520 L 8 -520 L 16 0 Z" c="#F4F6FF" />
    <g transform={`translate(0,-530) rotate(${f * 3})`}>{[0, 120, 240].map((a) => <g key={a} transform={`rotate(${a})`}><Part id={p + "b" + a} d="M-10 0 Q -20 -150 0 -270 Q 20 -150 10 0 Z" c="#E8EEF8" /></g>)}</g>
    <Part id={p + "h"} d={circ(0, -530, 22)} c="#B4BCD6" />
  </g>) },
];

export const OBJECTS2: ObjDef[] = [...office, ...kitchen, ...vehicles, ...weather, ...buildings, ...sports, ...signs, ...science];
