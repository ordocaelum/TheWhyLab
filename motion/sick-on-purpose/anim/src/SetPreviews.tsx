import React from "react";
import { useCurrentFrame } from "remotion";
import { DocV2 } from "./doc2";
import { Grain } from "./gen";
import { DemoGraph, LabBench, LabScreen, LabWide } from "./sets";

// Set previews with Doc placed in each set's documented slot.
export const PrevLabWide: React.FC = () => {
  const f = useCurrentFrame();
  return (<><LabWide><DocV2 x={1290} y={1010} s={0.62} f={f} pose="present" expr="happy" /></LabWide><Grain o={0.04} /></>);
};
export const PrevLabBench: React.FC = () => {
  const f = useCurrentFrame();
  return (<><LabBench actor={<DocV2 x={760} y={960} s={1.0} f={f} pose="point" expr="neutral" />} /><Grain o={0.04} /></>);
};
export const PrevLabScreen: React.FC = () => {
  const f = useCurrentFrame();
  return (<><LabScreen screen={<DemoGraph />} actor={<DocV2 x={300} y={1260} s={1.0} f={f} pose="point" expr="happy" />} /><Grain o={0.04} /></>);
};
