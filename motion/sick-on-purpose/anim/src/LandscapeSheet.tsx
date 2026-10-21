import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DocV2 } from "./doc2";
import { LANDSCAPES } from "./landscapes";

const NAMES = Object.keys(LANDSCAPES) as (keyof typeof LANDSCAPES)[];
// per-landscape actor slot (x, feet y) where the ground is walkable
export const LAND_SLOTS: Partial<Record<keyof typeof LANDSCAPES, [number, number]>> = { Swamp: [420, 975] };

// One landscape per composition id (props.name), Doc standing on the ground line for scale.
export const LandscapePreview: React.FC<{ name: keyof typeof LANDSCAPES }> = ({ name }) => {
  const f = useCurrentFrame();
  const L = LANDSCAPES[name];
  return (
    <AbsoluteFill>
      <L><DocV2 x={(LAND_SLOTS[name] ?? [1020, 980])[0]} y={(LAND_SLOTS[name] ?? [1020, 980])[1]} s={0.5} f={f} pose="present" expr="happy" /></L>
    </AbsoluteFill>
  );
};
export { NAMES as LANDSCAPE_NAMES };
