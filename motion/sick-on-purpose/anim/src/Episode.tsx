// Whole episode: scenes keyed to script lines, timed from lines.json, with the stitched voice track.
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { COLD_OPEN } from "./ColdOpen";
import { CH1 } from "./Ch1";
import { Presenter } from "./lab";
import { Grain } from "./gen";
import { lineStart, lines, OffsetCtx, SceneDef, TOTAL } from "./timing";

const COLD: SceneDef[] = [
  { line: 1, C: COLD_OPEN[0] },
  { line: 2, C: COLD_OPEN[1] },
  { line: 3, C: COLD_OPEN[2], doc: "br" },
  { line: 4, C: COLD_OPEN[3] },
  { line: 5, C: COLD_OPEN[4] },
];

export const SCENES: SceneDef[] = [...COLD, ...CH1];

// Scene i runs from its line's start (first scene from 0) to the next scene's start; last one to its next line or the end.
const spans = SCENES.map((s, i) => {
  const from = i === 0 ? 0 : lineStart(s.line) - 5;
  const nextLine = SCENES[i + 1]?.line;
  const to = nextLine ? lineStart(nextLine) - 5 : nextLineAfter(s.line);
  return { from, dur: Math.max(1, to - from) };
});
function nextLineAfter(n: number) {
  return n < lines.length ? lineStart(n + 1) - 5 : TOTAL;
}
export const EPISODE_FRAMES = spans[spans.length - 1].from + spans[spans.length - 1].dur;

export const Episode: React.FC = () => (
  <AbsoluteFill style={{ background: "#05030F" }}>
    <Audio src={staticFile("vo.wav")} />
    {SCENES.map((s, i) => (
      <Sequence key={i} from={spans[i].from} durationInFrames={spans[i].dur}>
        <OffsetCtx.Provider value={spans[i].from}>
          <s.C />
          {s.doc && <Presenter side={s.doc} enter={spans[i].from} expr={s.expr} />}
        </OffsetCtx.Provider>
      </Sequence>
    ))}
    <Grain o={0.04} />
  </AbsoluteFill>
);
