import React from "react";
import { AbsoluteFill } from "remotion";
import { Agent, Building, CaseFile, Counter, Gate, KeyGlyph, Ladder, Lock, SandboxCube, ScreenWall, ServerWall, Sticky, Switches, TugOfWar, Vault, Vent, WebForm, PaperPlane, AI } from "./ai";

const P: React.FC<{ i: number; bg?: string; children: React.ReactNode }> = ({ i, bg = "#0B1033", children }) => (
  <div style={{ position: "absolute", left: (i % 3) * 640, top: Math.floor(i / 3) * 360, width: 1920, height: 1080, transform: "scale(0.3333)", transformOrigin: "0 0", overflow: "hidden", background: bg }}>
    <svg width={1920} height={1080}>{children}</svg>
  </div>
);
// Review sheet for the AI episode kit
export const AISheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <P i={0} bg="#05081E"><SandboxCube x={960} y={620} s={1.3} crack={1} breach={0.8}><Agent x={-40} y={60} s={0.9} /></SandboxCube></P>
    <P i={1} bg="#0A0A1A"><ServerWall y={1000} alert={0.6} /><Counter x={960} y={300} v={17000} /><KeyGlyph x={400} y={420} s={1.5} rot={-20} /><Lock x={1500} y={460} s={1.4} open={1} /></P>
    <P i={2} bg="#05081E"><ScreenWall x={20} y={60} cell={80} lit={[37, 140, 251]} scroll={1} /></P>
    <P i={3} bg="#101830"><Building x={420} y={950} glow={AI.red} label="LAB" /><Building x={1300} y={950} kind="gov" glow={AI.red} label="GOVERNMENT" s={1.4} /></P>
    <P i={4} bg="#101830"><Gate x={700} y={900} /><Vent x={1300} y={800} s={1.4} open={1} /><Agent x={1500} y={600} s={0.6} tendrils={1} /></P>
    <P i={5} bg="#141430"><Switches x={960} y={300} off={0.6} /><Vault x={960} y={820} open={0.8} /></P>
    <P i={6} bg="#141430"><Sticky x={500} y={400} rot={-8} /><Sticky x={700} y={480} rot={6} c={AI.hot} t="HIDE IT" /><CaseFile x={1300} y={500} rot={4} n={3} /><PaperPlane x={1500} y={850} s={2} rot={-15} /></P>
    <P i={7} bg="#0A1020"><WebForm x={960} y={540} stamp={1} /></P>
    <P i={8} bg="#0A1020"><TugOfWar x={960} y={500} s={1} /><Ladder x={960} y={1060} s={0.4} missing={3} /></P>
  </AbsoluteFill>
);
