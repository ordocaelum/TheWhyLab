// Object library batch 3 (50): animals (props), furniture, electronics, clothing, music, money, school, nature extras.
import React from "react";
import { circ, ell, Line, Part, rr, Shine } from "./objkit";
import type { ObjDef } from "./objects";

// cute prop-animal eye: dark oval + 2 highlights (STYLING §5)
const Eye: React.FC<{ x: number; y: number; r?: number; blink?: number }> = ({ x, y, r = 12, blink = 1 }) => (
  <g transform={`translate(${x},${y}) scale(1,${blink})`}>
    <ellipse rx={r} ry={r * 1.15} fill="#1B1240" /><circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.38} fill="#FFFFFF" /><circle cx={r * 0.3} cy={r * 0.35} r={r * 0.15} fill="#FFFFFF" />
  </g>
);
const bl = (f: number, k = 0) => ((f + k) % 90 > 85 ? 0.1 : 1);

// ---------- ANIMALS (props) ----------
const animals: ObjDef[] = [
  { name: "cat", cat: "animals", w: 130, draw: (p, f) => (<g>
    <Line d={`M70 -40 Q 160 -60 ${150 + Math.sin(f / 10) * 14} -180`} c="#E8822A" w={22} />
    <Part id={p + "b"} d="M-80 0 Q -100 -140 0 -150 Q 100 -140 80 0 Z" c="#F0943A" />
    <Part id={p + "h"} d={circ(0, -200, 84)} c="#F0943A" ang={50} />
    {[-1, 1].map((sd) => <Part key={sd} id={p + "e" + sd} d={`M${sd * 34} -270 L ${sd * 70} -330 L ${sd * 82} -250 Z`} c="#E8822A" />)}
    <ellipse cx={0} cy={-170} rx={44} ry={30} fill="#FFF4E2" />
    <Eye x={-30} y={-210} blink={bl(f)} /><Eye x={30} y={-210} blink={bl(f)} />
    <path d="M-8 -184 L 8 -184 L 0 -174 Z" fill="#E8607A" /><Line d="M-40 -176 L -90 -184 M-40 -168 L -90 -164 M40 -176 L 90 -184 M40 -168 L 90 -164" c="#FFFFFF" w={3} o={0.8} />
    {[-60, -10, 40].map((x) => <Line key={x} d={`M${x} -120 q 10 20 0 40`} c="#C8602A" w={8} o={0.6} />)}
  </g>) },
  { name: "dog", cat: "animals", w: 140, draw: (p, f) => (<g>
    <Line d={`M80 -60 Q 140 -80 ${150} ${-130 + Math.sin(f / 4) * 20}`} c="#B07A4A" w={20} />
    <Part id={p + "b"} d="M-90 0 Q -110 -150 0 -160 Q 110 -150 90 0 Z" c="#C8945A" />
    <Part id={p + "h"} d={circ(0, -220, 90)} c="#C8945A" ang={50} />
    {[-1, 1].map((sd) => <Part key={sd} id={p + "e" + sd} d={`M${sd * 70} -280 Q ${sd * 130} -260 ${sd * 110} -170 Q ${sd * 80} -200 ${sd * 64} -250 Z`} c="#7A4A2A" />)}
    <ellipse cx={0} cy={-180} rx={50} ry={36} fill="#F4E2C8" /><Part id={p + "n"} d={ell(0, -200, 18, 13)} c="#2A1A1A" />
    <Eye x={-34} y={-236} blink={bl(f, 20)} /><Eye x={34} y={-236} blink={bl(f, 20)} />
    <path d="M-16 -170 Q 0 -150 16 -170 Q 10 -130 0 -128 Q -10 -130 -16 -170 Z" fill="#E8607A" />
  </g>) },
  { name: "bird", cat: "animals", w: 90, draw: (p, f) => (<g>
    <Line d="M-20 0 V -40 M20 0 V -40" c="#E0A83A" w={6} />
    <Part id={p + "b"} d={ell(0, -110, 90, 76)} c="#3FA8E0" ang={50} />
    <Part id={p + "w"} d={`M-20 -120 Q 60 ${-150 + Math.sin(f / 3) * 30} 100 -90 Q 40 -70 -20 -100 Z`} c="#2A7AC2" />
    <Part id={p + "bl"} d={ell(-10, -80, 50, 34)} c="#F4F6FF" rim={false} />
    <path d="M-86 -130 L -126 -118 L -86 -108 Z" fill="#FFC23A" /><Eye x={-50} y={-138} r={10} blink={bl(f, 40)} />
  </g>) },
  { name: "fish", cat: "animals", w: 140, draw: (p, f) => (<g transform={`translate(0,${-120 + Math.sin(f / 10) * 8})`}>
    <Part id={p + "t"} d={`M100 0 L 170 ${-60 + Math.sin(f / 4) * 10} L 170 ${60 + Math.sin(f / 4) * 10} Z`} c="#FF8A2A" />
    <Part id={p + "b"} d={ell(0, 0, 120, 74)} c="#FF8A2A" ang={50} />
    <Line d="M-20 -70 Q 10 0 -20 70 M30 -66 Q 60 0 30 66" c="#FFFFFF" w={14} o={0.85} />
    <Part id={p + "d"} d="M-30 -70 Q 10 -130 60 -66 Z" c="#E8702A" /><Eye x={-74} y={-14} r={12} blink={bl(f, 10)} />
    <circle cx={-170} cy={-30 - (f % 40)} r={10} fill="none" stroke="#CFE8FF" strokeWidth={3} />
  </g>) },
  { name: "rabbit", cat: "animals", w: 110, draw: (p, f) => (<g>
    <Part id={p + "b"} d="M-80 0 Q -100 -150 0 -160 Q 100 -150 80 0 Z" c="#E8E4F0" />
    {[-1, 1].map((sd) => <g key={sd} transform={`rotate(${sd * 8 + Math.sin(f / 20) * 3 * sd},${sd * 30},-260)`}><Part id={p + "e" + sd} d={ell(sd * 30, -340, 22, 80)} c="#E8E4F0" /><ellipse cx={sd * 30} cy={-336} rx={10} ry={60} fill="#FF9EB0" /></g>)}
    <Part id={p + "h"} d={circ(0, -210, 74)} c="#F4F0FA" ang={50} />
    <Eye x={-28} y={-220} blink={bl(f, 30)} /><Eye x={28} y={-220} blink={bl(f, 30)} />
    <path d="M-8 -196 L 8 -196 L 0 -186 Z" fill="#FF7A9A" /><circle cx={70} cy={-40} r={28} fill="#FFFFFF" />
  </g>) },
  { name: "owl", cat: "animals", w: 110, draw: (p, f) => (<g>
    <Part id={p + "b"} d="M-90 0 Q -110 -260 0 -270 Q 110 -260 90 0 Z" c="#8A5A3A" ang={50} />
    {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 40} -260 L ${sd * 80} -310 L ${sd * 90} -240 Z`} fill="#7A4A2A" />)}
    <Part id={p + "c"} d={ell(0, -90, 60, 80)} c="#E8C89A" rim={false} />
    {[-110, -80, -50].map((y) => <Line key={y} d={`M-30 ${y} q 15 10 30 0 q 15 10 30 0`} c="#B8946A" w={4} />)}
    {[-40, 40].map((x) => <g key={x}><circle cx={x} cy={-200} r={36} fill="#F4EEE2" /><Eye x={x} y={-200} r={18} blink={bl(f, 50)} /></g>)}
    <path d="M-10 -168 L 10 -168 L 0 -146 Z" fill="#FFC23A" />
  </g>) },
  { name: "butterfly", cat: "animals", w: 120, draw: (p, f) => { const fl = 0.6 + 0.4 * Math.abs(Math.cos(f / 4)); return (<g transform="translate(0,-160)">
    <g transform={`scale(${fl},1)`}>{[-1, 1].map((sd) => <g key={sd}><Part id={p + "u" + sd} d={`M0 -10 Q ${sd * 150} -140 ${sd * 140} -20 Q ${sd * 110} 20 0 0 Z`} c="#7A5AD8" /><Part id={p + "l" + sd} d={`M0 0 Q ${sd * 110} 20 ${sd * 90} 100 Q ${sd * 40} 110 0 10 Z`} c="#FF7AB8" /><circle cx={sd * 80} cy={-60} r={16} fill="#FFE066" /></g>)}</g>
    <Part id={p + "b"} d={rr(-10, -60, 20, 130, 10)} c="#2A2A3A" /><Line d="M-4 -60 Q -20 -100 -30 -110 M4 -60 Q 20 -100 30 -110" c="#2A2A3A" w={4} />
  </g>); } },
  { name: "snail", cat: "animals", w: 140, draw: (p, f) => (<g>
    <Part id={p + "b"} d={`M-150 0 Q -150 -60 -100 -60 L 100 -50 Q 150 -40 160 0 Z`} c="#C8D88A" />
    <Line d={`M-120 -60 L -140 ${-140 + Math.sin(f / 10) * 6} M-100 -60 L -96 ${-140 - Math.sin(f / 10) * 6}`} c="#B8C87A" w={8} />
    <circle cx={-140} cy={-144} r={9} fill="#1B1240" /><circle cx={-96} cy={-144} r={9} fill="#1B1240" />
    <Part id={p + "s"} d={circ(40, -130, 100)} c="#C86A3A" ang={50} />
    <path d="M40 -130 m -70 0 a 70 70 0 1 1 70 70 a 50 50 0 1 1 -40 -50 a 28 28 0 1 1 30 30" stroke="#8A3A1A" strokeWidth={8} fill="none" />
  </g>) },
];

// ---------- FURNITURE / DECOR ----------
const furniture: ObjDef[] = [
  { name: "sofa", cat: "furniture", w: 280, draw: (p) => (<g>
    {[-240, 220].map((x) => <Part key={x} id={p + "f" + x} d={rr(x, -30, 20, 30, 6)} c="#3A2A2A" />)}
    <Part id={p + "b"} d={rr(-250, -300, 500, 200, 50)} c="#2E6A9A" />
    {[-180, 0].map((x) => <Part key={x} id={p + "c" + x} d={rr(x - 10, -150, 190, 110, 30)} c="#3A7AB2" />)}
    {[-1, 1].map((sd) => <Part key={sd} id={p + "a" + sd} d={rr(sd < 0 ? -290 : 220, -220, 70, 190, 34)} c="#2A5E8A" />)}
    <Part id={p + "pl"} d={rr(-150, -250, 110, 90, 30)} c="#FFC23A" />
  </g>) },
  { name: "bookshelf", cat: "furniture", w: 180, draw: (p) => (<g>
    <Part id={p + "f"} d={rr(-170, -520, 340, 520, 10)} c="#7A4A2A" />
    {[-500, -340, -180].map((y, r) => <g key={y}><rect x={-150} y={y} width={300} height={140} fill="#4A2A1A" />
      {Array.from({ length: 7 }, (_, i) => <Part key={i} id={p + "b" + r + i} d={rr(-144 + i * 40, y + 140 - (90 + ((i * 37 + r * 13) % 40)), 34, 90 + ((i * 37 + r * 13) % 40), 4)} c={["#C2384A", "#2A3E7A", "#2E8A5A", "#E0A83A", "#7A4AA8", "#3FC1C9", "#E8743A"][(i + r) % 7]} rim={false} />)}</g>)}
  </g>) },
  { name: "rug", cat: "furniture", w: 230, draw: (p) => (<g>
    <Part id={p + "r"} d={ell(0, -40, 240, 50)} c="#C2384A" /><ellipse cx={0} cy={-40} rx={190} ry={36} fill="none" stroke="#FFC23A" strokeWidth={8} /><ellipse cx={0} cy={-40} rx={120} ry={22} fill="#9A2A38" />
    {Array.from({ length: 12 }, (_, i) => <Line key={i} d={`M${-220 + i * 40} -8 v 16`} c="#F4EEE2" w={4} />)}
  </g>) },
  { name: "picture-frame", cat: "furniture", w: 150, draw: (p) => (<g>
    <Part id={p + "f"} d={rr(-150, -300, 300, 260, 10)} c="#D9A23F" /><rect x={-126} y={-276} width={252} height={212} fill="#7FC8FF" />
    <path d="M-126 -64 L -40 -170 L 30 -100 L 70 -140 L 126 -64 Z" fill="#2E8A5A" /><circle cx={70} cy={-226} r={22} fill="#FFE066" />
  </g>) },
  { name: "bed", cat: "furniture", w: 300, draw: (p) => (<g>
    <Part id={p + "h"} d={rr(-300, -340, 60, 340, 20)} c="#5A3A26" /><Part id={p + "fr"} d={rr(-290, -140, 580, 110, 20)} c="#7A4A2A" />
    <Part id={p + "m"} d={rr(-270, -190, 540, 70, 26)} c="#F4F0FA" /><Part id={p + "pl"} d={rr(-240, -250, 160, 70, 34)} c="#FFFFFF" />
    <Part id={p + "bl"} d="M-60 -200 Q 100 -230 280 -196 L 280 -130 L -60 -130 Z" c="#3A7AB2" />
    {[-20, 80, 180].map((x) => <Line key={x} d={`M${x} -200 V -140`} c="#2A5E8A" w={5} o={0.6} />)}
  </g>) },
  { name: "vase", cat: "furniture", w: 90, draw: (p) => (<g>
    {[-30, 0, 30].map((x, i) => <g key={x}><Line d={`M0 -200 Q ${x} -280 ${x * 1.6} -360`} c="#2E8A5A" w={6} /><g transform={`translate(${x * 1.6},-370)`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-12} rx={9} ry={14} fill={["#FF7AB8", "#FFD23F", "#FF8A2A"][i]} transform={`rotate(${a})`} />)}<circle r={8} fill="#FFF4E2" /></g></g>)}
    <Part id={p + "v"} d="M-40 -220 Q -40 -180 -80 -130 Q -110 -40 -60 0 L 60 0 Q 110 -40 80 -130 Q 40 -180 40 -220 Z" c="#3FC1C9" ang={50} />
    <Shine x={-50} y={-90} rx={10} ry={30} r={10} />
  </g>) },
  { name: "window-curtains", cat: "furniture", w: 200, draw: (p, f) => (<g>
    <Part id={p + "w"} d={rr(-180, -460, 360, 400, 10)} c="#F4EEE2" /><rect x={-160} y={-440} width={320} height={360} fill="#7FC8FF" />
    <circle cx={80} cy={-360} r={36} fill="#FFE066" /><Line d="M0 -440 V -80 M-160 -260 H 160" c="#F4EEE2" w={12} />
    {[-1, 1].map((sd) => <Part key={sd} id={p + "c" + sd} d={`M${sd * 210} -480 L ${sd * 120} -480 Q ${sd * (110 + Math.sin(f / 20) * 6)} -280 ${sd * 150} -60 L ${sd * 210} -60 Z`} c="#C2384A" />)}
    <Part id={p + "r"} d={rr(-230, -500, 460, 20, 10)} c="#D9A23F" />
  </g>) },
];

// ---------- ELECTRONICS ----------
const electronics: ObjDef[] = [
  { name: "tv", cat: "electronics", w: 230, draw: (p, f) => (<g>
    <Line d="M-80 0 L -40 -50 M80 0 L 40 -50" c="#2A2A3A" w={12} />
    <Part id={p + "f"} d={rr(-230, -340, 460, 290, 20)} c="#1B1B2A" /><rect x={-210} y={-320} width={420} height={250} rx={10} fill="#2A4A8A" />
    <circle cx={-60} cy={-200} r={60} fill="#FFD23F" opacity={0.8} /><path d={`M-210 -70 L -80 -180 L 20 -110 L 110 -200 L 210 -70 Z`} fill="#2E8A5A" />
    <rect x={-210} y={-320} width={420} height={250} rx={10} fill="#FFFFFF" opacity={0.04 + 0.03 * Math.sin(f)} />
  </g>) },
  { name: "game-controller", cat: "electronics", w: 170, draw: (p) => (<g>
    <Part id={p + "b"} d="M-170 -120 Q -170 -200 -90 -200 L 90 -200 Q 170 -200 170 -120 Q 190 -10 130 -10 Q 90 -10 70 -60 L -70 -60 Q -90 -10 -130 -10 Q -190 -10 -170 -120 Z" c="#3A3F6A" />
    <path d="M-120 -150 H -80 V -190 H -60 V -150 H -20 V -130 H -60 V -90 H -80 V -130 H -120 Z" fill="#1B1B2A" />
    {[[90, -170, "#2FE08A"], [120, -140, "#FF4D6D"], [90, -110, "#3FA8E0"], [60, -140, "#FFD23F"]].map(([x, y, c], i) => <Part key={i} id={p + "k" + i} d={circ(x as number, y as number, 14)} c={c as string} />)}
  </g>) },
  { name: "camera", cat: "electronics", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -210, 300, 200, 26)} c="#2A2A3A" /><Part id={p + "t"} d={rr(-70, -250, 110, 50, 12)} c="#3A3A4A" />
    <Part id={p + "l"} d={circ(0, -110, 76)} c="#5A5E7A" /><circle cx={0} cy={-110} r={52} fill="#1B2A4A" /><Shine x={-20} y={-130} rx={16} ry={10} />
    <rect x={90} y={-190} width={40} height={24} rx={6} fill="#FFE9A8" /><circle cx={-110} cy={-230} r={14} fill="#FF4D6D" />
  </g>) },
  { name: "headphones", cat: "electronics", w: 140, draw: (p) => (<g>
    <path d="M-120 -120 Q -120 -320 0 -320 Q 120 -320 120 -120" stroke="#2A2A3A" strokeWidth={22} fill="none" />
    {[-1, 1].map((sd) => <g key={sd}><Part id={p + "c" + sd} d={rr(sd < 0 ? -160 : 90, -170, 70, 130, 30)} c="#E23A4A" /><Part id={p + "p" + sd} d={rr(sd < 0 ? -110 : 80, -160, 30, 110, 14)} c="#2A2A3A" /></g>)}
  </g>) },
  { name: "radio", cat: "electronics", w: 160, draw: (p) => (<g>
    <Line d="M100 -220 L 160 -340" c="#9FA8C8" w={6} />
    <Part id={p + "b"} d={rr(-170, -220, 340, 220, 30)} c="#C8945A" /><Part id={p + "s"} d={circ(-70, -110, 70)} c="#5A3A26" />
    {[-40, -10, 20].map((d) => <circle key={d} cx={-70} cy={-110} r={50 + d * 0.5} fill="none" stroke="#7A4A2A" strokeWidth={4} />)}
    <rect x={30} y={-180} width={110} height={40} rx={8} fill="#F4EEE2" /><Line d="M70 -180 V -140" c="#FF4D3D" w={4} />
    {[60, 110].map((x) => <Part key={x} id={p + "k" + x} d={circ(x, -80, 20)} c="#5A3A26" />)}
  </g>) },
  { name: "robot", cat: "electronics", w: 140, draw: (p, f) => (<g>
    {[-50, 50].map((x) => <Part key={x} id={p + "l" + x} d={rr(x - 22, -110, 44, 110, 12)} c="#9FA8C8" />)}
    <Part id={p + "b"} d={rr(-100, -300, 200, 200, 30)} c="#B8C0DA" /><rect x={-50} y={-250} width={100} height={60} rx={10} fill="#2A2F5A" />
    {[0, 1, 2].map((i) => <rect key={i} x={-40 + i * 30} y={-236} width={20} height={32} rx={4} fill={["#2FE08A", "#FFD23F", "#FF4D6D"][i]} opacity={(Math.floor(f / 8) + i) % 3 === 0 ? 1 : 0.35} />)}
    {[-1, 1].map((sd) => <Line key={sd} d={`M${sd * 100} -270 L ${sd * 150} ${-200 + Math.sin(f / 8 + sd) * 20}`} c="#9FA8C8" w={22} />)}
    <Part id={p + "h"} d={rr(-80, -440, 160, 130, 34)} c="#D6DCEA" /><Line d="M0 -440 V -490" c="#9FA8C8" w={6} /><circle cx={0} cy={-494} r={12} fill="#FF4D6D" opacity={0.5 + 0.5 * Math.sin(f / 5)} />
    {[-34, 34].map((x) => <g key={x}><circle cx={x} cy={-380} r={20} fill="#2A2F5A" /><circle cx={x} cy={-380} r={10} fill="#7FE8FF" /></g>)}
    <rect x={-30} y={-340} width={60} height={10} rx={5} fill="#2A2F5A" />
  </g>) },
  { name: "drone", cat: "electronics", w: 200, draw: (p, f) => (<g transform={`translate(0,${-160 + Math.sin(f / 8) * 10})`}>
    <Line d="M-160 -20 L 160 20 M-160 20 L 160 -20" c="#2A2A3A" w={14} />
    {[[-160, -20], [160, 20], [-160, 20], [160, -20]].map(([x, y], i) => <g key={i}><Part id={p + "m" + i} d={circ(x, y, 18)} c="#3A3A4A" /><ellipse cx={x} cy={y - 24} rx={70 * Math.abs(Math.cos(f * 0.8 + i))} ry={6} fill="#9FA8C8" opacity={0.7} /></g>)}
    <Part id={p + "b"} d={rr(-60, -40, 120, 70, 20)} c="#F4F6FF" /><Part id={p + "c"} d={circ(0, 40, 20)} c="#2A2A3A" /><circle cx={0} cy={40} r={9} fill="#3FA8E0" />
  </g>) },
];

// ---------- CLOTHING ----------
const clothing: ObjDef[] = [
  { name: "t-shirt", cat: "clothing", w: 160, draw: (p) => (<g>
    <Part id={p + "s"} d="M-60 -300 Q 0 -260 60 -300 L 170 -250 L 130 -170 L 90 -190 L 90 0 L -90 0 L -90 -190 L -130 -170 L -170 -250 Z" c="#E23A4A" />
    <Line d="M-60 -300 Q 0 -260 60 -300" c="#9A2A38" w={8} /><Part id={p + "lg"} d={circ(0, -160, 34)} c="#FFD23F" />
  </g>) },
  { name: "sneaker", cat: "clothing", w: 170, draw: (p) => (<g>
    <Part id={p + "s"} d={rr(-170, -40, 360, 40, 18)} c="#F4F6FF" />
    <Part id={p + "u"} d="M-160 -40 Q -170 -150 -80 -170 Q -20 -180 0 -140 Q 80 -110 170 -80 Q 190 -50 180 -40 Z" c="#3A7AC2" />
    {[-90, -60, -30].map((x) => <Line key={x} d={`M${x} -150 L ${x + 30} -120`} c="#F4F6FF" w={6} />)}
    <path d="M20 -120 Q 90 -70 160 -70" stroke="#F4F6FF" strokeWidth={10} fill="none" />
  </g>) },
  { name: "cap", cat: "clothing", w: 160, draw: (p) => (<g>
    <Part id={p + "v"} d="M20 -40 Q 120 -60 190 -20 Q 120 -10 20 -20 Z" c="#2A3E7A" />
    <Part id={p + "c"} d="M-150 -30 Q -150 -220 0 -220 Q 150 -220 150 -30 Z" c="#3A5AB2" ang={50} />
    <Line d="M0 -220 V -40 M-80 -200 Q -50 -120 -60 -40" c="#2A3E7A" w={4} o={0.7} /><Part id={p + "b"} d={circ(0, -222, 14)} c="#2A3E7A" />
  </g>) },
  { name: "backpack", cat: "clothing", w: 140, draw: (p) => (<g>
    <Line d="M-60 -320 Q 0 -380 60 -320" c="#2A6A4A" w={16} />
    <Part id={p + "b"} d={rr(-130, -330, 260, 330, 60)} c="#2E8A5A" /><Part id={p + "pk"} d={rr(-90, -150, 180, 130, 30)} c="#2A7A4A" />
    <Line d="M-90 -110 H 90" c="#FFD23F" w={6} /><Part id={p + "z"} d={rr(-10, -124, 20, 30, 6)} c="#FFD23F" />
  </g>) },
  { name: "umbrella", cat: "clothing", w: 170, draw: (p) => (<g>
    <path d="M0 -300 V -30 Q 0 0 -30 0 Q -60 0 -60 -30" stroke="#2A2A3A" strokeWidth={12} fill="none" strokeLinecap="round" />
    <Part id={p + "u"} d="M-200 -280 Q -180 -460 0 -470 Q 180 -460 200 -280 Q 150 -310 100 -280 Q 50 -310 0 -280 Q -50 -310 -100 -280 Q -150 -310 -200 -280 Z" c="#7A4AA8" ang={50} />
    <Line d="M0 -470 Q -40 -380 -100 -280 M0 -470 Q 40 -380 100 -280" c="#5A2A8A" w={5} />
  </g>) },
  { name: "sunglasses", cat: "clothing", w: 160, draw: (p) => (<g transform="translate(0,-90)">
    <Line d="M-180 -30 L -200 -60 M180 -30 L 200 -60" c="#2A2A3A" w={10} />
    {[-1, 1].map((sd) => <g key={sd}><Part id={p + "l" + sd} d={rr(sd < 0 ? -180 : 20, -50, 160, 100, 40)} c="#1B1B2A" /><path d={`M${sd < 0 ? -150 : 50} -30 L ${sd < 0 ? -100 : 100} -30 L ${sd < 0 ? -130 : 70} 20 Z`} fill="#FFFFFF" opacity={0.25} /></g>)}
    <Line d="M-20 -20 Q 0 -40 20 -20" c="#1B1B2A" w={12} />
  </g>) },
];

// ---------- MUSIC ----------
const music: ObjDef[] = [
  { name: "keyboard", cat: "music", w: 260, draw: (p) => (<g>
    <Line d="M-200 0 L -170 -100 M200 0 L 170 -100" c="#2A2A3A" w={12} />
    <Part id={p + "b"} d={rr(-260, -200, 520, 110, 16)} c="#2A2A3A" /><rect x={-240} y={-160} width={480} height={60} fill="#F4F6FF" />
    {Array.from({ length: 14 }, (_, i) => <Line key={i} d={`M${-240 + (i + 1) * 34} -160 V -100`} c="#B4BCD6" w={2} />)}
    {[0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => <rect key={i} x={-240 + (i + 1) * 34 - 10} y={-160} width={20} height={36} fill="#1B1B2A" />)}
    {[-200, -150, -100].map((x, i) => <circle key={x} cx={x} cy={-182} r={8} fill={["#2FE08A", "#FFD23F", "#FF4D6D"][i]} />)}
  </g>) },
  { name: "drum", cat: "music", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -220, 300, 200, 20)} c="#C2384A" /><Part id={p + "t"} d={ell(0, -220, 150, 40)} c="#F4EEE2" />
    {Array.from({ length: 6 }, (_, i) => <Line key={i} d={`M${-130 + i * 52} -210 L ${-104 + i * 52} -30`} c="#F4CF7A" w={5} />)}
    <Part id={p + "r"} d={rr(-156, -40, 312, 24, 10)} c="#D9A23F" />
    <Line d="M-60 -260 L 40 -380 M60 -250 L 140 -360" c="#E0A86A" w={10} />
  </g>) },
  { name: "microphone", cat: "music", w: 90, draw: (p) => (<g>
    <Part id={p + "b"} d={ell(0, -14, 80, 16)} c="#2A2A3A" /><Part id={p + "s"} d={rr(-8, -260, 16, 250, 6)} c="#9FA8C8" />
    <Part id={p + "h"} d={rr(-24, -330, 48, 90, 16)} c="#2A2A3A" />
    <Part id={p + "g"} d={circ(0, -370, 56)} c="#B8C0DA" ang={50} />
    {[-30, -10, 10, 30].map((x) => <Line key={x} d={`M${x} -414 V -326`} c="#8A92B0" w={3} o={0.7} />)}
  </g>) },
  { name: "trumpet", cat: "music", w: 200, draw: (p) => (<g transform="translate(0,-130)">
    <Part id={p + "t"} d={rr(-200, -18, 300, 36, 18)} c="#E0B04A" />
    <Part id={p + "b"} d="M100 -18 L 200 -80 L 200 80 L 100 18 Z" c="#F4CF7A" />
    <Line d="M-120 20 Q -100 90 0 90 Q 80 90 80 20" c="#D9A23F" w={20} />
    {[-60, -20, 20].map((x) => <Part key={x} id={p + "v" + x} d={rr(x - 10, -70, 20, 60, 6)} c="#D9A23F" />)}
    <Part id={p + "m"} d={rr(-230, -14, 40, 28, 10)} c="#C8901A" />
  </g>) },
  { name: "music-notes", cat: "music", w: 120, draw: (_, f) => (<g transform={`translate(0,${-Math.sin(f / 10) * 10})`}>
    <path d="M-60 -60 a 40 30 -20 1 0 50 -10 V -300 L 120 -340 V -110 a 40 30 -20 1 0 20 10 V -400 L -10 -350 Z" fill="#7A5AD8" />
    <path d="M-150 -160 a 36 26 -20 1 0 44 -8 V -340 h 16 v 200" fill="#3FC1C9" />
  </g>) },
];

// ---------- MONEY ----------
const money: ObjDef[] = [
  { name: "coin-stack", cat: "money", w: 130, draw: (p) => (<g>
    {Array.from({ length: 6 }, (_, i) => <g key={i}><Part id={p + "c" + i} d={rr(-110 + (i % 2) * 8, -40 - i * 36, 220, 40, 20)} c="#E0B04A" /><Line d={`M${-90 + (i % 2) * 8} ${-30 - i * 36} V ${-10 - i * 36} M${-40 + (i % 2) * 8} ${-30 - i * 36} V ${-10 - i * 36} M${10 + (i % 2) * 8} ${-30 - i * 36} V ${-10 - i * 36} M${60 + (i % 2) * 8} ${-30 - i * 36} V ${-10 - i * 36}`} c="#B8862A" w={3} /></g>)}
    <Part id={p + "t"} d={ell(4, -256, 110, 26)} c="#F4CF7A" /><text x={4} y={-246} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#B8862A">$</text>
  </g>) },
  { name: "banknote", cat: "money", w: 200, draw: (p) => (<g transform="rotate(-8,0,-80)">
    <Part id={p + "n"} d={rr(-200, -160, 400, 160, 10)} c="#6AC28A" /><rect x={-180} y={-140} width={360} height={120} rx={6} fill="none" stroke="#3A8A5A" strokeWidth={5} />
    <Part id={p + "c"} d={circ(0, -80, 46)} c="#3A8A5A" /><text x={0} y={-62} textAnchor="middle" fontFamily="Arial Black" fontSize={56} fill="#C8F0D0">$</text>
    {[-150, 150].map((x) => <text key={x} x={x} y={-104} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#2A6A4A">10</text>)}
  </g>) },
  { name: "bank-card", cat: "money", w: 180, draw: (p) => (<g transform="rotate(-6,0,-110)">
    <Part id={p + "c"} d={rr(-180, -230, 360, 230, 22)} c="#2A3E7A" /><Part id={p + "ch"} d={rr(-140, -170, 60, 46, 8)} c="#E0B04A" />
    <Line d="M-140 -80 H 60" c="#9FB0FF" w={14} o={0.8} /><Line d="M-140 -46 H -20" c="#9FB0FF" w={10} o={0.6} />
    <circle cx={110} cy={-60} r={30} fill="#FF4D3D" opacity={0.9} /><circle cx={140} cy={-60} r={30} fill="#FFD23F" opacity={0.8} />
  </g>) },
  { name: "briefcase", cat: "money", w: 170, draw: (p) => (<g>
    <path d="M-60 -240 L -60 -280 Q -60 -300 -40 -300 L 40 -300 Q 60 -300 60 -280 L 60 -240" stroke="#3A2416" strokeWidth={16} fill="none" />
    <Part id={p + "b"} d={rr(-180, -250, 360, 250, 24)} c="#7A4A2A" /><Line d="M-180 -150 H 180" c="#5A3418" w={6} />
    <Part id={p + "l"} d={rr(-30, -170, 60, 40, 8)} c="#D9A23F" />
  </g>) },
  { name: "piggy-bank", cat: "money", w: 170, draw: (p, f) => (<g>
    {[-80, -30, 40, 90].map((x) => <Part key={x} id={p + "l" + x} d={rr(x - 18, -60, 36, 60, 12)} c="#E87A9A" />)}
    <Part id={p + "b"} d={ell(0, -150, 170, 120)} c="#FF9EB0" ang={50} />
    <Part id={p + "sn"} d={ell(-170, -150, 34, 40)} c="#E87A9A" /><circle cx={-178} cy={-160} r={6} fill="#B8506A" /><circle cx={-178} cy={-140} r={6} fill="#B8506A" />
    <Part id={p + "e"} d="M-100 -250 L -60 -300 L -40 -240 Z" c="#E87A9A" /><Eye x={-110} y={-190} r={11} blink={bl(f, 60)} />
    <rect x={-30} y={-272} width={70} height={12} rx={6} fill="#B8506A" /><Line d="M168 -170 q 30 -10 20 20 q -10 20 10 30" c="#E87A9A" w={7} />
  </g>) },
];

// ---------- SCHOOL / TIME ----------
const school: ObjDef[] = [
  { name: "alarm-clock", cat: "school", w: 120, draw: (p, f) => { const shake = f % 60 < 20 ? Math.sin(f * 2) * 6 : 0; return (<g transform={`rotate(${shake},0,-150)`}>
    {[-1, 1].map((sd) => <Part key={sd} id={p + "b" + sd} d={circ(sd * 80, -280, 36)} c="#D9A23F" />)}
    {[-1, 1].map((sd) => <Line key={"l" + sd} d={`M${sd * 70} -40 L ${sd * 100} 0`} c="#2A2A3A" w={10} />)}
    <Part id={p + "c"} d={circ(0, -160, 130)} c="#E23A4A" /><Part id={p + "f"} d={circ(0, -160, 106)} c="#F4EEE2" />
    <Line d="M0 -160 V -230 M0 -160 L 50 -130" c="#2A0F5A" w={8} /><circle cx={0} cy={-160} r={10} fill="#2A0F5A" />
  </g>); } },
  { name: "calendar", cat: "school", w: 150, draw: (p) => (<g>
    <Part id={p + "b"} d={rr(-150, -320, 300, 320, 18)} c="#F4F6FF" /><Part id={p + "t"} d={rr(-150, -320, 300, 80, 18)} c="#E23A4A" />
    {[-90, 90].map((x) => <Part key={x} id={p + "r" + x} d={rr(x - 10, -350, 20, 60, 8)} c="#9FA8C8" />)}
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={-126 + (i % 5) * 52} y={-220 + Math.floor(i / 5) * 52} width={40} height={40} rx={6} fill={i === 12 ? "#FFD23F" : "#DDE3F2"} />)}
  </g>) },
  { name: "graduation-cap", cat: "school", w: 170, draw: (p, f) => (<g>
    <Part id={p + "c"} d="M-110 -120 L -110 -30 Q 0 20 110 -30 L 110 -120 Z" c="#2A2A3A" />
    <Part id={p + "t"} d="M0 -230 L 200 -150 L 0 -70 L -200 -150 Z" c="#3A3A4A" ang={60} />
    <Line d={`M0 -150 L 150 -140 L ${150 + Math.sin(f / 12) * 6} -40`} c="#FFD23F" w={6} /><Part id={p + "ta"} d={rr(140, -50, 22, 50, 6)} c="#FFD23F" />
  </g>) },
  { name: "chalkboard-easel", cat: "school", w: 190, draw: (p) => (<g>
    <Line d="M-150 0 L -90 -480 M150 0 L 90 -480 M0 -480 L 0 0" c="#8A5A3A" w={16} />
    <Part id={p + "f"} d={rr(-190, -460, 380, 280, 12)} c="#8A5A3A" /><rect x={-170} y={-440} width={340} height={240} fill="#1E3A34" />
    <text x={0} y={-330} textAnchor="middle" fontFamily="Arial Black" fontSize={64} fill="#E8F2EC" opacity={0.85}>E=mc²</text>
    <Line d="M-120 -260 Q -60 -300 0 -260 T 120 -260" c="#E8F2EC" w={5} o={0.6} />
  </g>) },
  { name: "ruler", cat: "school", w: 220, draw: (p) => (<g transform="rotate(-10,0,-50)">
    <Part id={p + "r"} d={rr(-230, -90, 460, 70, 8)} c="#FFD23F" />
    {Array.from({ length: 23 }, (_, i) => <Line key={i} d={`M${-210 + i * 19} -90 v ${i % 5 === 0 ? 30 : 16}`} c="#8A6A1A" w={3} />)}
  </g>) },
];

// ---------- NATURE EXTRAS ----------
const nature2: ObjDef[] = [
  { name: "cactus", cat: "nature", w: 110, draw: (p) => (<g>
    <Part id={p + "p"} d="M-80 -110 L 80 -110 L 64 0 L -64 0 Z" c="#C86A3A" />
    <Part id={p + "m"} d={rr(-40, -420, 80, 320, 40)} c="#3FAE6A" ang={50} />
    <Part id={p + "a1"} d="M-40 -230 L -90 -230 Q -110 -230 -110 -250 L -110 -320 Q -110 -340 -90 -340 Q -70 -340 -70 -320 L -70 -270 L -40 -270 Z" c="#3A9A5A" />
    <Part id={p + "a2"} d="M40 -280 L 90 -280 Q 110 -280 110 -300 L 110 -350 Q 110 -370 90 -370 Q 70 -370 70 -350 L 70 -320 L 40 -320 Z" c="#3A9A5A" />
    {[[-14, -380], [14, -330], [-14, -280], [14, -230], [-14, -180]].map(([x, y], i) => <Line key={i} d={`M${x} ${y} l ${x > 0 ? 10 : -10} -6`} c="#E8F4C8" w={3} />)}
    <g transform="translate(0,-430)">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-10} rx={8} ry={12} fill="#FF7AB8" transform={`rotate(${a})`} />)}</g>
  </g>) },
  { name: "sunflower", cat: "nature", w: 120, draw: (p, f) => (<g>
    <Line d="M0 0 Q 10 -160 0 -300" c="#2E8A5A" w={14} />
    {[-1, 1].map((sd) => <Part key={sd} id={p + "lf" + sd} d={`M0 ${-120 - sd * 30} Q ${sd * 90} ${-170 - sd * 30} ${sd * 120} ${-130 - sd * 30} Q ${sd * 60} ${-100 - sd * 30} 0 ${-120 - sd * 30} Z`} c="#3FAE6A" />)}
    <g transform={`translate(0,-330) rotate(${Math.sin(f / 30) * 6})`}>
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={0} cy={-70} rx={18} ry={40} fill="#FFD23F" transform={`rotate(${i * (360 / 14)})`} />)}
      <Part id={p + "c"} d={circ(0, 0, 56)} c="#7A4A1A" />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={Math.cos(i * 2.4) * (12 + i * 3)} cy={Math.sin(i * 2.4) * (12 + i * 3)} r={4} fill="#4A2A0A" />)}
    </g>
  </g>) },
  { name: "tree-stump", cat: "nature", w: 150, draw: (p) => (<g>
    <Part id={p + "s"} d="M-130 0 L -110 -160 L 110 -160 L 130 0 Q 160 -10 170 0 Z" c="#7A4A2A" />
    {[-150, -100].map((x) => <Part key={x} id={p + "r" + x} d={`M${x} 0 Q ${x + 30} -40 ${x + 60} -20 L ${x + 50} 0 Z`} c="#6A3E22" />)}
    <Part id={p + "t"} d={ell(0, -160, 110, 30)} c="#D9A86A" /><ellipse cx={0} cy={-160} rx={70} ry={18} fill="none" stroke="#A8783A" strokeWidth={4} /><ellipse cx={0} cy={-160} rx={30} ry={8} fill="none" stroke="#A8783A" strokeWidth={4} />
    <Part id={p + "m"} d="M80 -40 Q 120 -90 150 -40 Z" c="#E23A4A" />
  </g>) },
  { name: "pumpkin", cat: "nature", w: 150, draw: (p) => (<g>
    {[-80, 80, 0].map((x, i) => <Part key={x} id={p + "s" + i} d={ell(x, -110, i === 2 ? 80 : 90, 110)} c={i === 2 ? "#FF9A2A" : "#F08A1A"} ang={50} />)}
    <Line d="M-40 -200 Q -50 -110 -40 -10 M40 -200 Q 50 -110 40 -10" c="#C8601A" w={5} />
    <Part id={p + "st"} d="M-12 -210 Q -10 -260 16 -270 L 22 -250 Q 10 -240 12 -210 Z" c="#5A7A2A" />
  </g>) },
  { name: "seashell", cat: "nature", w: 130, draw: (p) => (<g>
    <Part id={p + "s"} d="M0 -20 Q -160 -60 -140 -200 Q -80 -290 0 -290 Q 80 -290 140 -200 Q 160 -60 0 -20 Z" c="#FFC2B0" ang={50} />
    {[-100, -50, 0, 50, 100].map((x) => <Line key={x} d={`M0 -30 Q ${x * 0.6} -150 ${x} -270`} c="#E8907A" w={5} />)}
    <Part id={p + "b"} d={rr(-40, -40, 80, 40, 14)} c="#F0A894" />
  </g>) },
  { name: "crystal", cat: "nature", w: 120, draw: (p, f) => (<g>
    <circle cx={0} cy={-180} r={150} fill="#B48CFF" opacity={0.1 + 0.06 * Math.sin(f / 10)} />
    <Part id={p + "a"} d="M-50 0 L -70 -200 L -30 -280 L 10 -200 L 0 0 Z" c="#9A6AE8" ang={60} />
    <Part id={p + "b"} d="M-10 0 L 0 -260 L 40 -360 L 80 -260 L 70 0 Z" c="#B48CFF" ang={60} />
    <Part id={p + "c"} d="M60 0 L 70 -140 L 100 -190 L 130 -140 L 120 0 Z" c="#8A5AD8" ang={60} />
    <Line d="M40 -360 L 40 -10" c="#E8DCFF" w={4} o={0.7} />
  </g>) },
  { name: "volcano", cat: "nature", w: 230, draw: (p, f) => (<g>
    {[0, 1, 2].map((i) => <circle key={i} cx={-20 + i * 30} cy={-390 - i * 50 - (f % 40)} r={40 + i * 14} fill="#7A7E9A" opacity={0.55 - i * 0.15} />)}
    <Part id={p + "m"} d="M-240 0 L -70 -320 L 70 -320 L 240 0 Z" c="#6A4A3A" ang={60} />
    <path d="M-70 -320 L 70 -320 L 40 -260 L 20 -200 L 0 -240 L -20 -160 L -40 -250 Z" fill="#FF6A2A" />
    <ellipse cx={0} cy={-322} rx={72} ry={14} fill="#FFC23A" />
  </g>) },
];

export const OBJECTS3: ObjDef[] = [...animals, ...furniture, ...electronics, ...clothing, ...music, ...money, ...school, ...nature2];
