import { ClearInputButtonThemeProps, CometAdminClearInputButtonClassKeys } from "./common";
import { CometAdminErrorBoundaryClassKeys, ErrorBoundaryThemeProps } from "./error";
import {
    CometAdminFinalFormRangeInputClassKeys,
    CometAdminFormFieldContainerClassKeys,
    CometAdminFormPaperKeys,
    CometAdminFormSectionKeys,
    CometAdminInputBaseClassKeys,
    FieldContainerThemeProps,
} from "./form";
import {
    CometAdminBreadcrumbsClassKeys,
    CometAdminBreadcrumbsThemeProps,
    CometAdminMasterLayoutClassKeys,
    CometAdminMenuClassKeys,
    CometAdminMenuCollapsibleItemClassKeys,
    CometAdminMenuItemClassKeys,
    MasterLayoutThemeProps,
    MenuCollapsibleItemThemeProps,
    MenuThemeProps,
} from "./mui";
import { CometAdminFilterBarClassKeys } from "./table";
import { CometAdminFilterBarPopoverFilterClassKeys, FilterBarPopoverFilterThemeProps } from "./table/filterbar/FilterBarPopoverFilter";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: CometAdminClearInputButtonClassKeys;
        CometAdminFormFieldContainer: CometAdminFormFieldContainerClassKeys;
        CometAdminMenu: CometAdminMenuClassKeys;
        CometAdminMenuItem: CometAdminMenuItemClassKeys;
        CometAdminMenuCollapsibleItem: CometAdminMenuCollapsibleItemClassKeys;
        CometAdminMasterLayout: CometAdminMasterLayoutClassKeys;
        CometAdminInputBase: CometAdminInputBaseClassKeys;
        CometAdminErrorBoundary: CometAdminErrorBoundaryClassKeys;
        CometAdminFormPaper: CometAdminFormPaperKeys;
        CometAdminFormSection: CometAdminFormSectionKeys;
        CometAdminBreadcrumbs: CometAdminBreadcrumbsClassKeys;
        CometAdminFinalFormRangeInput: CometAdminFinalFormRangeInputClassKeys;
        CometAdminFilterBar: CometAdminFilterBarClassKeys;
        CometAdminFilterBarPopoverFilter: CometAdminFilterBarPopoverFilterClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonThemeProps;
        CometAdminFormFieldContainer: FieldContainerThemeProps;
        CometAdminMenu: MenuThemeProps;
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemThemeProps;
        CometAdminMasterLayout: MasterLayoutThemeProps;
        CometAdminErrorBoundary: ErrorBoundaryThemeProps;
        CometAdminBreadcrumbs: CometAdminBreadcrumbsThemeProps;
        CometAdminFilterBarPopoverFilter: FilterBarPopoverFilterThemeProps;
    }
}
