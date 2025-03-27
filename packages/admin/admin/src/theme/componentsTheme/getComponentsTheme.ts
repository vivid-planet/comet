import { type Breakpoints, type ComponentNameToClassKey, type ThemeOptions } from "@mui/material";
import { type Components, type Palette } from "@mui/material/styles";
import { type TypographyVariants } from "@mui/material/styles/createTypography";
import { type Shadows } from "@mui/material/styles/shadows";
import { type ZIndex } from "@mui/material/styles/zIndex";
import { type Spacing } from "@mui/system";

import { getMuiAccordion } from "./MuiAccordion";
import { getMuiAlert } from "./MuiAlert";
import { getMuiAlertTitle } from "./MuiAlertTitle";
import { getMuiAppBar } from "./MuiAppBar";
import { getMuiAutocomplete } from "./MuiAutocomplete";
import { getMuiBadge } from "./MuiBadge";
import { getMuiButton } from "./MuiButton";
import { getMuiButtonGroup } from "./MuiButtonGroup";
import { getMuiCard } from "./MuiCard";
import { getMuiCardContent } from "./MuiCardContent";
import { getMuiCardHeader } from "./MuiCardHeader";
import { getMuiCheckbox } from "./MuiCheckbox";
import { getMuiChip } from "./MuiChip";
import { getMuiDataGrid } from "./MuiDataGrid";
import { getMuiDialog } from "./MuiDialog";
import { getMuiDialogActions } from "./MuiDialogActions";
import { getMuiDialogContent } from "./MuiDialogContent";
import { getMuiDialogContentText } from "./MuiDialogContentText";
import { getMuiDialogTitle } from "./MuiDialogTitle";
import { getMuiDrawer } from "./MuiDrawer";
import { getMuiFormControlLabel } from "./MuiFormControlLabel";
import { getMuiFormHelperText } from "./MuiFormHelperText";
import { getMuiFormLabel } from "./MuiFormLabel";
import { getMuiIconButton } from "./MuiIconButton";
import { getMuiInput } from "./MuiInput";
import { getMuiInputAdornment } from "./MuiInputAdornment";
import { getMuiInputBase } from "./MuiInputBase";
import { getMuiLinearProgress } from "./MuiLinearProgress";
import { getMuiLink } from "./MuiLink";
import { getMuiListItem } from "./MuiListItem";
import { getMuiListItemAvatar } from "./MuiListItemAvatar";
import { getMuiListItemIcon } from "./MuiListItemIcon";
import { getMuiMenu } from "./MuiMenu";
import { getMuiNativeSelect } from "./MuiNativeSelect";
import { getMuiPaper } from "./MuiPaper";
import { getMuiPopover } from "./MuiPopover";
import { getMuiRadio } from "./MuiRadio";
import { getMuiSelect } from "./MuiSelect";
import { getMuiSvgIcon } from "./MuiSvgIcon";
import { getMuiSwitch } from "./MuiSwitch";
import { getMuiTab } from "./MuiTab";
import { getMuiTableCell } from "./MuiTableCell";
import { getMuiTablePagination } from "./MuiTablePagination";
import { getMuiTableRow } from "./MuiTableRow";
import { getMuiTabs } from "./MuiTabs";
import { getMuiToggleButton } from "./MuiToggleButton";
import { getMuiToggleButtonGroup } from "./MuiToggleButtonGroup";
import { getMuiTooltip } from "./MuiTooltip";
import { getMuiTypography } from "./MuiTypography";

type ThemeData = {
    palette: Palette;
    typography: TypographyVariants;
    spacing: Spacing;
    zIndex: ZIndex;
    shadows: Shadows;
    breakpoints: Breakpoints;
};

export type GetMuiComponentTheme<ClassesName extends keyof ComponentNameToClassKey> = (
    component: Components[ClassesName],
    themeData: ThemeData,
) => Components[ClassesName];

