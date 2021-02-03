import { ClearInputButtonThemeProps, CometAdminClearInputButtonClassKeys } from "./common/ClearInputButton";
import { CometAdminFormFieldContainerClassKeys, FieldContainerThemeProps } from "./form";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: CometAdminClearInputButtonClassKeys;
        CometAdminFormFieldContainer: CometAdminFormFieldContainerClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonThemeProps;
        CometAdminFormFieldContainer: FieldContainerThemeProps;
    }
}
