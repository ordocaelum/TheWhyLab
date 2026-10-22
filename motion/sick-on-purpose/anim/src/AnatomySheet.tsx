import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Body, Brain } from "./anatomy";

const L: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#F4CF7A">{t}</text>
);

// Review sheet: body modes + brain variants
export const AnatomySheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
      <svg width={2800} height={1400}>
        <Body id="b1" x={260} y={1200} s={1.0} f={f} mode="skin" /><L x={260} y={1270} t="SKIN" />
        <Body id="b2" x={720} y={1200} s={1.0} f={f} mode="xray" /><L x={720} y={1270} t="X-RAY" />
        <Body id="b3" x={1180} y={1200} s={1.0} f={f} mode="organs" /><L x={1180} y={1270} t="ORGANS" />
        <Body id="b4" x={1640} y={1200} s={1.0} f={f} mode="organs" highlight="stomach" nerves /><L x={1640} y={1270} t="HIGHLIGHT + VAGUS" />
        <Brain id="g1" x={2280} y={330} s={0.8} f={f} /><L x={2280} y={600} t="BRAIN" />
        <Brain id="g2" x={2280} y={880} s={0.8} f={f} lobes hypo /><L x={2280} y={1150} t="LOBES + HYPOTHALAMUS" />
      </svg>
    </AbsoluteFill>
  );
};
