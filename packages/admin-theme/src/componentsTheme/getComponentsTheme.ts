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
import { getMuiPaper } from "./MuiPaper";
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
    MuiCheckbox: getMuiCheckbox(palette),
    MuiRadio: getMuiRadio(palette),
    MuiDialog: getMuiDialog(spacing),
    MuiDialogTitle: getMuiDialogTitle(palette, typography),
    MuiDialogContent: getMuiDialogContent(palette),
    MuiDialogContentText: getMuiDialogContentText(palette),
    MuiDialogActions: getMuiDialogActions(palette),
    MuiButton: getMuiButton(palette),
    MuiButtonGroup: getMuiButtonGroup(palette),
    MuiIconButton: getMuiIconButton(palette),
    MuiTypography: getMuiTypography(),
    MuiPaper: getMuiPaper(palette),
    MuiAppBar: getMuiAppBar(),
    MuiFormLabel: getMuiFormLabel(palette, typography, spacing),
    MuiFormControlLabel: getMuiFormControlLabel(),
    MuiSvgIcon: getMuiSvgIcon(palette),
    MuiSwitch: getMuiSwitch(palette),
    MuiSelect: getMuiSelect(palette),
    MuiDrawer: getMuiDrawer(palette),
    MuiInputAdornment: getMuiInputAdornment(),
    MuiTableCell: getMuiTableCell(palette, typography),
    MuiTableRow: getMuiTableRow(),
    MuiTabs: getMuiTabs(palette, spacing),
    MuiTab: getMuiTab(palette, typography),
    MuiCardContent: getMuiCardContent(spacing),
    MuiAutocomplete: getMuiAutocomplete(spacing),
    MuiInputBase: getMuiInputBase(palette, spacing),
    MuiLink: getMuiLink(palette),
    MuiToggleButton: getMuiToggleButton(palette),
    MuiToggleButtonGroup: getMuiToggleButtonGroup(palette),
});
