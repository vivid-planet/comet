import type {} from "@comet/admin-color-picker/src/themeAugmentation";
import type {} from "@comet/admin-react-select/src/themeAugmentation";
import type {} from "@comet/admin-rte/src/themeAugmentation";
import type {} from "@comet/admin/src/themeAugmentation";
import { ThemeOptions } from "@material-ui/core/styles";

import { cometAdminColorPickerOverrides } from "./cometAdminColorPickerOverrides/colorPicker";
import { cometAdminClearInputButtonOverrides } from "./cometAdminOverrides/clearInputButton";
import { cometAdminErrorBoundaryOverrides } from "./cometAdminOverrides/errorBoundary";
import { cometAdminFinalFormSearchTextFieldOverrides } from "./cometAdminOverrides/finalFormSearchTextField";
import { cometAdminFormFieldContainerOverrides } from "./cometAdminOverrides/formFieldContainer";
import { cometAdminInputBaseOverrides } from "./cometAdminOverrides/inputBase";
import { cometAdminMainContentOverrides } from "./cometAdminOverrides/maincontent";
import { cometAdminMasterLayoutOverrides } from "./cometAdminOverrides/masterLayout";
import { cometAdminMenuOverrides } from "./cometAdminOverrides/menu";
import { cometAdminMenuCollapsibleItemOverrides } from "./cometAdminOverrides/menuCollapsibleItem";
import { cometAdminMenuItemOverrides } from "./cometAdminOverrides/menuItem";
import { cometAdminStackBreadcrumbsOverrides } from "./cometAdminOverrides/stackBreadcrumbs";
import { cometAdminToolbarOverrides } from "./cometAdminOverrides/toolbar";
import { cometAdminToolbarActionsOverrides } from "./cometAdminOverrides/toolbaractions";
import { cometAdminToolbarBackButtonOverrides } from "./cometAdminOverrides/toolbarbackbutton";
import { cometAdminToolbarBreadcrumbsOverrides } from "./cometAdminOverrides/toolbarBreadcrumbs";
import { cometAdminToolbarFillSpaceOverrides } from "./cometAdminOverrides/toolbarfillspace";
import { cometAdminToolbarItemOverrides } from "./cometAdminOverrides/toolbaritem";
import { cometAdminClearInputButtonProps } from "./cometAdminProps/clearInputButton";
import { cometAdminErrorBoundaryProps } from "./cometAdminProps/errorBoundary";
import { cometAdminMasterLayoutProps } from "./cometAdminProps/masterLayout";
import { cometAdminMenuProps } from "./cometAdminProps/menu";
import { cometAdminMenuCollapsibleItemProps } from "./cometAdminProps/menuCollapsibleItem";
import { cometAdminStackBackButtonProps } from "./cometAdminProps/stackBackButton";
import { cometAdminStackBreadcrumbsProps } from "./cometAdminProps/stackBreadcrumbs";
import { cometAdminToolbarProps } from "./cometAdminProps/toolbar";
import { cometAdminToolbarAutomaticTitleItemProps } from "./cometAdminProps/toolbarAutomaticTitleItem";
import { cometAdminToolbarBackButtonProps } from "./cometAdminProps/toolbarBackButton";
import { cometAdminToolbarBreadcrumbsProps } from "./cometAdminProps/toolbarBreadcrumbs";
import { cometAdminFinalFormSearchTextFieldProps } from "./cometAdminProps/toolbarFinalFormSearchTextField";
import { cometAdminToolbarTitleItemProps } from "./cometAdminProps/toolbarTitleItem";
import { cometAdminRteBlockTypeControlsOverrides } from "./cometAdminRteOverrides/blockTypeControls";
import { cometAdminRteControlButtonOverrides } from "./cometAdminRteOverrides/controlButton";
import { cometAdminRteFeaturesButtonGroupOverrides } from "./cometAdminRteOverrides/featuresButtonGroup";
import { cometAdminRteLinkControlsOverrides } from "./cometAdminRteOverrides/linkControls";
import { cometAdminRteRteOverrides } from "./cometAdminRteOverrides/rte";
import { cometAdminRteToolbarOverrides } from "./cometAdminRteOverrides/toolbar";
import { cometAdminSelectOverrides } from "./cometAdminSelectOverrides/select";
import getMuiOverrides from "./MuiOverrides";
import getMuiProps from "./MuiProps";
import { paletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { typographyOptions } from "./typographyOptions";

export default (): ThemeOptions => ({
    spacing: 5,
    palette: paletteOptions,
    typography: typographyOptions,
    shape: {
        borderRadius: 2,
    },
    shadows,
    props: {
        CometAdminMenu: cometAdminMenuProps(),
        CometAdminMenuCollapsibleItem: cometAdminMenuCollapsibleItemProps(),
        CometAdminMasterLayout: cometAdminMasterLayoutProps(),
        CometAdminErrorBoundary: cometAdminErrorBoundaryProps(),
        CometAdminStackBreadcrumbs: cometAdminStackBreadcrumbsProps(),
        CometAdminStackBackButton: cometAdminStackBackButtonProps(),
        CometAdminClearInputButton: cometAdminClearInputButtonProps(),
        ...getMuiProps(),
        CometAdminToolbar: cometAdminToolbarProps(),
        CometAdminToolbarBackButton: cometAdminToolbarBackButtonProps(),
        CometAdminToolbarTitleItem: cometAdminToolbarTitleItemProps(),
        CometAdminToolbarAutomaticTitleItem: cometAdminToolbarAutomaticTitleItemProps(),
        CometAdminToolbarBreadcrumbs: cometAdminToolbarBreadcrumbsProps(),
        CometAdminFinalFormSearchTextField: cometAdminFinalFormSearchTextFieldProps(),
    },
    overrides: {
        CometAdminClearInputButton: cometAdminClearInputButtonOverrides(),
        CometAdminFormFieldContainer: cometAdminFormFieldContainerOverrides(),
        CometAdminMenu: cometAdminMenuOverrides(),
        CometAdminMenuItem: cometAdminMenuItemOverrides(),
        CometAdminMenuCollapsibleItem: cometAdminMenuCollapsibleItemOverrides(),
        CometAdminMainContent: cometAdminMainContentOverrides(),
        CometAdminMasterLayout: cometAdminMasterLayoutOverrides(),
        CometAdminToolbar: cometAdminToolbarOverrides(),
        CometAdminToolbarBackButton: cometAdminToolbarBackButtonOverrides(),
        CometAdminToolbarBreadcrumbs: cometAdminToolbarBreadcrumbsOverrides(),
        CometAdminToolbarItem: cometAdminToolbarItemOverrides(),
        CometAdminToolbarFillSpace: cometAdminToolbarFillSpaceOverrides(),
        CometAdminToolbarActions: cometAdminToolbarActionsOverrides(),
        CometAdminInputBase: cometAdminInputBaseOverrides(),
        CometAdminFinalFormSearchTextField: cometAdminFinalFormSearchTextFieldOverrides(),

        /*RTE*/
        CometAdminRte: cometAdminRteRteOverrides(),
        CometAdminRteToolbar: cometAdminRteToolbarOverrides(),
        CometAdminRteControlButton: cometAdminRteControlButtonOverrides(),
        CometAdminRteFeaturesButtonGroup: cometAdminRteFeaturesButtonGroupOverrides(),
        CometAdminRteBlockTypeControls: cometAdminRteBlockTypeControlsOverrides(),
        CometAdminRteLinkControls: cometAdminRteLinkControlsOverrides(),

        /*Select*/
        CometAdminSelect: cometAdminSelectOverrides(),

        /* Color Picker*/
        CometAdminColorPicker: cometAdminColorPickerOverrides(),
        CometAdminErrorBoundary: cometAdminErrorBoundaryOverrides(),
        CometAdminStackBreadcrumbs: cometAdminStackBreadcrumbsOverrides(),
        ...getMuiOverrides(),
    },
});
