// Camera + VFX test: three moon-episode shots rebuilt with parallax planes, depth of field and effects.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { H, lerp, W } from "./kit";
import { mix } from "./gen";
import { Skyline } from "./urban";
import { LabScreen } from "./sets";
import { DocV2 } from "./doc2";
import { AVATARS, Human2 } from "./human2";
import { Moon, Ponzo, Stars } from "./moon";
import { BloomDefs, Cine, Dust, Flare, GodRays, Grade, Haze, Plane, useCam, ZoomIn } from "./cinema";

const SHOT = 300;
const AV = (n: string) => AVATARS.find((a) => a.name === n)!.L;

// A. Rooftop moonrise: 8 depth planes, slow push-in + drift, moon bloom, god rays, haze, dust, flare
const ShotA: React.FC = () => {
  const f = useCurrentFrame();
  const cam = useCam([{ at: 0, z: 1.06, x: -40, y: 20 }, { at: SHOT, z: 1.2, x: 60, y: -30 }], { ox: 1160, oy: 620 });
  const my = lerp(f, 0, SHOT, 720, 430, Easing.inOut(Easing.sin));
  const tint = lerp(f, 0, SHOT, 1, 0.75);
  return (
    <Cine cam={cam}>
      <Plane depth={0.02}>
        <defs><linearGradient id="csA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070A30" /><stop offset="0.55" stopColor="#2A2466" /><stop offset="0.8" stopColor="#7A3A7A" /><stop offset="1" stopColor="#F08A5A" /></linearGradient></defs>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#csA)" />
        <Stars seed={9} n={140} y1={600} />
      </Plane>
      <Plane depth={0.08}>
        <BloomDefs id="mb" r={30} />
        <GodRays x={1160} y={my} c={mix("#DDE6FF", "#FFB070", tint)} n={14} len={1500} o={0.09} />
        <g filter="url(#mb)"><Moon id="cA" x={1160} y={my} r={175} tint={tint} glow={1.2} /></g>
      </Plane>
      <Plane depth={0.25} blur={3.5}><Haze y={760} h={300} c="#D07A8A" o={0.5} /><Skyline seed={21} base={790} minH={140} maxH={330} c="#3A2E6A" haze={0.55} hazeC="#C86A6A" lit={0.3} /></Plane>
      <Plane depth={0.5} blur={1.6}><Skyline seed={22} base={840} minH={70} maxH={220} c="#1E1A44" haze={0.2} hazeC="#8A4A6A" lit={0.55} /><Haze y={860} h={120} c="#6A3A7A" o={0.35} /></Plane>
      <Plane depth={0.85} blur={0.5}>
        <path d={`M-200 800 L ${W + 200} 800 L ${W + 200} ${H + 200} L -200 ${H + 200} Z`} fill="#34344A" />
        <rect x={-200} y={772} width={W + 400} height={34} fill="#55556A" /><rect x={-200} y={772} width={W + 400} height={7} fill="#8A8AA0" />
        <g transform="translate(1720,800)">{[-60, 0, 60].map((x) => <line key={x} x1={x} y1={0} x2={x * 0.6} y2={-160} stroke="#2A2030" strokeWidth={9} />)}<rect x={-90} y={-330} width={180} height={180} rx={14} fill="#6A4A3A" /><path d="M-96 -330 L 0 -390 L 96 -330 Z" fill="#4A3228" /></g>
        <ellipse cx={680} cy={935} rx={360} ry={30} fill="#000" opacity={0.25} />
      </Plane>
      <Plane depth={1}>
        <Human2 L={AV("Marcus")} x={560} y={930} s={0.6} f={f} pose={f > 120 ? "point" : "idle"} expr={f > 120 ? "happy" : "neutral"} look={1} />
        <Human2 L={AV("Mei")} x={770} y={930} s={0.58} f={f + 9} expr={f > 150 ? "surprised" : "neutral"} look={1} />
        <rect x={0} y={0} width={W} height={H} fill="#FF9A5A" opacity={0.06} style={{ mixBlendMode: "screen" }} />
      </Plane>
      <Plane depth={1.15} blur={1.2}><Dust seed={3} n={60} c="#FFE2C0" size={3} o={0.45} rise={0.3} /></Plane>
      <Plane depth={1.6} blur={9}><path d={`M-300 ${H + 200} L -300 995 L ${W + 300} 1010 L ${W + 300} ${H + 200} Z`} fill="#1A1A26" /><rect x={-300} y={988} width={W + 600} height={10} fill="#4A4A5A" /></Plane>
      <Flare x={1160 - (cam.x - 0) * 0.08} y={my} o={0.35} />
      <Grade warm="#FF8A5A" cool="#2A2A8A" vig={0.6} leak={0.1} />
    </Cine>
  );
};

