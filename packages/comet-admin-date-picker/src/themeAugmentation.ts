import { TimePickerProps } from "./TimePicker";
import { CometAdminTimePickerClassKeys } from "./TimePicker.styles";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTimePicker: CometAdminTimePickerClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminTimePicker: TimePickerProps;
    }
}
