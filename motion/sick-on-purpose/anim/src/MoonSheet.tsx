import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Moon, MoonCity, MoonFields, MoonSea, Orion, Ponzo, Stars } from "./moon";
import { AVATARS, Human2 } from "./human2";
import { DocV2 } from "./doc2";

const Cell: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => (
  <div style={{ position: "absolute", left: (i % 2) * 960, top: Math.floor(i / 2) * 540, width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
);

// Review sheet: moonrise sets (moon behind scenery) + moon, Orion, Ponzo
export const MoonSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Cell i={0}><MoonCity moon={{ x: 1180, y: 560, r: 150, tint: 0.85 }}><Human2 L={AVATARS[0].L} x={600} y={930} s={0.6} f={f} pose="point" expr="happy" /><Human2 L={AVATARS[3].L} x={820} y={930} s={0.58} f={f} expr="surprised" /></MoonCity></Cell>
      <Cell i={1}><MoonFields moon={{ x: 760, y: 690, r: 130, tint: 1 }}><DocV2 x={1250} y={990} s={0.6} f={f} pose="present" expr="happy" look={-1} /></MoonFields></Cell>
      <Cell i={2}><MoonSea moon={{ x: 960, y: 600, r: 110, tint: 0.7 }} /></Cell>
      <Cell i={3}>
        <svg width={1920} height={1080}>
          <rect width={1920} height={1080} fill="#0B1033" />
          <Stars seed={4} n={80} y1={1080} />
          <Moon id="hi" x={330} y={330} r={220} tint={0} />
          <Moon id="lo" x={330} y={820} r={160} tint={1} squash={0.96} />
          <Orion x={980} y={420} s={1.2} />
          <Ponzo x={1550} y={560} s={0.62} measure={0.6} />
        </svg>
      </Cell>
    </AbsoluteFill>
  );
};
