// Object library v1. Every object: origin = bottom centre, ~300 px tall at s=1, drawn with the shared Part kit
// (gradient + rim + shine + contact shadow), so the whole library shares one house style (STYLING §3, §8).
import React from "react";

import { circ, ell, Line, Part, rr, Shine } from "./objkit";
import { OBJECTS2 } from "./objects2";
import { OBJECTS3 } from "./objects3";

type Draw = (p: string, f: number) => React.ReactNode;
export type ObjDef = { name: string; cat: string; w: number; draw: Draw };

// ---------- LAB ----------
const lab: ObjDef[] = [
  { name: "microscope", cat: "lab", w: 220, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-130, -40, 260, 40, 16)} c="#B5802A" />
    <Part id={p + "a"} d="M50 -40 C 100 -150 90 -250 20 -320 L 0 -300 C 60 -240 66 -150 20 -40 Z" c="#D9A23F" />
    <Part id={p + "s"} d={rr(-100, -150, 160, 22, 8)} c="#2A2F5A" />
    <g transform="rotate(-28,-20,-300)"><Part id={p + "t"} d={rr(-70, -440, 90, 240, 34)} c="#D9A23F" /><Part id={p + "e"} d={rr(-56, -490, 62, 60, 18)} c="#2A2F5A" /><Part id={p + "o"} d={rr(-62, -210, 74, 50, 14)} c="#2A2F5A" /></g>
    <Part id={p + "k"} d={circ(64, -190, 26)} c="#B5802A" /><Shine x={-60} y={-30} rx={40} ry={6} r={0} o={0.4} />
  </g>) },
  { name: "beaker", cat: "lab", w: 120, draw: (p, f) => (<g>
    <path d="M-80 -260 L -84 -250 L -70 -250 L -70 -20 Q -70 0 -50 0 L 50 0 Q 70 0 70 -20 L 70 -250 L 84 -250 L 80 -260 Z" fill="#CFE8FF" opacity={0.28} />
    <Part id={p + "l"} d={`M-66 ${-120 + Math.sin(f / 10) * 3} Q 0 ${-130 + Math.sin(f / 8) * 4} 66 -120 L 66 -20 Q 66 -4 50 -4 L -50 -4 Q -66 -4 -66 -20 Z`} c="#3FE0B0" rim={false} />
    <Line d="M-80 -260 L -84 -250 L -70 -250 L -70 -20 Q -70 0 -50 0 L 50 0 Q 70 0 70 -20 L 70 -250 L 84 -250 L 80 -260" c="#E8F4FF" w={5} o={0.8} />
    {[-200, -160, -80].map((y) => <Line key={y} d={`M30 ${y} H 60`} c="#E8F4FF" w={3} o={0.7} />)}
    <Shine x={-46} y={-170} rx={10} ry={60} r={0} o={0.45} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-20 + i * 20} cy={-60 - ((f + i * 20) % 50)} r={6} fill="#FFFFFF" opacity={0.6} />)}
  </g>) },
  { name: "flask", cat: "lab", w: 130, draw: (p, f) => (<g>
    <path d="M-24 -280 L -24 -180 L -100 -20 Q -108 0 -86 0 L 86 0 Q 108 0 100 -20 L 24 -180 L 24 -280 Z" fill="#CFE8FF" opacity={0.28} />
    <Part id={p + "l"} d="M-62 -100 L 62 -100 L 96 -24 Q 100 -6 84 -6 L -84 -6 Q -100 -6 -96 -24 Z" c="#FF7A9A" rim={false} />
    <Line d="M-24 -280 L -24 -180 L -100 -20 Q -108 0 -86 0 L 86 0 Q 108 0 100 -20 L 24 -180 L 24 -280" c="#E8F4FF" w={5} o={0.8} />
    <Part id={p + "c"} d={rr(-30, -300, 60, 26, 8)} c="#B48CFF" /><Shine x={-50} y={-70} rx={8} ry={34} r={25} o={0.45} />
    <circle cx={10} cy={-60 - (f % 40)} r={7} fill="#FFFFFF" opacity={0.6} />
  </g>) },
  { name: "test-tube-rack", cat: "lab", w: 200, draw: (p) => (<g>
    <Part id={p + "r"} d={rr(-160, -40, 320, 40, 10)} c="#8A5A3A" /><Part id={p + "t"} d={rr(-160, -150, 320, 26, 8)} c="#A8724A" />
    {[-110, -40, 30, 100].map((x, i) => (<g key={x}>
      <path d={`M${x - 16} -230 V -50 Q ${x - 16} -34 ${x} -34 Q ${x + 16} -34 ${x + 16} -50 V -230 Z`} fill="#CFE8FF" opacity={0.35} />
      <Part id={p + "l" + i} d={`M${x - 14} ${-120 + i * 12} H ${x + 14} V -50 Q ${x + 14} -36 ${x} -36 Q ${x - 14} -36 ${x - 14} -50 Z`} c={["#3FE0B0", "#FF7A9A", "#FFD23F", "#7FB8FF"][i]} rim={false} />
      <Line d={`M${x - 16} -230 V -50 Q ${x - 16} -34 ${x} -34 Q ${x + 16} -34 ${x + 16} -50 V -230`} c="#E8F4FF" w={4} o={0.8} />
    </g>))}
    {[-150, 150].map((x) => <Part key={x} id={p + "p" + x} d={rr(x - 10, -150, 20, 120, 6)} c="#8A5A3A" />)}
  </g>) },
  { name: "desk-thermostat", cat: "lab", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-120, -60, 240, 60, 20)} c="#2A2F5A" />
    <Part id={p + "c"} d={circ(0, -170, 120)} c="#D9A23F" /><Part id={p + "f"} d={circ(0, -170, 100)} c="#F4EEE2" />
    {Array.from({ length: 11 }, (_, i) => <rect key={i} x={-3} y={-262} width={6} height={i % 5 === 0 ? 22 : 12} fill="#2A0F5A" transform={`rotate(${-120 + i * 24},0,-170)`} />)}
    <rect x={-5} y={-250} width={10} height={86} rx={5} fill="#FF4D3D" transform="rotate(40,0,-170)" /><circle cx={0} cy={-170} r={16} fill="#2A0F5A" />
    <Shine x={-50} y={-230} rx={30} ry={14} />
  </g>) },
  { name: "monitor", cat: "lab", w: 220, draw: (p, f) => (<g>
    <Part id={p + "s"} d="M-50 -20 L 50 -20 L 30 -90 L -30 -90 Z" c="#3A3F6A" /><Part id={p + "b"} d={rr(-110, -24, 220, 24, 10)} c="#2A2F5A" />
    <Part id={p + "f"} d={rr(-200, -340, 400, 260, 22)} c="#2A2F5A" />
    <rect x={-182} y={-322} width={364} height={224} rx={12} fill="#0B2A3A" />
    <Line d={`M-160 -160 ${Array.from({ length: 9 }, (_, i) => `L ${-160 + i * 40} ${-160 - Math.sin(i + f / 6) * 50 - i * 6}`).join(" ")}`} c="#3FE0B0" w={6} />
    {[-140, -80, -20, 40, 100].map((x, i) => <rect key={x} x={x} y={-120 - (i + 1) * 12} width={30} height={(i + 1) * 12} fill="#FFD23F" opacity={0.7} />)}
    <Shine x={-120} y={-300} rx={60} ry={10} r={0} o={0.15} />
  </g>) },
  { name: "desk-lamp", cat: "lab", w: 140, draw: (p) => (<g>
    <Part id={p + "b"} d={ell(0, -16, 100, 18)} c="#2A2F5A" />
    <Line d="M0 -20 L -40 -170 L 50 -260" c="#3A3F6A" w={16} /><circle cx={-40} cy={-170} r={14} fill="#D9A23F" />
    <g transform="rotate(30,50,-260)"><Part id={p + "h"} d="M10 -290 L 110 -290 L 140 -220 L -20 -220 Z" c="#D9A23F" /></g>
    <ellipse cx={95} cy={-188} rx={60} ry={14} fill="#FFE9A8" opacity={0.9} />
  </g>) },
  { name: "petri-dish", cat: "lab", w: 150, draw: (p) => (<g>
    <Part id={p + "d"} d={ell(0, -30, 150, 40)} c="#CFE8FF" />
    <Part id={p + "a"} d={ell(0, -36, 130, 30)} c="#FFE6A8" rim={false} />
    {[[-50, -40, 18, "#7BC93A"], [30, -30, 14, "#FF7A9A"], [60, -44, 10, "#7BC93A"], [-10, -26, 8, "#B48CFF"]].map(([x, y, r, c], i) => <Part key={i} id={p + "c" + i} d={circ(x as number, y as number, r as number)} c={c as string} rim={false} />)}
    <Shine x={-80} y={-50} rx={40} ry={8} r={0} o={0.5} />
  </g>) },
  { name: "magnifier", cat: "lab", w: 120, draw: (p) => (<g transform="rotate(-30,0,-150)">
    <Part id={p + "h"} d={rr(-18, -150, 36, 150, 18)} c="#8A2A4A" />
    <Part id={p + "r"} d={circ(0, -250, 110)} c="#D9A23F" /><circle cx={0} cy={-250} r={90} fill="#CFE8FF" opacity={0.45} />
    <Shine x={-30} y={-290} rx={34} ry={14} />
  </g>) },
  { name: "clipboard", cat: "lab", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-110, -320, 220, 320, 18)} c="#A8724A" /><Part id={p + "p"} d={rr(-90, -290, 180, 270, 6)} c="#F4EEE2" rim={false} />
    <Part id={p + "c"} d={rr(-50, -340, 100, 46, 12)} c="#9FA8C8" />
    {[-240, -200, -160, -120, -80].map((y, i) => <Line key={y} d={`M-66 ${y} H ${i % 2 ? 30 : 60}`} c="#9FA8C8" w={6} />)}
    <Line d="M-70 -54 l 16 16 l 30 -34" c="#2FE08A" w={8} />
  </g>) },
];

