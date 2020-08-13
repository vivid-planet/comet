import { IVPAdminSelectProps } from "./Select";
import { VPAdminSelectClassKeys } from "./Select.styles";

declare module "@material-ui/core/styles/overrides" {
    // tslint:disable-next-line:interface-name
    interface ComponentNameToClassKey {
        VPAdminSelect: VPAdminSelectClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    // tslint:disable-next-line:interface-name
    interface ComponentsPropsList {
        VPAdminSelect: IVPAdminSelectProps<any>;
    }
}
