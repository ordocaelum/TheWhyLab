import React from "react";
import { AbsoluteFill } from "remotion";
import { Artery, BloodTunnel, Bottle, Courthouse, Fingerprint, Gauge, Memo, ParticleField, StatCard } from "./plastic";
import { Brain } from "./anatomy";
import { useCurrentFrame } from "remotion";

const P: React.FC<{ i: number; bg?: string; children: React.ReactNode }> = ({ i, bg = "#0B1033", children }) => (
  <div style={{ position: "absolute", left: (i % 3) * 640, top: Math.floor(i / 3) * 360 + 180, width: 1920, height: 1080, transform: "scale(0.3333)", transformOrigin: "0 0", overflow: "hidden", background: bg }}>
    <svg width={1920} height={1080}>{children}</svg>
  </div>
);
// Review sheet for the microplastics kit
export const PlasticSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <P i={0}><BloodTunnel plastic={0.6} /></P>
      <P i={1}><Bottle x={700} y={950} s={1.8} specks={1} /><ParticleField seed={2} n={40} area={[1000, 100, 900, 900]} /></P>
      <P i={2} bg="#2A0A14"><Artery x={960} y={540} s={1.3} /></P>
      <P i={3}><Fingerprint x={510} y={360} overlap={0.85} /><Brain id="ps" x={960} y={900} s={0.35} f={f} /></P>
      <P i={4} bg="#1A2A4A"><Courthouse x={960} y={980} s={1.2} /><Memo x={300} y={560} rot={-8} hi={1} /></P>
      <P i={5}><StatCard y={520} big="17 / 22" label="HAD PLASTIC IN THEIR BLOOD" sub="Amsterdam, 2022" c="#FF5FA2" at={0} /><Gauge x={1600} y={950} v={0.7} s={0.6} labels={["½×", "10×"]} /></P>
    </AbsoluteFill>
  );
};