export const getComponentsTheme = (components: Components, themeData: ThemeData): ThemeOptions["components"] => ({
    ...components,
    MuiAccordion: getMuiAccordion(components.MuiAccordion, themeData),
    MuiAlert: getMuiAlert(components.MuiAlert, themeData),
    MuiAlertTitle: getMuiAlertTitle(components.MuiAlertTitle, themeData),
    MuiAppBar: getMuiAppBar(components.MuiAppBar, themeData),
    MuiAutocomplete: getMuiAutocomplete(components.MuiAutocomplete, themeData),
    MuiBadge: getMuiBadge(components.MuiBadge, themeData),
    MuiButton: getMuiButton(components.MuiButton, themeData),
    MuiButtonGroup: getMuiButtonGroup(components.MuiButtonGroup, themeData),
    MuiCard: getMuiCard(components.MuiCard, themeData),
    MuiCardContent: getMuiCardContent(components.MuiCardContent, themeData),
    MuiCardHeader: getMuiCardHeader(components.MuiCardHeader, themeData),
    MuiCheckbox: getMuiCheckbox(components.MuiCheckbox, themeData),
    MuiChip: getMuiChip(components.MuiChip, themeData),
    MuiDataGrid: getMuiDataGrid(components.MuiDataGrid, themeData),
    MuiDialog: getMuiDialog(components.MuiDialog, themeData),
    MuiDialogActions: getMuiDialogActions(components.MuiDialogActions, themeData),
    MuiDialogContent: getMuiDialogContent(components.MuiDialogContent, themeData),
    MuiDialogContentText: getMuiDialogContentText(components.MuiDialogContentText, themeData),
    MuiDialogTitle: getMuiDialogTitle(components.MuiDialogTitle, themeData),
    MuiDrawer: getMuiDrawer(components.MuiDrawer, themeData),
    MuiFormControlLabel: getMuiFormControlLabel(components.MuiFormControlLabel, themeData),
    MuiFormHelperText: getMuiFormHelperText(components.MuiFormHelperText, themeData),
    MuiFormLabel: getMuiFormLabel(components.MuiFormLabel, themeData),
    MuiIconButton: getMuiIconButton(components.MuiIconButton, themeData),
    MuiInput: getMuiInput(components.MuiInput, themeData),
    MuiInputAdornment: getMuiInputAdornment(components.MuiInputAdornment, themeData),
    MuiInputBase: getMuiInputBase(components.MuiInputBase, themeData),
    MuiLinearProgress: getMuiLinearProgress(components.MuiLinearProgress, themeData),
    MuiLink: getMuiLink(components.MuiLink, themeData),
    MuiListItem: getMuiListItem(components.MuiListItem, themeData),
    MuiListItemIcon: getMuiListItemIcon(components.MuiListItemIcon, themeData),
    MuiListItemAvatar: getMuiListItemAvatar(components.MuiListItemAvatar, themeData),
    MuiMenu: getMuiMenu(components.MuiMenu, themeData),
    MuiNativeSelect: getMuiNativeSelect(components.MuiNativeSelect, themeData),
    MuiPaper: getMuiPaper(components.MuiPaper, themeData),
    MuiPopover: getMuiPopover(components.MuiPopover, themeData),
    MuiRadio: getMuiRadio(components.MuiRadio, themeData),
    MuiSelect: getMuiSelect(components.MuiSelect, themeData),
    MuiSvgIcon: getMuiSvgIcon(components.MuiSvgIcon, themeData),
    MuiSwitch: getMuiSwitch(components.MuiSwitch, themeData),
    MuiTab: getMuiTab(components.MuiTab, themeData),
    MuiTableCell: getMuiTableCell(components.MuiTableCell, themeData),
    MuiTableRow: getMuiTableRow(components.MuiTableRow, themeData),
    MuiTabs: getMuiTabs(components.MuiTabs, themeData),
    MuiToggleButton: getMuiToggleButton(components.MuiToggleButton, themeData),
    MuiToggleButtonGroup: getMuiToggleButtonGroup(components.MuiToggleButtonGroup, themeData),
    MuiTooltip: getMuiTooltip(components.MuiTooltip, themeData),
    MuiTypography: getMuiTypography(components.MuiTypography, themeData),
    MuiTablePagination: getMuiTablePagination(components.MuiTablePagination, themeData),
});
