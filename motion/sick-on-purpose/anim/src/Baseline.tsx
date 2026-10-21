import React from "react";
import { AbsoluteFill } from "remotion";
import { Scientist } from "./chars";

// Neutral character baseline for design passes: plain backdrop, full body, 3/4 frame height.
export const DocBaseline: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
    <svg width={1080} height={1350}>
      <Scientist x={540} y={1300} s={1.4} f={10} />
    </svg>
  </AbsoluteFill>
);