// B. Doc at the lab screen: set and actor on separate planes, push toward the screen, screen bloom + light shafts + dust in the beam
const ScreenContent: React.FC = () => {
  const f = useCurrentFrame();
  const g = lerp(f, 30, 110, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <g>
      <text x={550} y={80} textAnchor="middle" fontFamily="Arial Black" fontSize={52} fill="#F4EEE2">WHERE PEOPLE PUT THE MOON</text>
      <line x1={120} y1={420} x2={1000} y2={420} stroke="#F4EEE2" strokeWidth={6} />
      <circle cx={120} cy={420} r={14} fill="#F4EEE2" />
      <Moon id="sbA" x={120 + 180 * g} y={300} r={34} tint={0} glow={0.5} />
      <Moon id="sbB" x={120 + 760 * g} y={300} r={34} tint={1} glow={0.5} />
      <text x={120 + 760 * g} y={480} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#FFB060">HORIZON</text>
      <text x={120 + 180 * g} y={480} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#F4EEE2">HIGH</text>
      <text x={760} y={200} textAnchor="middle" fontFamily="Arial Black" fontSize={60} fill="#FFD23F" opacity={lerp(f, 120, 140, 0, 1)}>≈ 4× FARTHER</text>
    </g>
  );
};
const ShotB: React.FC = () => {
  const f = useCurrentFrame();
  const cam = useCam([{ at: 0, z: 1.02, x: 20, y: 30 }, { at: SHOT * 0.55, z: 1.1, x: 40, y: 0 }, { at: SHOT, z: 1.15, x: 50, y: -10 }], { ox: 1000, oy: 500 });
  const talk = Math.floor(f / 6) % 3 !== 0;
  return (
    <Cine cam={cam}>
      <Plane depth={0.75} blur={1.4} html>
        <LabScreen screen={<ScreenContent />} />
      </Plane>
      <Plane depth={0.8}>
        <BloomDefs id="sglow" r={40} />
        <rect x={700} y={150} width={1100} height={600} rx={14} fill="#3FE0E8" opacity={0.10 + 0.03 * Math.sin(f / 9)} filter="url(#sglow)" />
        <GodRays x={1250} y={450} c="#7FE8FF" n={10} len={1300} o={0.05} spread={Math.PI * 0.9} dir={Math.PI} />
      </Plane>
      <Plane depth={0.95} blur={0.6}><Dust seed={7} n={45} c="#BFF6FF" size={2.6} o={0.5} rise={0.15} /></Plane>
      <Plane depth={1.05}>
        <DocV2 x={420} y={1260} s={1.0} f={f} talk={talk} pose="point" expr={f > 130 ? "surprised" : "neutral"} />
        <rect x={0} y={0} width={W} height={H} fill="#7FE8FF" opacity={0.05} style={{ mixBlendMode: "screen" }} />
      </Plane>
      <Grade warm="#FFB070" cool="#1A3A7A" vig={0.6} leak={0.06} />
    </Cine>
  );
};

// C. Ponzo: dolly down the tracks into fog, bars glow, ruler sweeps
const ShotC: React.FC = () => {
  const f = useCurrentFrame();
  const cam = useCam([{ at: 0, z: 0.98, x: 0, y: 60 }, { at: 150, z: 1.1, x: 0, y: 10 }, { at: SHOT, z: 1.22, x: 0, y: -20 }], { ox: W / 2, oy: 420, drift: 0.6 });
  return (
    <Cine cam={cam}>
      <Plane depth={0.05}>
        <defs><linearGradient id="csC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A0B3D" /><stop offset="0.6" stopColor="#6A2A7A" /><stop offset="1" stopColor="#E07A6A" /></linearGradient></defs>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#csC)" />
        <Stars seed={12} n={60} y1={420} o={0.7} />
        <GodRays x={W / 2} y={170} c="#FFC890" n={12} len={1300} o={0.06} />
      </Plane>
      <Plane depth={0.2} blur={4}><Haze y={240} h={320} c="#F0A0A0" o={0.6} /></Plane>
      <Plane depth={1}>
        <BloomDefs id="pb" r={14} />
        <g filter="url(#pb)"><Ponzo x={W / 2} y={560} s={1.15} measure={lerp(f, 110, 220, 0.001, 1, Easing.inOut(Easing.cubic))} /></g>
      </Plane>
      <Plane depth={0.6} blur={2}><Haze y={330} h={260} c="#E8A0B0" o={0.45} /></Plane>
      <Plane depth={1.3} blur={1}><Dust seed={5} n={40} c="#FFD0C0" size={3} o={0.4} rise={0.2} /></Plane>
      <Plane depth={1.8} blur={10}>
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 220 - 100} ${H + 100} q 20 -${120 + (i % 3) * 40} ${-10 + (i % 2) * 30} -${240 + (i % 4) * 30}`} stroke="#2A1A3A" strokeWidth={26} strokeLinecap="round" fill="none" />)}
      </Plane>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", paddingTop: 70 }}>
        <div style={{ fontFamily: "Arial Black", fontSize: 96, color: "#FFD23F", textShadow: "0 8px 0 #2A0F5A, 0 0 40px rgba(255,210,63,0.6)", opacity: lerp(f, 220, 236, 0, 1), transform: `scale(${lerp(f, 220, 236, 1.6, 1, Easing.out(Easing.back(1.6)))})` }}>SAME LENGTH</div>
      </AbsoluteFill>
      <Grade warm="#FF9A6A" cool="#3A1A6A" vig={0.6} leak={0.12} />
    </Cine>
  );
};

export const CINE_FRAMES = SHOT * 3;
export const CinemaTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {[ShotA, ShotB, ShotC].map((S, i) => (
      <Sequence key={i} from={i * SHOT} durationInFrames={SHOT}>
        <S />
        {i > 0 && <ZoomIn />}
      </Sequence>
    ))}
  </AbsoluteFill>
);
