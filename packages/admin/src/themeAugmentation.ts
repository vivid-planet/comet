import { ClearInputButtonThemeProps, CometAdminClearInputButtonClassKeys } from "./common/buttons/clearinput/ClearInputButton";
import { CometAdminErrorBoundaryClassKeys, ErrorBoundaryThemeProps } from "./error/errorboundary/ErrorBoundary";
import { CometAdminFormFieldContainerClassKeys, FieldContainerThemeProps } from "./form/FieldContainer";
import { CometAdminFinalFormRangeInputClassKeys } from "./form/FinalFormRangeInput";
import { CometAdminFormPaperKeys } from "./form/FormPaper";
import { CometAdminFormSectionKeys } from "./form/FormSection";
import { CometAdminInputBaseClassKeys } from "./form/InputBase";
import { CometAdminMasterLayoutClassKeys, MasterLayoutThemeProps } from "./mui/MasterLayout";
import { CometAdminMenuCollapsibleItemClassKeys, MenuCollapsibleItemThemeProps } from "./mui/menu/CollapsibleItem";
import { CometAdminMenuItemClassKeys } from "./mui/menu/Item";
import { MenuThemeProps } from "./mui/menu/Menu";
import { CometAdminMenuClassKeys } from "./mui/menu/Menu.styles";

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
        CometAdminFinalFormRangeInput: CometAdminFinalFormRangeInputClassKeys;
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
    }
}
