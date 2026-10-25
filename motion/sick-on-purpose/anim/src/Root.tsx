import React from "react";
import { Composition } from "remotion";
import { COLD_OPEN_DUR, ColdOpen } from "./ColdOpen";
import { H, W } from "./kit";
import { Duo } from "./Duo";
import { Avatar, Banner } from "./Brand";
import { Episode, EPISODE_FRAMES } from "./Episode";
import { DocBaseline, DocCompare } from "./Baseline";
import { DocExprSheet, DocPoseSheet } from "./DocSheet";
import { AvatarSheet } from "./AvatarSheet";
import { ObjectSheet } from "./ObjectSheet";
import { PrevLabBench, PrevLabScreen, PrevLabWide } from "./SetPreviews";
import { LANDSCAPE_NAMES, LandscapePreview } from "./LandscapeSheet";
import { INTERIOR_NAMES, InteriorPreview } from "./InteriorPreview";
import { URBAN_NAMES, UrbanPreview } from "./UrbanPreview";
import { AnatomySheet } from "./AnatomySheet";
import { MoonSheet } from "./MoonSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ColdOpen" component={ColdOpen} durationInFrames={COLD_OPEN_DUR.reduce((a, b) => a + b, 0)} fps={30} width={W} height={H} />
    <Composition id="Duo" component={Duo} durationInFrames={60} fps={30} width={W} height={H} />
    <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Episode" component={Episode} durationInFrames={EPISODE_FRAMES} fps={30} width={W} height={H} />
    <Composition id="DocBaseline" component={DocBaseline} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="DocCompare" component={DocCompare} durationInFrames={1} fps={30} width={2160} height={1350} />
    <Composition id="DocExprSheet" component={DocExprSheet} durationInFrames={1} fps={30} width={2400} height={1360} />
    <Composition id="DocPoseSheet" component={DocPoseSheet} durationInFrames={1} fps={30} width={2400} height={2000} />
    <Composition id="AvatarSheet" component={AvatarSheet} durationInFrames={1} fps={30} width={2600} height={2000} />
    <Composition id="ObjectSheet" component={ObjectSheet} durationInFrames={1} fps={30} width={3200} height={2200} />
    <Composition id="ObjectSheet2" component={ObjectSheet} defaultProps={{ from: 50, scale: 0.46 }} durationInFrames={1} fps={30} width={3200} height={2200} />
    <Composition id="ObjectSheet3" component={ObjectSheet} defaultProps={{ from: 100, scale: 0.5 }} durationInFrames={1} fps={30} width={3200} height={2200} />
    <Composition id="SetLabWide" component={PrevLabWide} durationInFrames={90} fps={30} width={W} height={H} />
    <Composition id="SetLabBench" component={PrevLabBench} durationInFrames={90} fps={30} width={W} height={H} />
    <Composition id="SetLabScreen" component={PrevLabScreen} durationInFrames={90} fps={30} width={W} height={H} />
    {LANDSCAPE_NAMES.map((n) => <Composition key={n} id={`Land${n}`} component={LandscapePreview} defaultProps={{ name: n }} durationInFrames={90} fps={30} width={W} height={H} />)}
    {INTERIOR_NAMES.map((n) => <Composition key={n} id={`Room${n}`} component={InteriorPreview} defaultProps={{ name: n }} durationInFrames={90} fps={30} width={W} height={H} />)}
    {URBAN_NAMES.map((n) => <Composition key={n} id={`Urban${n}`} component={UrbanPreview} defaultProps={{ name: n }} durationInFrames={90} fps={30} width={W} height={H} />)}
    <Composition id="MoonSheet" component={MoonSheet} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="AnatomySheet" component={AnatomySheet} durationInFrames={90} fps={30} width={2800} height={1400} />
  </>
);