// ---------- HOME ----------
const home: ObjDef[] = [
  { name: "armchair", cat: "home", w: 230, draw: (p) => (<g>
    {[-150, 130].map((x) => <Part key={x} id={p + "l" + x} d={rr(x, -40, 20, 40, 6)} c="#3A2A2A" />)}
    <Part id={p + "b"} d={rr(-150, -340, 300, 220, 60)} c="#C2384A" /><Part id={p + "s"} d={rr(-170, -150, 340, 110, 40)} c="#A82E40" />
    <Part id={p + "a1"} d={rr(-200, -230, 70, 190, 34)} c="#B8323F" /><Part id={p + "a2"} d={rr(130, -230, 70, 190, 34)} c="#9A2A38" />
    <Line d="M-80 -260 v 70 M0 -270 v 80 M80 -260 v 70" c="#8A2232" w={5} o={0.7} />
  </g>) },
  { name: "side-table", cat: "home", w: 150, draw: (p) => (<g>
    <Part id={p + "t"} d={rr(-130, -200, 260, 30, 12)} c="#A8724A" />
    {[-100, 80].map((x) => <Part key={x} id={p + "l" + x} d={`M${x} -170 L ${x + 20} -170 L ${x + 14 + (x < 0 ? -10 : 10)} 0 L ${x + 6 + (x < 0 ? -10 : 10)} 0 Z`} c="#8A5A3A" />)}
    <Part id={p + "d"} d={rr(-100, -165, 200, 60, 8)} c="#94603E" /><circle cx={0} cy={-135} r={8} fill="#D9A23F" />
  </g>) },
  { name: "mug", cat: "home", w: 90, draw: (p, f) => (<g>
    <Line d="M70 -140 Q 130 -130 120 -70 Q 110 -30 70 -40" c="#2A8A9A" w={20} />
    <Part id={p + "m"} d="M-80 -180 L 80 -180 L 74 -20 Q 70 0 50 0 L -50 0 Q -70 0 -74 -20 Z" c="#3FC1C9" />
    <Part id={p + "c"} d={ell(0, -180, 80, 16)} c="#5A3A26" rim={false} />
    {[0, 1, 2].map((i) => <Line key={i} d={`M${-30 + i * 30} -210 q 14 -20 0 -40 q -14 -20 0 -40`} c="#FFFFFF" w={6} o={0.3 + 0.2 * Math.sin(f / 8 + i)} />)}
    <Shine x={-50} y={-110} rx={10} ry={44} r={0} o={0.35} />
  </g>) },
  { name: "book-stack", cat: "home", w: 170, draw: (p) => (<g>
    {[["#2A3E7A", -150, 0, 60], ["#C2384A", -130, -60, 50], ["#2E8A5A", -160, -110, 56], ["#E0A83A", -120, -166, 44]].map(([c, x, y, h], i) => (
      <g key={i}><Part id={p + "b" + i} d={rr(x as number, (y as number) - (h as number), 280 - i * 20, h as number, 8)} c={c as string} />
        <rect x={(x as number) + 240 - i * 20} y={(y as number) - (h as number) + 6} width={30} height={(h as number) - 12} fill="#F4EEE2" />
        <Line d={`M${(x as number) + 30} ${(y as number) - (h as number) / 2} H ${(x as number) + 140}`} c="#D9A23F" w={5} /></g>
    ))}
  </g>) },
  { name: "wall-clock", cat: "home", w: 150, draw: (p, f) => (<g>
    <Part id={p + "r"} d={circ(0, -150, 150)} c="#2A2F5A" /><Part id={p + "f"} d={circ(0, -150, 128)} c="#F4EEE2" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-270} width={8} height={i % 3 === 0 ? 24 : 12} fill="#2A0F5A" transform={`rotate(${i * 30},0,-150)`} />)}
    <rect x={-6} y={-230} width={12} height={84} rx={6} fill="#2A0F5A" transform={`rotate(${f * 0.5},0,-150)`} />
    <rect x={-3} y={-256} width={6} height={110} rx={3} fill="#FF4D3D" transform={`rotate(${f * 6},0,-150)`} />
    <circle cx={0} cy={-150} r={12} fill="#D9A23F" /><Shine x={-60} y={-220} rx={40} ry={16} o={0.3} />
  </g>) },
  { name: "houseplant", cat: "home", w: 140, draw: (p, f) => (<g>
    {[-60, -20, 20, 60, 0].map((a, i) => (
      <g key={i} transform={`rotate(${a + Math.sin(f / 30 + i) * 3},0,-140)`}><Part id={p + "l" + i} d="M0 -140 C -50 -200 -40 -300 0 -360 C 40 -300 50 -200 0 -140 Z" c={i % 2 ? "#2E8A5A" : "#3FAE6A"} /><Line d="M0 -150 V -340" c="#8FE0A0" w={3} o={0.6} /></g>
    ))}
    <Part id={p + "p"} d="M-90 -150 L 90 -150 L 70 0 L -70 0 Z" c="#C86A3A" /><Part id={p + "lip"} d={rr(-100, -170, 200, 30, 10)} c="#D87A4A" />
  </g>) },
  { name: "smartphone", cat: "home", w: 80, draw: (p) => (<g>
    <Part id={p + "c"} d={rr(-80, -320, 160, 320, 26)} c="#1B1240" />
    <rect x={-68} y={-300} width={136} height={276} rx={16} fill="#2A4A8A" />
    {[-260, -200, -140].map((y, i) => <g key={y}><rect x={-56} y={y} width={112} height={44} rx={12} fill="#FFFFFF" opacity={0.9} /><circle cx={-36} cy={y + 22} r={12} fill={["#2ED3C6", "#FF7A9A", "#FFD23F"][i]} /></g>)}
    <rect x={-24} y={-316} width={48} height={10} rx={5} fill="#000" /><Shine x={-40} y={-200} rx={8} ry={80} r={10} o={0.12} />
  </g>) },
  { name: "laptop", cat: "home", w: 230, draw: (p, f) => (<g>
    <Part id={p + "s"} d="M-180 -250 L 180 -250 L 180 -40 L -180 -40 Z" c="#3A3F6A" /><rect x={-164} y={-236} width={328} height={182} rx={8} fill="#0B2A3A" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-140} y={-210 + i * 36} width={i % 2 ? 180 : 250} height={14} rx={7} fill="#3FE0B0" opacity={0.6 + 0.3 * Math.sin(f / 10 + i)} />)}
    <Part id={p + "b"} d="M-210 -40 L 210 -40 L 230 -8 Q 230 0 220 0 L -220 0 Q -230 0 -230 -8 Z" c="#9FA8C8" />
  </g>) },
  { name: "door", cat: "home", w: 150, draw: (p) => (<g>
    <Part id={p + "f"} d={rr(-130, -520, 260, 520, 8)} c="#5A3A26" /><Part id={p + "d"} d={rr(-110, -500, 220, 500, 6)} c="#A8724A" />
    {[-460, -240].map((y) => <Part key={y} id={p + "p" + y} d={rr(-80, y, 160, 180, 8)} c="#94603E" />)}
    <Part id={p + "k"} d={circ(80, -250, 16)} c="#D9A23F" />
  </g>) },
  { name: "floor-lamp", cat: "home", w: 110, draw: (p) => (<g>
    <Part id={p + "b"} d={ell(0, -14, 80, 16)} c="#2A2F5A" /><Part id={p + "p"} d={rr(-8, -470, 16, 460, 8)} c="#D9A23F" />
    <Part id={p + "s"} d="M-90 -470 L 90 -470 L 60 -580 L -60 -580 Z" c="#F4E2B8" /><ellipse cx={0} cy={-470} rx={90} ry={14} fill="#FFE9A8" opacity={0.9} />
  </g>) },
];

