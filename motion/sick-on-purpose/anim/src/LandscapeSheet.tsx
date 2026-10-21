import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DocV2 } from "./doc2";
import { LANDSCAPES } from "./landscapes";

const NAMES = Object.keys(LANDSCAPES) as (keyof typeof LANDSCAPES)[];

// One landscape per composition id (props.name), Doc standing on the ground line for scale.
export const LandscapePreview: React.FC<{ name: keyof typeof LANDSCAPES }> = ({ name }) => {
  const f = useCurrentFrame();
  const L = LANDSCAPES[name];
  return (
    <AbsoluteFill>
      <L><DocV2 x={1020} y={980} s={0.5} f={f} pose="present" expr="happy" /></L>
    </AbsoluteFill>
  );
};
export { NAMES as LANDSCAPE_NAMES };
