import { ClearInputButtonThemeProps, CometAdminClearInputButtonClassKeys } from "./common";
import { CometAdminFormFieldContainerClassKeys, CometAdminInputBaseClassKeys, FieldContainerThemeProps } from "./form";
import {
    CometAdminMasterLayoutClassKeys,
    CometAdminMenuClassKeys,
    CometAdminMenuCollapsibleItemClassKeys,
    CometAdminMenuItemClassKeys,
    MasterLayoutThemeProps,
    MenuCollapsibleItemThemeProps,
    MenuThemeProps,
} from "./mui";
import { CometAdminFilterBarClassKeys, CometAdminFilterBarPopOverFormFieldClassKeys } from "./table";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: CometAdminClearInputButtonClassKeys;
        CometAdminFormFieldContainer: CometAdminFormFieldContainerClassKeys;
        CometAdminMenu: CometAdminMenuClassKeys;
        CometAdminMenuItem: CometAdminMenuItemClassKeys;
        CometAdminMenuCollapsibleItem: CometAdminMenuCollapsibleItemClassKeys;
        CometAdminMasterLayout: CometAdminMasterLayoutClassKeys;
        CometAdminInputBase: CometAdminInputBaseClassKeys;
        CometAdminFilterBar: CometAdminFilterBarClassKeys;
        CometAdminFilterBarPopOverFormField: CometAdminFilterBarPopOverFormFieldClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonThemeProps;
        CometAdminFormFieldContainer: FieldContainerThemeProps;
        CometAdminMenu: MenuThemeProps;
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemThemeProps;
        CometAdminMasterLayout: MasterLayoutThemeProps;
    }
}
