import React from "react";
import { AbsoluteFill } from "remotion";
import { OBJECTS, Thing } from "./objects";

// Auto catalog: every object in the registry, 10 per row, labelled with name and category.
export const ObjectSheet: React.FC<{ from?: number; scale?: number }> = ({ from = 0, scale = 0.58 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
    <svg width={3200} height={2200}>
      {OBJECTS.slice(from, from + 50).map((o, i) => {
        const cx = 160 + (i % 10) * 320, base = 380 + Math.floor(i / 10) * 430;
        return (
          <g key={o.name}>
            <rect x={cx - 150} y={base - 360} width={300} height={410} rx={20} fill="#0B1228" opacity={0.45} />
            <Thing name={o.name} x={cx} y={base} s={scale} f={10} />
            <text x={cx} y={base + 34} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#F4CF7A">{o.name.toUpperCase()}</text>
            <text x={cx} y={base + 58} textAnchor="middle" fontFamily="Arial" fontSize={18} fill="#9FA8C8">{o.cat}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
