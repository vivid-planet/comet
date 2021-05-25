import { Overrides } from "@material-ui/core/styles/overrides";

import { getCometAdminClearInputButtonOverrides } from "./clearInputButton";
import { getCometAdminErrorBoundaryOverrides } from "./errorBoundary";
import { getCometAdminFinalFormSearchTextFieldOverrides } from "./finalFormSearchTextField";
import { getCometAdminFormFieldContainerOverrides } from "./formFieldContainer";
import { getCometAdminInputBaseOverrides } from "./inputBase";
import { getCometAdminMainContentOverrides } from "./maincontent";
import { getCometAdminMasterLayoutOverrides } from "./masterLayout";
import { getCometAdminMenuOverrides } from "./menu";
import { getCometAdminMenuCollapsibleItemOverrides } from "./menuCollapsibleItem";
import { getCometAdminMenuItemOverrides } from "./menuItem";
import { getCometAdminStackBreadcrumbsOverrides } from "./stackBreadcrumbs";
import { getCometAdminToolbarOverrides } from "./toolbar";
import { getCometAdminToolbarActionsOverrides } from "./toolbaractions";
import { getCometAdminToolbarBackButtonOverrides } from "./toolbarbackbutton";
import { getCometAdminToolbarBreadcrumbsOverrides } from "./toolbarBreadcrumbs";
import { getCometAdminToolbarFillSpaceOverrides } from "./toolbarfillspace";
import { getCometAdminToolbarItemOverrides } from "./toolbaritem";

export const getCometAdminOverrides = (): Overrides => ({
    CometAdminClearInputButton: getCometAdminClearInputButtonOverrides(),
    CometAdminFormFieldContainer: getCometAdminFormFieldContainerOverrides(),
    CometAdminMenu: getCometAdminMenuOverrides(),
    CometAdminMenuItem: getCometAdminMenuItemOverrides(),
    CometAdminMenuCollapsibleItem: getCometAdminMenuCollapsibleItemOverrides(),
    CometAdminMainContent: getCometAdminMainContentOverrides(),
    CometAdminMasterLayout: getCometAdminMasterLayoutOverrides(),
    CometAdminToolbar: getCometAdminToolbarOverrides(),
    CometAdminToolbarBackButton: getCometAdminToolbarBackButtonOverrides(),
    CometAdminToolbarBreadcrumbs: getCometAdminToolbarBreadcrumbsOverrides(),
    CometAdminToolbarItem: getCometAdminToolbarItemOverrides(),
    CometAdminToolbarFillSpace: getCometAdminToolbarFillSpaceOverrides(),
    CometAdminToolbarActions: getCometAdminToolbarActionsOverrides(),
    CometAdminInputBase: getCometAdminInputBaseOverrides(),
    CometAdminFinalFormSearchTextField: getCometAdminFinalFormSearchTextFieldOverrides(),
    CometAdminErrorBoundary: getCometAdminErrorBoundaryOverrides(),
    CometAdminStackBreadcrumbs: getCometAdminStackBreadcrumbsOverrides(),
});