// ---------- NATURE ----------
const blob = (p: string, cx: number, cy: number, r: number, c: string, i: number) => <Part key={i} id={p + "k" + i} d={circ(cx, cy, r)} c={c} ang={55} />;
const nature: ObjDef[] = [
  { name: "bush-round", cat: "nature", w: 190, draw: (p) => (<g>
    {[[-110, -90, 90], [0, -150, 120], [110, -90, 90], [-50, -70, 80], [60, -60, 80]].map(([x, y, r], i) => blob(p, x, y, r, i % 2 ? "#2E8A5A" : "#3FAE6A", i))}
    {[[-40, -220], [60, -190], [-120, -140]].map(([x, y], i) => <Shine key={i} x={x} y={y} rx={26} ry={10} o={0.25} />)}
  </g>) },
  { name: "bush-flowering", cat: "nature", w: 190, draw: (p) => (<g>
    {[[-100, -90, 90], [10, -140, 110], [110, -80, 84]].map(([x, y, r], i) => blob(p, x, y, r, "#2E7A5A", i))}
    {[[-80, -150], [0, -220], [70, -170], [120, -110], [-130, -90], [30, -100], [-30, -60]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x},${y})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-12} rx={8} ry={13} fill="#FF9EB0" transform={`rotate(${a})`} />)}<circle r={7} fill="#FFD23F" /></g>
    ))}
  </g>) },
  { name: "pine", cat: "nature", w: 150, draw: (p) => (<g>
    <Part id={p + "t"} d={rr(-22, -90, 44, 90, 10)} c="#6A4228" />
    {[[0, 170, -90], [0, 140, -200], [0, 105, -300]].map(([x, w, y], i) => <Part key={i} id={p + "l" + i} d={`M${-w} ${y} L 0 ${y - 190} L ${w} ${y} Q 0 ${y + 24} ${-w} ${y} Z`} c={i % 2 ? "#1E6B4A" : "#2A8A5A"} ang={50} />)}
  </g>) },
  { name: "oak", cat: "nature", w: 200, draw: (p) => (<g>
    <Part id={p + "t"} d="M-30 0 Q -26 -120 -40 -200 L 40 -200 Q 26 -120 30 0 Z" c="#7A4A2A" /><Line d="M0 -180 L -50 -240 M10 -190 L 60 -250" c="#6A3E22" w={16} />
    {[[-110, -280, 100], [0, -350, 130], [110, -280, 100], [-60, -230, 90], [70, -220, 90]].map(([x, y, r], i) => blob(p, x, y, r, i % 2 ? "#3A9A4A" : "#4AB25A", i))}
  </g>) },
  { name: "palm", cat: "nature", w: 160, draw: (p, f) => (<g>
    <Part id={p + "t"} d="M-16 0 Q -40 -200 10 -420 L 34 -416 Q -10 -200 18 0 Z" c="#A8723A" />
    {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((t) => { const u = 1 - t; const cx = u * u * 1 + 2 * u * t * -25 + t * t * 22; const cy = 2 * u * t * -200 + t * t * -418; const hw = 17 * u + 12 * t; return <Line key={t} d={`M${cx - hw} ${cy + 4} Q ${cx} ${cy + 10} ${cx + hw} ${cy + 4}`} c="#7A4E22" w={5} />; })}
    {[-150, -100, -40, 30, 90, 140].map((a, i) => (
      <g key={i} transform={`rotate(${a + Math.sin(f / 25 + i) * 3},20,-420)`}><Part id={p + "f" + i} d="M20 -420 Q 60 -460 150 -440 Q 90 -420 20 -410 Z" c={i % 2 ? "#2E8A5A" : "#3FAE6A"} /></g>
    ))}
  </g>) },
  { name: "rocks", cat: "nature", w: 200, draw: (p) => (<g>
    <Part id={p + "a"} d="M-170 0 L -150 -90 L -80 -130 L -20 -90 L 0 0 Z" c="#7A7E9A" ang={60} />
    <Part id={p + "b"} d="M-40 0 L -20 -150 L 60 -190 L 140 -120 L 170 0 Z" c="#8A8EAA" ang={60} />
    <Part id={p + "c"} d="M120 0 L 140 -50 L 190 -60 L 210 0 Z" c="#6A6E8A" ang={60} />
    <Line d="M20 -140 L 50 -100 L 40 -60" c="#5A5E7A" w={4} /><Shine x={30} y={-160} rx={30} ry={8} o={0.3} />
  </g>) },
  { name: "mushroom", cat: "nature", w: 110, draw: (p) => (<g>
    <Part id={p + "s"} d="M-34 0 Q -40 -100 -26 -150 L 26 -150 Q 40 -100 34 0 Z" c="#F4EEE2" />
    <Part id={p + "c"} d="M-130 -140 Q -120 -290 0 -300 Q 120 -290 130 -140 Q 0 -110 -130 -140 Z" c="#E23A4A" ang={50} />
    {[[-60, -220, 20], [30, -250, 16], [70, -180, 14], [-20, -170, 12]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.8} fill="#FFF4E2" />)}
  </g>) },
  { name: "grass-tuft", cat: "nature", w: 120, draw: (p, f) => (<g>
    {Array.from({ length: 9 }, (_, i) => { const a = -50 + i * 12 + Math.sin(f / 15 + i) * 4; return <g key={i} transform={`rotate(${a},0,0)`}><Part id={p + "g" + i} d="M-10 0 Q -14 -90 0 -170 Q 14 -90 10 0 Z" c={i % 2 ? "#3FAE6A" : "#5AC27A"} rim={false} /></g>; })}
  </g>) },
  { name: "flower", cat: "nature", w: 80, draw: (p, f) => (<g>
    <Line d={`M0 0 Q ${Math.sin(f / 20) * 10} -120 0 -220`} c="#2E8A5A" w={10} />
    <Part id={p + "lf"} d="M0 -90 Q 60 -130 90 -100 Q 50 -70 0 -90 Z" c="#3FAE6A" />
    <g transform={`translate(${Math.sin(f / 20) * 8},-240)`}>{[0, 60, 120, 180, 240, 300].map((a, i) => <g key={a} transform={`rotate(${a})`}><Part id={p + "p" + i} d={ell(0, -40, 22, 36)} c="#FF7AB8" /></g>)}<Part id={p + "c"} d={circ(0, 0, 24)} c="#FFD23F" /></g>
  </g>) },
  { name: "log", cat: "nature", w: 210, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-200, -110, 360, 110, 55)} c="#7A4A2A" ang={90} />
    <Part id={p + "e"} d={ell(160, -55, 46, 55)} c="#D9A86A" /><ellipse cx={160} cy={-55} rx={28} ry={34} fill="none" stroke="#A8783A" strokeWidth={5} /><ellipse cx={160} cy={-55} rx={12} ry={14} fill="none" stroke="#A8783A" strokeWidth={4} />
    {[-160, -90, -10, 60].map((x) => <Line key={x} d={`M${x} -90 q 20 30 0 60`} c="#5A3418" w={4} o={0.7} />)}
  </g>) },
];

