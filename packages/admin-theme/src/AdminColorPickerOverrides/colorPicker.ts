import { CometAdminColorPickerClassKeys } from "@comet/admin-color-picker";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getColorPickerOverrides = (): StyleRules<{}, CometAdminColorPickerClassKeys> => ({
    root: {},
    fullWidth: {},
    input: {},
    inputInner: {},
    inputInnerLeftContent: {},
    popper: {},
    popperPaper: {},
    pickedColorWrapper: {},
    noColorStroke: {},
    pickedColorIndicator: {},
    saturationWrapper: {},
    saturationPointer: {},
    hueWrapper: {},
    hueSliderMarker: {},
    paletteWrapper: {},
    paletteItem: {},
    readOnlyInput: {},
});
