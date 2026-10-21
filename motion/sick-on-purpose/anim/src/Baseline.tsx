import React from "react";
import { AbsoluteFill } from "remotion";
import { Scientist } from "./chars";
import { DocV2 } from "./doc2";

const BG = "radial-gradient(circle at 50% 40%, #24345E, #0B1228)";

// Neutral character baseline for design passes: plain backdrop, full body.
export const DocBaseline: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <svg width={1080} height={1350}><DocV2 x={540} y={1300} s={1.4} f={10} /></svg>
  </AbsoluteFill>
);

// v1 vs v2 side by side
export const DocCompare: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <svg width={2160} height={1350}>
      <Scientist x={540} y={1300} s={1.4} f={10} />
      <DocV2 x={1620} y={1300} s={1.4} f={10} />
      <text x={540} y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#CFD8FF" opacity={0.7}>v1</text>
      <text x={1620} y={60} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#CFD8FF" opacity={0.7}>v2</text>
    </svg>
  </AbsoluteFill>
);
