import { Overrides } from "@material-ui/core/styles/overrides";

import { getColorPickerOverrides } from "./colorPicker";

export const getAdminColorPickerOverrides = (): Overrides => ({
    CometAdminColorPicker: getColorPickerOverrides(),
});
