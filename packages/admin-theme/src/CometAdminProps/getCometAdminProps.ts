import { ComponentsProps } from "@material-ui/core/styles/props";

import { getCometAdminClearInputButtonProps } from "./clearInputButton";
import { getCometAdminErrorBoundaryProps } from "./errorBoundary";
import { getCometAdminMasterLayoutProps } from "./masterLayout";
import { getCometAdminMenuProps } from "./menu";
import { getCometAdminMenuCollapsibleItemProps } from "./menuCollapsibleItem";
import { getCometAdminStackBackButtonProps } from "./stackBackButton";
import { getCometAdminStackBreadcrumbsProps } from "./stackBreadcrumbs";
import { getCometAdminToolbarProps } from "./toolbar";
import { getCometAdminToolbarAutomaticTitleItemProps } from "./toolbarAutomaticTitleItem";
import { getCometAdminToolbarBackButtonProps } from "./toolbarBackButton";
import { getCometAdminToolbarBreadcrumbsProps } from "./toolbarBreadcrumbs";
import { getCometAdminFinalFormSearchTextFieldProps } from "./toolbarFinalFormSearchTextField";
import { getCometAdminToolbarTitleItemProps } from "./toolbarTitleItem";

export const getCometAdminProps = (): ComponentsProps => ({
    CometAdminMenu: getCometAdminMenuProps(),
    CometAdminMenuCollapsibleItem: getCometAdminMenuCollapsibleItemProps(),
    CometAdminMasterLayout: getCometAdminMasterLayoutProps(),
    CometAdminErrorBoundary: getCometAdminErrorBoundaryProps(),
    CometAdminStackBreadcrumbs: getCometAdminStackBreadcrumbsProps(),
    CometAdminStackBackButton: getCometAdminStackBackButtonProps(),
    CometAdminClearInputButton: getCometAdminClearInputButtonProps(),
    CometAdminToolbar: getCometAdminToolbarProps(),
    CometAdminToolbarBackButton: getCometAdminToolbarBackButtonProps(),
    CometAdminToolbarTitleItem: getCometAdminToolbarTitleItemProps(),
    CometAdminToolbarAutomaticTitleItem: getCometAdminToolbarAutomaticTitleItemProps(),
    CometAdminToolbarBreadcrumbs: getCometAdminToolbarBreadcrumbsProps(),
    CometAdminFinalFormSearchTextField: getCometAdminFinalFormSearchTextFieldProps(),
});