// ---------- SPACE / SCIENCE ----------
const space: ObjDef[] = [
  { name: "rocket", cat: "space", w: 120, draw: (p, f) => (<g>
    <path d={`M-40 -60 Q 0 ${40 + Math.sin(f) * 20} 40 -60 Z`} fill="#FFB347" /><path d={`M-22 -60 Q 0 ${0 + Math.sin(f * 1.3) * 14} 22 -60 Z`} fill="#FFF2A8" />
    {[-1, 1].map((sd) => <Part key={sd} id={p + "f" + sd} d={`M${sd * 50} -180 L ${sd * 110} -60 L ${sd * 50} -80 Z`} c="#E23A4A" />)}
    <Part id={p + "b"} d="M-56 -60 L -56 -260 Q -56 -380 0 -440 Q 56 -380 56 -260 L 56 -60 Z" c="#F4EEE2" />
    <Part id={p + "n"} d="M-44 -330 Q -30 -400 0 -440 Q 30 -400 44 -330 Z" c="#E23A4A" />
    <Part id={p + "w"} d={circ(0, -250, 30)} c="#2A4A8A" /><circle cx={0} cy={-250} r={20} fill="#7FE8FF" /><Shine x={-8} y={-258} rx={8} ry={5} />
  </g>) },
  { name: "ringed-planet", cat: "space", w: 210, draw: (p) => (<g transform="translate(0,-180)">
    <ellipse cx={0} cy={0} rx={230} ry={50} fill="none" stroke="#E8C89A" strokeWidth={22} opacity={0.6} transform="rotate(-15)" />
    <Part id={p + "p"} d={circ(0, 0, 140)} c="#E0A86A" ang={50} />
    {[-60, 0, 60].map((y, i) => <path key={y} d={`M-130 ${y} Q 0 ${y + 24} 130 ${y}`} stroke={i % 2 ? "#C88A4A" : "#F0C08A"} strokeWidth={18} fill="none" opacity={0.6} />)}
    <path d="M-230 0 A 230 50 0 0 0 230 0" fill="none" stroke="#F4DEB8" strokeWidth={22} transform="rotate(-15)" />
    <Shine x={-50} y={-70} rx={40} ry={18} o={0.3} />
  </g>) },
  { name: "satellite", cat: "space", w: 220, draw: (p) => (<g transform="translate(0,-160)">
    {[-1, 1].map((sd) => (<g key={sd}><Part id={p + "s" + sd} d={rr(sd < 0 ? -260 : 80, -50, 180, 100, 8)} c="#2A4A9A" />{[0, 1, 2].map((k) => <Line key={k} d={`M${(sd < 0 ? -260 : 80) + 60 * k + 60} -50 V 50`} c="#7FB8FF" w={3} o={0.7} />)}<Line d={`M${sd * 50} 0 H ${sd * 80}`} c="#9FA8C8" w={8} /></g>))}
    <Part id={p + "b"} d={rr(-50, -70, 100, 140, 16)} c="#D9A23F" /><Part id={p + "d"} d={ell(0, -110, 50, 20)} c="#F4EEE2" /><Line d="M0 -110 V -160" c="#9FA8C8" w={5} /><circle cx={0} cy={-164} r={8} fill="#FF4D6D" />
  </g>) },
  { name: "telescope", cat: "space", w: 150, draw: (p) => (<g>
    <Line d="M0 -160 L -90 0 M0 -160 L 90 0 M0 -160 L 0 0" c="#3A3F6A" w={12} />
    <g transform="rotate(-30,0,-170)"><Part id={p + "t"} d={rr(-180, -205, 330, 70, 30)} c="#2A3E7A" /><Part id={p + "e"} d={rr(140, -195, 60, 50, 14)} c="#D9A23F" /><Part id={p + "f"} d={rr(-200, -215, 40, 90, 14)} c="#D9A23F" /></g>
    <Part id={p + "m"} d={circ(0, -170, 18)} c="#D9A23F" />
  </g>) },
  { name: "globe", cat: "space", w: 140, draw: (p) => (<g>
    <Part id={p + "b"} d={ell(0, -14, 80, 16)} c="#8A5A3A" /><Part id={p + "s"} d={rr(-10, -70, 20, 60, 6)} c="#D9A23F" />
    <path d="M-120 -200 A 130 130 0 0 1 100 -310" stroke="#D9A23F" strokeWidth={12} fill="none" />
    <Part id={p + "g"} d={circ(0, -200, 110)} c="#3A7AC2" ang={50} />
    <path d="M-70 -260 q 40 -20 60 10 q 10 40 -30 50 q -40 10 -30 -60 Z M20 -180 q 50 -10 60 30 q -10 40 -50 30 q -20 -20 -10 -60 Z" fill="#3FAE6A" />
    <Shine x={-40} y={-260} rx={30} ry={14} o={0.35} />
  </g>) },
];

