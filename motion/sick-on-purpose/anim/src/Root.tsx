import React from "react";
import { Composition } from "remotion";
import { COLD_OPEN_DUR, ColdOpen } from "./ColdOpen";
import { H, W } from "./kit";
import { Duo } from "./Duo";
import { Avatar, Banner } from "./Brand";
import { Episode, EPISODE_FRAMES } from "./Episode";
import { DocBaseline, DocCompare } from "./Baseline";
import { DocExprSheet } from "./DocSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ColdOpen" component={ColdOpen} durationInFrames={COLD_OPEN_DUR.reduce((a, b) => a + b, 0)} fps={30} width={W} height={H} />
    <Composition id="Duo" component={Duo} durationInFrames={60} fps={30} width={W} height={H} />
    <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Episode" component={Episode} durationInFrames={EPISODE_FRAMES} fps={30} width={W} height={H} />
    <Composition id="DocBaseline" component={DocBaseline} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="DocCompare" component={DocCompare} durationInFrames={1} fps={30} width={2160} height={1350} />
    <Composition id="DocExprSheet" component={DocExprSheet} durationInFrames={1} fps={30} width={1800} height={1360} />
  </>
);
