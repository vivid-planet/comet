import { ComponentsProps } from "@material-ui/core/styles/props";

import { getClearInputButtonProps } from "./clearInputButton";
import { getErrorBoundaryProps } from "./errorBoundary";
import { getFormButtonsProps } from "./formButtons";
import { getMasterLayoutProps } from "./masterLayout";
import { getMenuProps } from "./menu";
import { getMenuCollapsibleItemProps } from "./menuCollapsibleItem";
import { getSaveButtonProps } from "./saveSplitButton";
import { getSplitButtonProps } from "./splitButton";
import { getStackBackButtonProps } from "./stackBackButton";
import { getStackBreadcrumbsProps } from "./stackBreadcrumbs";
import { getToolbarProps } from "./toolbar";
import { getToolbarAutomaticTitleItemProps } from "./toolbarAutomaticTitleItem";
import { getToolbarBackButtonProps } from "./toolbarBackButton";
import { getToolbarBreadcrumbsProps } from "./toolbarBreadcrumbs";
import { getFinalFormSearchTextFieldProps } from "./toolbarFinalFormSearchTextField";
import { getToolbarTitleItemProps } from "./toolbarTitleItem";

export const getAdminProps = (): ComponentsProps => ({
    CometAdminMenu: getMenuProps(),
    CometAdminMenuCollapsibleItem: getMenuCollapsibleItemProps(),
    CometAdminMasterLayout: getMasterLayoutProps(),
    CometAdminErrorBoundary: getErrorBoundaryProps(),
    CometAdminStackBreadcrumbs: getStackBreadcrumbsProps(),
    CometAdminFormButtons: getFormButtonsProps(),
    CometAdminStackBackButton: getStackBackButtonProps(),
    CometAdminClearInputButton: getClearInputButtonProps(),
    CometAdminToolbar: getToolbarProps(),
    CometAdminToolbarBackButton: getToolbarBackButtonProps(),
    CometAdminToolbarTitleItem: getToolbarTitleItemProps(),
    CometAdminToolbarAutomaticTitleItem: getToolbarAutomaticTitleItemProps(),
    CometAdminToolbarBreadcrumbs: getToolbarBreadcrumbsProps(),
    CometAdminFinalFormSearchTextField: getFinalFormSearchTextFieldProps(),
    CometAdminSaveButton: getSaveButtonProps(),
    CometAdminSplitButton: getSplitButtonProps(),
});
