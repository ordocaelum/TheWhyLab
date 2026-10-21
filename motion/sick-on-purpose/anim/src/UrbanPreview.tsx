import React from "react";
import { useCurrentFrame } from "remotion";
import { DocV2 } from "./doc2";
import { AVATARS, Human2 } from "./human2";
import { URBAN } from "./urban";

export const URBAN_NAMES = Object.keys(URBAN) as (keyof typeof URBAN)[];
// actor per set, placed on its documented slot
export const UrbanPreview: React.FC<{ name: keyof typeof URBAN }> = ({ name }) => {
  const f = useCurrentFrame();
  const U = URBAN[name];
  const actor =
    name === "Street" ? <Human2 L={AVATARS[0].L} x={760} y={930} s={0.6} f={f} pose="walk" /> :
    name === "Alley" ? <DocV2 x={760} y={1000} s={0.62} f={f} pose="crossed" expr="skeptical" /> :
    name === "Rooftop" ? <DocV2 x={820} y={930} s={0.62} f={f} pose="present" expr="happy" /> :
    name === "Highway" ? <DocV2 x={300} y={1260} s={1.0} f={f} pose="point" expr="neutral" /> :
    <Human2 L={AVATARS[9].L} x={1500} y={1150} s={0.9} f={f} pose="chin" expr="thinking" />;
  return <U>{actor}</U>;
};
