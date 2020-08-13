import { VPAdminInputClassKeys } from "./Input";

declare module "@material-ui/core/styles/overrides" {
    // tslint:disable-next-line:interface-name
    interface ComponentNameToClassKey {
        VPAdminInputBase: VPAdminInputClassKeys;
    }
}