// ---------- FOOD ----------
const food: ObjDef[] = [
  { name: "apple", cat: "food", w: 110, draw: (p) => (<g>
    <Part id={p + "a"} d="M0 -170 C -70 -210 -140 -150 -120 -70 C -100 0 -40 10 0 -10 C 40 10 100 0 120 -70 C 140 -150 70 -210 0 -170 Z" c="#E23A4A" ang={50} />
    <Line d="M0 -170 Q -6 -210 10 -240" c="#6A3E22" w={10} /><Part id={p + "l"} d="M10 -220 Q 60 -250 90 -220 Q 50 -200 10 -220 Z" c="#3FAE6A" />
    <Shine x={-60} y={-130} rx={24} ry={12} o={0.5} />
  </g>) },
  { name: "banana", cat: "food", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d="M-160 -120 Q -100 20 60 -10 Q 140 -30 170 -120 Q 120 -60 40 -50 Q -80 -40 -140 -140 Z" c="#FFD23F" ang={60} />
    <Line d="M-150 -132 l -14 -16" c="#6A4A22" w={10} /><Line d="M-100 -70 Q 0 -20 120 -70" c="#E0A82A" w={5} o={0.7} />
  </g>) },
  { name: "burger", cat: "food", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -60, 300, 60, 28)} c="#E0A05A" /><Part id={p + "m"} d={rr(-160, -110, 320, 54, 26)} c="#6A3A22" />
    <path d="M-170 -110 Q -120 -90 -80 -112 Q -40 -90 0 -112 Q 40 -90 80 -112 Q 120 -90 170 -110 L 160 -126 L -160 -126 Z" fill="#3FAE6A" />
    <Part id={p + "c"} d="M-150 -126 L 150 -126 L 120 -100 L 60 -118 L 0 -96 L -60 -118 L -120 -100 Z" c="#FFC23A" rim={false} />
    <Part id={p + "t"} d="M-150 -126 Q -150 -260 0 -260 Q 150 -260 150 -126 Z" c="#E8A85A" ang={50} />
    {[[-60, -200], [10, -224], [70, -190], [-10, -170]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={8} ry={4} fill="#FFF4E2" />)}
  </g>) },
  { name: "sandwich", cat: "food", w: 170, draw: (p) => (<g>
    <Part id={p + "b"} d="M-160 0 L 0 -60 L 160 0 Z" c="#E8C08A" /><path d="M-160 -14 L 0 -78 L 160 -14 L 150 -6 L 0 -64 L -150 -6 Z" fill="#3FAE6A" />
    <path d="M-150 -28 L 0 -88 L 150 -28 L 144 -16 L 0 -76 L -144 -16 Z" fill="#E23A4A" /><Part id={p + "t"} d="M-160 -40 L 0 -110 L 160 -40 L 160 -28 L 0 -94 L -160 -28 Z" c="#F0CC92" />
  </g>) },
  { name: "carrot", cat: "food", w: 80, draw: (p) => (<g transform="rotate(20,0,-100)">
    <Part id={p + "c"} d="M-40 -220 Q 0 -240 40 -220 L 6 0 Q 0 10 -6 0 Z" c="#FF8A2A" ang={50} />
    {[-180, -140, -100, -60].map((y) => <Line key={y} d={`M-24 ${y} q 10 4 16 0`} c="#C8601A" w={4} />)}
    {[-30, 0, 30].map((a, i) => <g key={i} transform={`rotate(${a},0,-226)`}><Part id={p + "l" + i} d="M-8 -226 Q 0 -320 8 -226 Z" c="#3FAE6A" /></g>)}
  </g>) },
];

