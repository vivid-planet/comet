import { ComponentNameToClassKey, ThemeOptions } from "@mui/material";
import { Components, Palette } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { Shadows } from "@mui/material/styles/shadows";
import { ZIndex } from "@mui/material/styles/zIndex";
import { Spacing } from "@mui/system";

import { getMuiAppBar } from "./MuiAppBar";
import { getMuiAutocomplete } from "./MuiAutocomplete";
import { getMuiButton } from "./MuiButton";
import { getMuiButtonGroup } from "./MuiButtonGroup";
import { getMuiCardContent } from "./MuiCardContent";
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
import { getMuiLink } from "./MuiLink";
import { getMuiListItem } from "./MuiListItem";
import { getMuiNativeSelect } from "./MuiNativeSelect";
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
import { getMuiTooltip } from "./MuiTooltip";
import { getMuiTypography } from "./MuiTypography";

type ThemeData = {
    palette: Palette;
    typography: Typography;
    spacing: Spacing;
    zIndex: ZIndex;
    shadows: Shadows;
};

export type GetMuiComponentTheme<ClassesName extends keyof ComponentNameToClassKey> = (
    component: Components[ClassesName],
    themeData: ThemeData,
) => Components[ClassesName];

export const getComponentsTheme = (components: Components, themeData: ThemeData): ThemeOptions["components"] => ({
    ...components,
    MuiAppBar: getMuiAppBar(components.MuiAppBar, themeData),
    MuiAutocomplete: getMuiAutocomplete(components.MuiAutocomplete, themeData),
    MuiButton: getMuiButton(components.MuiButton, themeData),
    MuiButtonGroup: getMuiButtonGroup(components.MuiButtonGroup, themeData),
    MuiCardContent: getMuiCardContent(components.MuiCardContent, themeData),
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
    MuiFormLabel: getMuiFormLabel(components.MuiFormLabel, themeData),
    MuiFormHelperText: getMuiFormHelperText(components.MuiFormHelperText, themeData),
    MuiIconButton: getMuiIconButton(components.MuiIconButton, themeData),
    MuiInputAdornment: getMuiInputAdornment(components.MuiInputAdornment, themeData),
    MuiInputBase: getMuiInputBase(components.MuiInputBase, themeData),
    MuiInput: getMuiInput(components.MuiInput, themeData),
    MuiLink: getMuiLink(components.MuiLink, themeData),
    MuiListItem: getMuiListItem(components.MuiListItem, themeData),
    MuiPaper: getMuiPaper(components.MuiPaper, themeData),
    MuiPopover: getMuiPopover(components.MuiPopover, themeData),
    MuiRadio: getMuiRadio(components.MuiRadio, themeData),
    MuiSelect: getMuiSelect(components.MuiSelect, themeData),
    MuiNativeSelect: getMuiNativeSelect(components.MuiNativeSelect, themeData),
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
});
