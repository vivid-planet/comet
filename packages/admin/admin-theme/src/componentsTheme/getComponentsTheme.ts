import { ComponentNameToClassKey, Theme, ThemeOptions } from "@mui/material";
import { Components, ComponentsOverrides, Palette } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { Spacing } from "@mui/system";

import { getMuiAppBar } from "./MuiAppBar";
import { getMuiAutocomplete } from "./MuiAutocomplete";
import { getMuiButton } from "./MuiButton";
import { getMuiButtonGroup } from "./MuiButtonGroup";
import { getMuiCardContent } from "./MuiCardContent";
import { getMuiCheckbox } from "./MuiCheckbox";
import { getMuiDialog } from "./MuiDialog";
import { getMuiDialogActions } from "./MuiDialogActions";
import { getMuiDialogContent } from "./MuiDialogContent";
import { getMuiDialogContentText } from "./MuiDialogContentText";
import { getMuiDialogTitle } from "./MuiDialogTitle";
import { getMuiDrawer } from "./MuiDrawer";
import { getMuiFormControlLabel } from "./MuiFormControlLabel";
import { getMuiFormLabel } from "./MuiFormLabel";
import { getMuiIconButton } from "./MuiIconButton";
import { getMuiInputAdornment } from "./MuiInputAdornment";
import { getMuiInputBase } from "./MuiInputBase";
import { getMuiLink } from "./MuiLink";
import { getMuiListItem } from "./MuiListItem";
import { getMuiPaper } from "./MuiPaper";
import { getMuiPopover } from "./MuiPopover";
import { getMuiRadio } from "./MuiRadio";
import { getMuiSelect } from "./MuiSelect";
import { getMuiSvgIcon } from "./MuiSvgIcon";
import { getMuiSwitch } from "./MuiSwitch";
import { getMuiTab } from "./MuiTab";
import { getMuiTableCell } from "./MuiTableCell";
import { getMuiTableRow } from "./MuiTableRow";
import { getMuiTabs } from "./MuiTabs";
import { getMuiToggleButton } from "./MuiToggleButton";
import { getMuiToggleButtonGroup } from "./MuiToggleButtonGroup";
import { getMuiTypography } from "./MuiTypography";

type ThemeData = {
    palette: Palette;
    typography: Typography;
    spacing: Spacing;
};

export type GetMuiComponentTheme<ClassesName extends keyof ComponentNameToClassKey> = (
    styleOverrides: ComponentsOverrides<Theme>[ClassesName],
    themeData: ThemeData,
) => Components[ClassesName];

export const getComponentsTheme = (components: Components, themeData: ThemeData): ThemeOptions["components"] => ({
    MuiAppBar: getMuiAppBar(components.MuiAppBar?.styleOverrides, themeData),
    MuiAutocomplete: getMuiAutocomplete(components.MuiAutocomplete?.styleOverrides, themeData),
    MuiButton: getMuiButton(components.MuiButton?.styleOverrides, themeData),
    MuiButtonGroup: getMuiButtonGroup(components.MuiButtonGroup?.styleOverrides, themeData),
    MuiCardContent: getMuiCardContent(components.MuiCardContent?.styleOverrides, themeData),
    MuiCheckbox: getMuiCheckbox(components.MuiCheckbox?.styleOverrides, themeData),
    MuiDialog: getMuiDialog(components.MuiDialog?.styleOverrides, themeData),
    MuiDialogActions: getMuiDialogActions(components.MuiDialogActions?.styleOverrides, themeData),
    MuiDialogContent: getMuiDialogContent(components.MuiDialogContent?.styleOverrides, themeData),
    MuiDialogContentText: getMuiDialogContentText(components.MuiDialogContentText?.styleOverrides, themeData),
    MuiDialogTitle: getMuiDialogTitle(components.MuiDialogTitle?.styleOverrides, themeData),
    MuiDrawer: getMuiDrawer(components.MuiDrawer?.styleOverrides, themeData),
    MuiFormControlLabel: getMuiFormControlLabel(components.MuiFormControlLabel?.styleOverrides, themeData),
    MuiFormLabel: getMuiFormLabel(components.MuiFormLabel?.styleOverrides, themeData),
    MuiIconButton: getMuiIconButton(components.MuiIconButton?.styleOverrides, themeData),
    MuiInputAdornment: getMuiInputAdornment(components.MuiInputAdornment?.styleOverrides, themeData),
    MuiInputBase: getMuiInputBase(components.MuiInputBase?.styleOverrides, themeData),
    MuiLink: getMuiLink(components.MuiLink?.styleOverrides, themeData),
    MuiListItem: getMuiListItem(components.MuiListItem?.styleOverrides, themeData),
    MuiPaper: getMuiPaper(components.MuiPaper?.styleOverrides, themeData),
    MuiPopover: getMuiPopover(components.MuiPopover?.styleOverrides, themeData),
    MuiRadio: getMuiRadio(components.MuiRadio?.styleOverrides, themeData),
    MuiSelect: getMuiSelect(components.MuiSelect?.styleOverrides, themeData),
    MuiSvgIcon: getMuiSvgIcon(components.MuiSvgIcon?.styleOverrides, themeData),
    MuiSwitch: getMuiSwitch(components.MuiSwitch?.styleOverrides, themeData),
    MuiTab: getMuiTab(components.MuiTab?.styleOverrides, themeData),
    MuiTableCell: getMuiTableCell(components.MuiTableCell?.styleOverrides, themeData),
    MuiTableRow: getMuiTableRow(components.MuiTableRow?.styleOverrides, themeData),
    MuiTabs: getMuiTabs(components.MuiTabs?.styleOverrides, themeData),
    MuiToggleButton: getMuiToggleButton(components.MuiToggleButton?.styleOverrides, themeData),
    MuiToggleButtonGroup: getMuiToggleButtonGroup(components.MuiToggleButtonGroup?.styleOverrides, themeData),
    MuiTypography: getMuiTypography(components.MuiTypography?.styleOverrides, themeData),
});
