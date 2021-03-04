import { CometAdminSelectProps } from "./ReactSelect";
import { CometAdminSelectClassKeys } from "./ReactSelect.styles";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminSelect: CometAdminSelectClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminSelect: CometAdminSelectProps<any>;
    }
}
