import { Overrides } from "@material-ui/core/styles/overrides";

import { getCometAdminColorPickerOverrides as getColorPickerOverrides } from "./colorPicker";

export const getCometAdminColorPickerOverrides = (): Overrides => ({
    CometAdminColorPicker: getColorPickerOverrides(),
});
