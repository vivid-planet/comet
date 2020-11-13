import { VPAdminColorPickerClassKeys } from "./core/ColorPicker.styles";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        VPAdminColorPicker: VPAdminColorPickerClassKeys;
    }
}
