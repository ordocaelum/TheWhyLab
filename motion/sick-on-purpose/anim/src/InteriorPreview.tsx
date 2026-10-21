import React from "react";
import { useCurrentFrame } from "remotion";
import { AVATARS, Human2 } from "./human2";
import { INTERIORS } from "./interiors";

export const INTERIOR_NAMES = Object.keys(INTERIORS) as (keyof typeof INTERIORS)[];
// avatar + slot per interior, for scale/consistency checks
const CAST: Record<keyof typeof INTERIORS, [number, number, number, "present" | "chin" | "hips" | "idle"]> = {
  Bedroom: [5, 1500, 1000, "chin"],
  LivingRoom: [1, 1150, 1010, "present"],
  Kitchen: [7, 1000, 1000, "hips"],
  HomeOffice: [2, 1250, 1010, "present"],
};
export const InteriorPreview: React.FC<{ name: keyof typeof INTERIORS }> = ({ name }) => {
  const f = useCurrentFrame();
  const R = INTERIORS[name];
  const [a, x, y, pose] = CAST[name];
  return <R><Human2 L={AVATARS[a].L} x={x} y={y} s={0.68} f={f} pose={pose} expr={pose === "chin" ? "thinking" : "happy"} /></R>;
};
