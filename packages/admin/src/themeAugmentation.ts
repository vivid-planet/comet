import { ClearInputButtonThemeProps, CometAdminClearInputButtonClassKeys } from "./common/ClearInputButton";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: CometAdminClearInputButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonThemeProps;
    }
}
