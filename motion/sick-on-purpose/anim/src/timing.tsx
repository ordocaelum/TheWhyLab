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

// Per-episode timing helpers (each episode passes its own lines.json)
export const makeTiming = (L: Line[]) => ({
  lines: L,
  lineStart: (n: number) => fr(L[n - 1].start),
  lineEnd: (n: number) => fr(L[n - 1].end),
  TOTAL: fr(L[L.length - 1].end + 1.5),
});

// Which episode's lines are active (default: episode 1); wrap an episode in <LinesCtx.Provider value={...}>
export const LinesCtx = createContext<Line[]>(lines);

// Who is talking at an absolute frame
export const speakerAt = (absFrame: number, L: Line[] = lines): "DOC" | "CELL" | null => {
  const t = absFrame / FPS;
  const l = L.find((x) => t >= x.start && t <= x.end);
  return l ? l.who : null;
};

// Absolute frame offset of the current scene, so components inside a <Sequence> can ask "is Doc talking now?"
export const OffsetCtx = createContext(0);
export const useAbsFrame = () => useCurrentFrame() + useContext(OffsetCtx);
export const useTalking = (who: "DOC" | "CELL") => speakerAt(useAbsFrame(), useContext(LinesCtx)) === who;

// Scene = starts at a script line; ends where the next scene starts.
export type Placement = "bl" | "br" | null;
export type SceneDef = { line: number; C: React.FC; doc?: Placement; expr?: import("./doc2").DocExpr };
