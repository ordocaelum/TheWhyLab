// Voice-driven timing. lines.json comes from tools/stitch.py (start/end of every script line in vo.wav).
import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import LINES from "./lines.json";
import { FPS } from "./kit";

export type Line = { n: number; who: "DOC" | "CELL"; text: string; start: number; end: number };
export const lines = LINES as Line[];
export const fr = (sec: number) => Math.round(sec * FPS);
export const lineStart = (n: number) => fr(lines[n - 1].start);
export const lineEnd = (n: number) => fr(lines[n - 1].end);
export const TOTAL = fr(lines[lines.length - 1].end + 1.5);

// Who is talking at an absolute frame
export const speakerAt = (absFrame: number): "DOC" | "CELL" | null => {
  const t = absFrame / FPS;
  const l = lines.find((x) => t >= x.start && t <= x.end);
  return l ? l.who : null;
};

// Absolute frame offset of the current scene, so components inside a <Sequence> can ask "is Doc talking now?"
export const OffsetCtx = createContext(0);
export const useAbsFrame = () => useCurrentFrame() + useContext(OffsetCtx);
export const useTalking = (who: "DOC" | "CELL") => speakerAt(useAbsFrame()) === who;

// Scene = starts at a script line; ends where the next scene starts.
export type Placement = "bl" | "br" | null;
export type SceneDef = { line: number; C: React.FC; doc?: Placement };
