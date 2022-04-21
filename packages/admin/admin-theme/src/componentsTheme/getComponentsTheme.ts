import { ThemeOptions } from "@mui/material";
import { Palette } from "@mui/material/styles/createPalette";
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

export const getComponentsTheme = (palette: Palette, typography: Typography, spacing: Spacing): ThemeOptions["components"] => ({
    MuiAppBar: getMuiAppBar(),
    MuiAutocomplete: getMuiAutocomplete(spacing),
    MuiButton: getMuiButton(palette, typography),
    MuiButtonGroup: getMuiButtonGroup(palette),
    MuiCardContent: getMuiCardContent(spacing),
    MuiCheckbox: getMuiCheckbox(palette),
    MuiDialog: getMuiDialog(spacing),
    MuiDialogActions: getMuiDialogActions(palette),
    MuiDialogContent: getMuiDialogContent(palette),
    MuiDialogContentText: getMuiDialogContentText(palette),
    MuiDialogTitle: getMuiDialogTitle(palette, typography),
    MuiDrawer: getMuiDrawer(palette),
    MuiFormControlLabel: getMuiFormControlLabel(),
    MuiFormLabel: getMuiFormLabel(palette, typography, spacing),
    MuiIconButton: getMuiIconButton(palette),
    MuiInputAdornment: getMuiInputAdornment(),
    MuiInputBase: getMuiInputBase(palette, spacing),
    MuiLink: getMuiLink(palette),
    MuiListItem: getMuiListItem(),
    MuiPaper: getMuiPaper(palette),
    MuiPopover: getMuiPopover(),
    MuiRadio: getMuiRadio(palette),
    MuiSelect: getMuiSelect(palette),
    MuiSvgIcon: getMuiSvgIcon(palette),
    MuiSwitch: getMuiSwitch(palette),
    MuiTab: getMuiTab(palette, typography),
    MuiTableCell: getMuiTableCell(palette, typography),
    MuiTableRow: getMuiTableRow(),
    MuiTabs: getMuiTabs(palette, spacing),
    MuiToggleButton: getMuiToggleButton(palette),
    MuiToggleButtonGroup: getMuiToggleButtonGroup(palette),
    MuiTypography: getMuiTypography(),
});
