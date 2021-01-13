import { IVPAdminSelectProps } from "./ReactSelect";
import { VPAdminSelectClassKeys } from "./ReactSelect.styles";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        VPAdminSelect: VPAdminSelectClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        VPAdminSelect: IVPAdminSelectProps<any>;
    }
}