// ---------- TOOLS ----------
const tools: ObjDef[] = [
  { name: "wrench", cat: "tools", w: 100, draw: (p) => (<g transform="rotate(-35,0,-150)">
    <Part id={p + "h"} d={rr(-20, -220, 40, 220, 18)} c="#9FA8C8" />
    <Part id={p + "j"} d="M-56 -300 Q -60 -230 0 -220 Q 60 -230 56 -300 L 26 -300 L 26 -260 L -26 -260 L -26 -300 Z" c="#B8C0DA" />
    <Shine x={-8} y={-120} rx={5} ry={60} r={0} o={0.4} />
  </g>) },
  { name: "lightbulb", cat: "tools", w: 100, draw: (p, f) => (<g>
    <circle cx={0} cy={-200} r={150} fill="#FFE9A8" opacity={0.15 + 0.08 * Math.sin(f / 8)} />
    <Part id={p + "g"} d="M-90 -200 Q -90 -300 0 -300 Q 90 -300 90 -200 Q 90 -140 44 -100 L -44 -100 Q -90 -140 -90 -200 Z" c="#FFE066" ang={50} />
    <Line d="M-20 -110 L -14 -190 L 0 -170 L 14 -190 L 20 -110" c="#C88A1A" w={5} />
    <Part id={p + "b"} d={rr(-44, -100, 88, 70, 10)} c="#9FA8C8" />{[-82, -64, -46].map((y) => <Line key={y} d={`M-44 ${y} H 44`} c="#6A6E8A" w={4} />)}
    <Part id={p + "t"} d={rr(-20, -32, 40, 32, 10)} c="#2A2F5A" /><Shine x={-40} y={-240} rx={16} ry={30} r={20} o={0.6} />
  </g>) },
  { name: "battery", cat: "tools", w: 80, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-70, -280, 140, 280, 24)} c="#2A2F5A" /><Part id={p + "t"} d={rr(-30, -304, 60, 28, 8)} c="#9FA8C8" />
    {[0, 1, 2].map((i) => <Part key={i} id={p + "c" + i} d={rr(-50, -80 - i * 70, 100, 56, 10)} c="#2FE08A" rim={false} />)}
    <path d="M10 -260 L -16 -200 L 6 -200 L -10 -150 L 22 -214 L 0 -214 Z" fill="#FFD23F" />
  </g>) },
  { name: "hourglass", cat: "tools", w: 110, draw: (p, f) => (<g>
    {[0, -320].map((y) => <Part key={y} id={p + "e" + y} d={rr(-110, y - 30, 220, 30, 10)} c="#8A5A3A" />)}
    {[-90, 76].map((x) => <Part key={x} id={p + "p" + x} d={rr(x, -300, 14, 280, 6)} c="#A8724A" />)}
    <path d="M-70 -290 Q -70 -200 -8 -160 Q -70 -120 -70 -30 L 70 -30 Q 70 -120 8 -160 Q 70 -200 70 -290 Z" fill="#CFE8FF" opacity={0.35} />
    <Part id={p + "s1"} d={`M-50 ${-270 + (f % 120) * 0.6} L 50 ${-270 + (f % 120) * 0.6} L 0 -170 Z`} c="#F4CF7A" rim={false} />
    <Part id={p + "s2"} d={`M-60 -34 Q 0 ${-90 - (f % 120) * 0.4} 60 -34 Z`} c="#F4CF7A" rim={false} />
    <Line d="M0 -165 V -60" c="#F4CF7A" w={3} />
  </g>) },
  { name: "gear", cat: "tools", w: 150, draw: (p, f) => (<g transform={`translate(0,-160) rotate(${f * 0.8})`}>
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><Part id={p + "t" + i} d={rr(-22, -170, 44, 50, 8)} c="#D9A23F" rim={false} /></g>)}
    <Part id={p + "g"} d={circ(0, 0, 130)} c="#D9A23F" ang={50} /><circle r={50} fill="#0E1630" /><circle r={50} fill="none" stroke="#A8721F" strokeWidth={8} />
  </g>) },
];

