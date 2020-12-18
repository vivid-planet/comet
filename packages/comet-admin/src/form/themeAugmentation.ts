import { VPAdminInputClassKeys } from "./Input";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        VPAdminInputBase: VPAdminInputClassKeys;
    }
}
