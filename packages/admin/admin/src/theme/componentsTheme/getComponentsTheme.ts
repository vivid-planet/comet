import { type ComponentNameToClassKey, type ThemeOptions } from "@mui/material";
import { type Components, type Theme } from "@mui/material/styles";
import { type IntlShape } from "react-intl";

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
import { getMuiDateCalendar } from "./MuiDateCalendar";
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
import { getMuiList } from "./MuiList";
import { getMuiListItem } from "./MuiListItem";
import { getMuiListItemAvatar } from "./MuiListItemAvatar";
import { getMuiListItemButton } from "./MuiListItemButton";
import { getMuiListItemIcon } from "./MuiListItemIcon";
import { getMuiListItemText } from "./MuiListItemText";
import { getMuiMenu } from "./MuiMenu";
import { getMuiMenuItem } from "./MuiMenuItem";
import { getMuiNativeSelect } from "./MuiNativeSelect";
import { getMuiPaper } from "./MuiPaper";
import { getMuiPopover } from "./MuiPopover";
import { getMuiRadio } from "./MuiRadio";
import { getMuiSelect } from "./MuiSelect";
import { getMuiSvgIcon } from "./MuiSvgIcon";
import { getMuiSwitch } from "./MuiSwitch";
import { getMuiTab } from "./MuiTab";
import { getMuiTableCell } from "./MuiTableCell";
import { getMuiTableFooter } from "./MuiTableFooter";
import { getMuiTablePagination } from "./MuiTablePagination";
import { getMuiTableRow } from "./MuiTableRow";
import { getMuiTabs } from "./MuiTabs";
import { getMuiToggleButton } from "./MuiToggleButton";
import { getMuiToggleButtonGroup } from "./MuiToggleButtonGroup";
import { getMuiTooltip } from "./MuiTooltip";
import { getMuiTypography } from "./MuiTypography";

export type GetMuiComponentTheme<ClassesName extends keyof ComponentNameToClassKey> = (
    component: Components[ClassesName],
    theme: Theme,
    intl: IntlShape,
) => Components[ClassesName];

export const getComponentsTheme = (components: Components, theme: Theme, intl: IntlShape): ThemeOptions["components"] => ({
    ...components,
    MuiAccordion: getMuiAccordion(components.MuiAccordion, theme, intl),
    MuiAlert: getMuiAlert(components.MuiAlert, theme, intl),
    MuiAlertTitle: getMuiAlertTitle(components.MuiAlertTitle, theme, intl),
    MuiAppBar: getMuiAppBar(components.MuiAppBar, theme, intl),
    MuiAutocomplete: getMuiAutocomplete(components.MuiAutocomplete, theme, intl),
    MuiBadge: getMuiBadge(components.MuiBadge, theme, intl),
    MuiButton: getMuiButton(components.MuiButton, theme, intl),
    MuiButtonGroup: getMuiButtonGroup(components.MuiButtonGroup, theme, intl),
    MuiCard: getMuiCard(components.MuiCard, theme, intl),
    MuiCardContent: getMuiCardContent(components.MuiCardContent, theme, intl),
    MuiCardHeader: getMuiCardHeader(components.MuiCardHeader, theme, intl),
    MuiCheckbox: getMuiCheckbox(components.MuiCheckbox, theme, intl),
    MuiChip: getMuiChip(components.MuiChip, theme, intl),
    MuiDataGrid: getMuiDataGrid(components.MuiDataGrid, theme, intl),
    MuiDialog: getMuiDialog(components.MuiDialog, theme, intl),
    MuiDialogActions: getMuiDialogActions(components.MuiDialogActions, theme, intl),
    MuiDialogContent: getMuiDialogContent(components.MuiDialogContent, theme, intl),
    MuiDialogContentText: getMuiDialogContentText(components.MuiDialogContentText, theme, intl),
    MuiDialogTitle: getMuiDialogTitle(components.MuiDialogTitle, theme, intl),
    MuiDrawer: getMuiDrawer(components.MuiDrawer, theme, intl),
    MuiFormControlLabel: getMuiFormControlLabel(components.MuiFormControlLabel, theme, intl),
    MuiFormHelperText: getMuiFormHelperText(components.MuiFormHelperText, theme, intl),
    MuiFormLabel: getMuiFormLabel(components.MuiFormLabel, theme, intl),
    MuiIconButton: getMuiIconButton(components.MuiIconButton, theme, intl),
    MuiInput: getMuiInput(components.MuiInput, theme, intl),
    MuiInputAdornment: getMuiInputAdornment(components.MuiInputAdornment, theme, intl),
    MuiInputBase: getMuiInputBase(components.MuiInputBase, theme, intl),
    MuiLinearProgress: getMuiLinearProgress(components.MuiLinearProgress, theme, intl),
    MuiLink: getMuiLink(components.MuiLink, theme, intl),
    MuiList: getMuiList(components.MuiList, theme, intl),
    MuiListItem: getMuiListItem(components.MuiListItem, theme, intl),
    MuiListItemText: getMuiListItemText(components.MuiListItemText, theme, intl),
    MuiListItemButton: getMuiListItemButton(components.MuiListItemButton, theme, intl),
    MuiListItemIcon: getMuiListItemIcon(components.MuiListItemIcon, theme, intl),
    MuiListItemAvatar: getMuiListItemAvatar(components.MuiListItemAvatar, theme, intl),
    MuiMenu: getMuiMenu(components.MuiMenu, theme, intl),
    MuiMenuItem: getMuiMenuItem(components.MuiMenuItem, theme, intl),
    MuiNativeSelect: getMuiNativeSelect(components.MuiNativeSelect, theme, intl),
    MuiPaper: getMuiPaper(components.MuiPaper, theme, intl),
    MuiPopover: getMuiPopover(components.MuiPopover, theme, intl),
    MuiRadio: getMuiRadio(components.MuiRadio, theme, intl),
    MuiSelect: getMuiSelect(components.MuiSelect, theme, intl),
    MuiSvgIcon: getMuiSvgIcon(components.MuiSvgIcon, theme, intl),
    MuiSwitch: getMuiSwitch(components.MuiSwitch, theme, intl),
    MuiTab: getMuiTab(components.MuiTab, theme, intl),
    MuiTableCell: getMuiTableCell(components.MuiTableCell, theme, intl),
    MuiTableRow: getMuiTableRow(components.MuiTableRow, theme, intl),
    MuiTabs: getMuiTabs(components.MuiTabs, theme, intl),
    MuiToggleButton: getMuiToggleButton(components.MuiToggleButton, theme, intl),
    MuiToggleButtonGroup: getMuiToggleButtonGroup(components.MuiToggleButtonGroup, theme, intl),
    MuiTooltip: getMuiTooltip(components.MuiTooltip, theme, intl),
    MuiTypography: getMuiTypography(components.MuiTypography, theme, intl),
    MuiTablePagination: getMuiTablePagination(components.MuiTablePagination, theme, intl),
    MuiDateCalendar: getMuiDateCalendar(components.MuiDateCalendar, theme, intl),
    MuiTableFooter: getMuiTableFooter(components.MuiTableFooter, theme, intl),
});
