import { CometAdminRteBlockTypeControlsClassKeys } from "./core/Controls/BlockTypesControls";
import { CometAdminRteControlButtonClassKeys } from "./core/Controls/ControlButton";
import { CometAdminRteFeaturesButtonGroupClassKeys } from "./core/Controls/FeaturesButtonGroup";
import { CometAdminRteLinkControlsClassKeys } from "./core/Controls/LinkControls";
import { CometAdminRteToolbarClassKeys } from "./core/Controls/Toolbar";
import { CometAdminRteClassKeys } from "./core/Rte";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRte: CometAdminRteClassKeys;
        CometAdminRteToolbar: CometAdminRteToolbarClassKeys;
        CometAdminRteControlButton: CometAdminRteControlButtonClassKeys;
        CometAdminRteFeaturesButtonGroup: CometAdminRteFeaturesButtonGroupClassKeys;
        CometAdminRteBlockTypeControls: CometAdminRteBlockTypeControlsClassKeys;
        CometAdminRteLinkControls: CometAdminRteLinkControlsClassKeys;
    }
}
