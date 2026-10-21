import React from "react";
import { useCurrentFrame } from "remotion";
import { Cell, Scientist } from "./chars";
import { Headline, Sparkle, Stage, W } from "./kit";

export const Duo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage k="dusk" lx={W / 2} ly={520} head={<Headline big="THE WHY WORKS" top={60} />}>
      <rect x={0} y={900} width={W} height={180} fill="#1A0B3D" opacity={0.6} />
      <Scientist x={760} y={1040} s={0.92} f={f} talk={f % 60 < 30} point={0.4} look={1} />
      <Cell x={1150} y={560} s={0.45} f={f} look={-1} wave />
      <Sparkle x={1000} y={360} at={5} size={30} />
      <Sparkle x={1500} y={520} at={14} size={24} color="#FFD27A" />
    </Stage>
  );
};
