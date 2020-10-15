import { IVPAdminColorPickerProps } from "./core/ColorPicker";
import { VPAdminColorPickerClassKeys } from "./core/ColorPicker.styles";

declare module "@material-ui/core/styles/overrides" {
    // tslint:disable-next-line:interface-name
    interface ComponentNameToClassKey {
        VPAdminColorPicker: VPAdminColorPickerClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    // tslint:disable-next-line:interface-name
    interface ComponentsPropsList {
        VPAdminColorPicker: IVPAdminColorPickerProps;
    }
}
