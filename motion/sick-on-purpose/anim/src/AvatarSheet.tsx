import React from "react";
import { AbsoluteFill } from "remotion";
import { AVATARS, Human2 } from "./human2";

// 10 avatars, 5×2, full body on a flat background
export const AvatarSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #24345E, #0B1228)" }}>
    <svg width={2600} height={2000}>
      {AVATARS.map((a, i) => {
        const cx = 260 + (i % 5) * 520, base = 900 + Math.floor(i / 5) * 980;
        return (
          <g key={a.name}>
            <Human2 L={a.L} x={cx} y={base} s={1} f={10} />
            <text x={cx} y={base + 64} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#F4CF7A">{a.name.toUpperCase()}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
