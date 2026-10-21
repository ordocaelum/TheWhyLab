import React from "react";
import { AbsoluteFill } from "remotion";
import { DocExpr, DocV2 } from "./doc2";

const EXPRS: DocExpr[] = ["neutral", "happy", "surprised", "thinking", "skeptical", "unamused", "serious"];

// Expression sheet: head-and-shoulders crops, 3×2 grid, flat background.
export const DocExprSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
    <svg width={2400} height={1360}>
      {EXPRS.map((e, i) => {
        const cx = 300 + (i % 4) * 600, cy = 130 + Math.floor(i / 4) * 650;
        return (
          <g key={e}>
            <rect x={cx - 270} y={cy - 100} width={540} height={560} rx={30} fill="#0B1228" opacity={0.5} />
            <svg x={cx - 270} y={cy - 100} width={540} height={560} viewBox={`${-270} ${-1330} 540 560`}>
              <DocV2 x={0} y={0} s={1.5} f={10} expr={e} look={0} />
            </svg>
            <text x={cx} y={cy + 505} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#F4CF7A">{e.toUpperCase()}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);

import { DocPose } from "./doc2";
const POSES: [DocPose, DocExpr][] = [
  ["idle", "neutral"], ["present", "happy"], ["point", "neutral"], ["chin", "thinking"],
  ["crossed", "unamused"], ["hips", "happy"], ["shrug", "skeptical"], ["walk", "neutral"],
];

// Pose sheet: full body, 4×2 grid. Walk shown mid-stride.
export const DocPoseSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
    <svg width={2400} height={2000}>
      {POSES.map(([p, e], i) => {
        const cx = 300 + (i % 4) * 600, base = 900 + Math.floor(i / 4) * 980;
        return (
          <g key={p}>
            <DocV2 x={cx} y={base} s={1} f={p === "walk" ? 9 : 10} pose={p} expr={e} />
            <text x={cx} y={base + 70} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#F4CF7A">{p.toUpperCase()}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
