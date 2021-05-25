import { Overrides } from "@material-ui/core/styles/overrides";

import { getCometAdminRteBlockTypeControlsOverrides } from "./blockTypeControls";
import { getCometAdminRteControlButtonOverrides } from "./controlButton";
import { getCometAdminRteFeaturesButtonGroupOverrides } from "./featuresButtonGroup";
import { getCometAdminRteLinkControlsOverrides } from "./linkControls";
import { getCometAdminRteRteOverrides } from "./rte";
import { getCometAdminRteToolbarOverrides } from "./toolbar";

export const getCometAdminRteOverrides = (): Overrides => ({
    CometAdminRte: getCometAdminRteRteOverrides(),
    CometAdminRteToolbar: getCometAdminRteToolbarOverrides(),
    CometAdminRteControlButton: getCometAdminRteControlButtonOverrides(),
    CometAdminRteFeaturesButtonGroup: getCometAdminRteFeaturesButtonGroupOverrides(),
    CometAdminRteBlockTypeControls: getCometAdminRteBlockTypeControlsOverrides(),
    CometAdminRteLinkControls: getCometAdminRteLinkControlsOverrides(),
});
