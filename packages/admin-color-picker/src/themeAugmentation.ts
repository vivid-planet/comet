import { ColorPickerThemeProps } from "./core/ColorPicker";
import { CometAdminColorPickerClassKeys } from "./core/ColorPicker.styles";

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminColorPicker: ColorPickerThemeProps;
    }
}

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminColorPicker: CometAdminColorPickerClassKeys;
    }
}
