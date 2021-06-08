import { Palette } from "@material-ui/core/styles/createPalette";
import { Overrides } from "@material-ui/core/styles/overrides";

import { getClearInputButtonOverrides } from "./clearInputButton";
import { getErrorBoundaryOverrides } from "./errorBoundary";
import { getFinalFormSearchTextFieldOverrides } from "./finalFormSearchTextField";
import { getFormFieldContainerOverrides } from "./formFieldContainer";
import { getFormPaperOverrides } from "./formPaper";
import { getInputBaseOverrides } from "./inputBase";
import { getMainContentOverrides } from "./maincontent";
import { getMasterLayoutOverrides } from "./masterLayout";
import { getMenuOverrides } from "./menu";
import { getMenuCollapsibleItemOverrides } from "./menuCollapsibleItem";
import { getMenuItemOverrides } from "./menuItem";
import { getSaveButtonOverrides } from "./saveButton";
import { getStackBreadcrumbsOverrides } from "./stackBreadcrumbs";
import { getTableBodyRowOverrides } from "./tableBodyRow";
import { getToolbarOverrides } from "./toolbar";
import { getToolbarActionsOverrides } from "./toolbaractions";
import { getToolbarBackButtonOverrides } from "./toolbarbackbutton";
import { getToolbarBreadcrumbsOverrides } from "./toolbarBreadcrumbs";
import { getToolbarFillSpaceOverrides } from "./toolbarfillspace";
import { getToolbarItemOverrides } from "./toolbaritem";

export const getAdminOverrides = (palette: Palette): Overrides => ({
    CometAdminClearInputButton: getClearInputButtonOverrides(),
    CometAdminFormFieldContainer: getFormFieldContainerOverrides(palette),
    CometAdminMenu: getMenuOverrides(),
    CometAdminMenuItem: getMenuItemOverrides(palette),
    CometAdminMenuCollapsibleItem: getMenuCollapsibleItemOverrides(palette),
    CometAdminMainContent: getMainContentOverrides(),
    CometAdminMasterLayout: getMasterLayoutOverrides(palette),
    CometAdminToolbar: getToolbarOverrides(),
    CometAdminToolbarBackButton: getToolbarBackButtonOverrides(),
    CometAdminToolbarBreadcrumbs: getToolbarBreadcrumbsOverrides(),
    CometAdminToolbarItem: getToolbarItemOverrides(palette),
    CometAdminToolbarFillSpace: getToolbarFillSpaceOverrides(),
    CometAdminToolbarActions: getToolbarActionsOverrides(),
    CometAdminInputBase: getInputBaseOverrides(palette),
    CometAdminFinalFormSearchTextField: getFinalFormSearchTextFieldOverrides(),
    CometAdminErrorBoundary: getErrorBoundaryOverrides(),
    CometAdminStackBreadcrumbs: getStackBreadcrumbsOverrides(palette),
    CometAdminTableBodyRow: getTableBodyRowOverrides(),
    CometAdminSaveButton: getSaveButtonOverrides(),
    CometAdminFormPaper: getFormPaperOverrides(),
});
