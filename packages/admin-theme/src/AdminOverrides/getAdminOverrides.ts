import { Overrides } from "@material-ui/core/styles/overrides";

import { getClearInputButtonOverrides } from "./clearInputButton";
import { getErrorBoundaryOverrides } from "./errorBoundary";
import { getFinalFormSearchTextFieldOverrides } from "./finalFormSearchTextField";
import { getFormFieldContainerOverrides } from "./formFieldContainer";
import { getInputBaseOverrides } from "./inputBase";
import { getMainContentOverrides } from "./maincontent";
import { getMasterLayoutOverrides } from "./masterLayout";
import { getMenuOverrides } from "./menu";
import { getMenuCollapsibleItemOverrides } from "./menuCollapsibleItem";
import { getMenuItemOverrides } from "./menuItem";
import { getStackBreadcrumbsOverrides } from "./stackBreadcrumbs";
import { getToolbarOverrides } from "./toolbar";
import { getToolbarActionsOverrides } from "./toolbaractions";
import { getToolbarBackButtonOverrides } from "./toolbarbackbutton";
import { getToolbarBreadcrumbsOverrides } from "./toolbarBreadcrumbs";
import { getToolbarFillSpaceOverrides } from "./toolbarfillspace";
import { getToolbarItemOverrides } from "./toolbaritem";

export const getAdminOverrides = (): Overrides => ({
    CometAdminClearInputButton: getClearInputButtonOverrides(),
    CometAdminFormFieldContainer: getFormFieldContainerOverrides(),
    CometAdminMenu: getMenuOverrides(),
    CometAdminMenuItem: getMenuItemOverrides(),
    CometAdminMenuCollapsibleItem: getMenuCollapsibleItemOverrides(),
    CometAdminMainContent: getMainContentOverrides(),
    CometAdminMasterLayout: getMasterLayoutOverrides(),
    CometAdminToolbar: getToolbarOverrides(),
    CometAdminToolbarBackButton: getToolbarBackButtonOverrides(),
    CometAdminToolbarBreadcrumbs: getToolbarBreadcrumbsOverrides(),
    CometAdminToolbarItem: getToolbarItemOverrides(),
    CometAdminToolbarFillSpace: getToolbarFillSpaceOverrides(),
    CometAdminToolbarActions: getToolbarActionsOverrides(),
    CometAdminInputBase: getInputBaseOverrides(),
    CometAdminFinalFormSearchTextField: getFinalFormSearchTextFieldOverrides(),
    CometAdminErrorBoundary: getErrorBoundaryOverrides(),
    CometAdminStackBreadcrumbs: getStackBreadcrumbsOverrides(),
});