// ---------- MEDICAL ----------
const medical: ObjDef[] = [
  { name: "pill-bottle", cat: "medical", w: 90, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-70, -230, 140, 230, 20)} c="#E8822A" /><Part id={p + "l"} d={rr(-70, -180, 140, 110, 6)} c="#F4EEE2" rim={false} />
    {[-150, -126, -102].map((y, i) => <Line key={y} d={`M-50 ${y} H ${i === 1 ? 20 : 46}`} c="#9FA8C8" w={6} />)}
    <Part id={p + "c"} d={rr(-80, -280, 160, 54, 12)} c="#F4EEE2" />{[-50, -20, 10, 40].map((x) => <Line key={x} d={`M${x} -272 V -234`} c="#C8C2D8" w={4} />)}
  </g>) },
  { name: "thermometer", cat: "medical", w: 70, draw: (p) => (<g transform="rotate(20,0,-150)">
    <Part id={p + "b"} d={rr(-24, -320, 48, 290, 24)} c="#F4EEE2" /><Part id={p + "k"} d={circ(0, -30, 40)} c="#FF4D3D" />
    <rect x={-8} y={-200} width={16} height={170} rx={8} fill="#FF4D3D" />{[-290, -260, -230, -200, -170].map((y) => <Line key={y} d={`M12 ${y} H 22`} c="#2A2F5A" w={4} />)}
    <Shine x={-10} y={-220} rx={4} ry={60} r={0} o={0.6} />
  </g>) },
  { name: "stethoscope", cat: "medical", w: 130, draw: (p) => (<g>
    <Line d="M-60 -300 Q -90 -200 -40 -140 Q 0 -100 40 -140 Q 90 -200 60 -300" c="#2A2F5A" w={14} />
    <Line d="M0 -110 Q 10 -40 80 -40" c="#2A2F5A" w={14} />
    {[-60, 60].map((x) => <Part key={x} id={p + "e" + x} d={circ(x, -306, 14)} c="#9FA8C8" />)}
    <Part id={p + "c"} d={circ(110, -40, 40)} c="#B8C0DA" /><Part id={p + "d"} d={circ(110, -40, 26)} c="#F4EEE2" />
  </g>) },
  { name: "first-aid-kit", cat: "medical", w: 160, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -200, 300, 200, 26)} c="#E23A4A" /><Part id={p + "h"} d="M-50 -200 L -50 -250 Q -50 -270 -30 -270 L 30 -270 Q 50 -270 50 -250 L 50 -200 L 30 -200 L 30 -246 L -30 -246 L -30 -200 Z" c="#B82A3A" />
    <Part id={p + "x"} d="M-20 -160 H 20 V -120 H 60 V -80 H 20 V -40 H -20 V -80 H -60 V -120 H -20 Z" c="#FFFFFF" rim={false} />
  </g>) },
  { name: "bandage", cat: "medical", w: 150, draw: (p) => (<g transform="rotate(-20,0,-80)">
    <Part id={p + "b"} d={rr(-160, -120, 320, 80, 40)} c="#E8B48A" /><Part id={p + "p"} d={rr(-50, -116, 100, 72, 10)} c="#F4E2D0" rim={false} />
    {[[-110, -90], [-90, -70], [90, -90], [110, -70], [-120, -70], [120, -90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#C88A64" />)}
  </g>) },
];

export const OBJECTS: ObjDef[] = [...lab, ...home, ...nature, ...space, ...food, ...tools, ...medical, ...OBJECTS2, ...OBJECTS3];
const BY = Object.fromEntries(OBJECTS.map((o) => [o.name, o]));

// Use in scenes: <Thing name="beaker" x={...} y={...} s={0.8} f={frame} />
export const Thing: React.FC<{ name: string; x: number; y: number; s?: number; f?: number; shadow?: boolean }> = ({ name, x, y, s = 1, f = 0, shadow = true }) => {
  const o = BY[name];
  if (!o) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {shadow && <ellipse cx={0} cy={4} rx={o.w * 0.9} ry={16} fill="#000" opacity={0.28} />}
      {o.draw(`o_${name}_${Math.round(x)}_${Math.round(y)}_`, f)}
    </g>
  );
};
