import { Overrides } from "@material-ui/core/styles/overrides";

import { getRteBlockTypeControlsOverrides } from "./blockTypeControls";
import { getRteControlButtonOverrides } from "./controlButton";
import { getRteFeaturesButtonGroupOverrides } from "./featuresButtonGroup";
import { getRteLinkControlsOverrides } from "./linkControls";
import { getRteRteOverrides } from "./rte";
import { getRteToolbarOverrides } from "./toolbar";

export const getAdminRteOverrides = (): Overrides => ({
    CometAdminRte: getRteRteOverrides(),
    CometAdminRteToolbar: getRteToolbarOverrides(),
    CometAdminRteControlButton: getRteControlButtonOverrides(),
    CometAdminRteFeaturesButtonGroup: getRteFeaturesButtonGroupOverrides(),
    CometAdminRteBlockTypeControls: getRteBlockTypeControlsOverrides(),
    CometAdminRteLinkControls: getRteLinkControlsOverrides(),
});
