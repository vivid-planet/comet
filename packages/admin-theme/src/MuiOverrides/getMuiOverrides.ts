import { ComponentsOverrides } from "@mui/material";
import { Palette } from "@mui/material/styles/createPalette";
import { Typography } from "@mui/material/styles/createTypography";
import { Spacing } from "@mui/system";

import { getMuiAppBarOverrides } from "./MuiAppBar";
import { getMuiAutocompleteOverrides } from "./MuiAutocomplete";
import { getMuiButtonOverrides } from "./MuiButton";
import { getMuiButtonGroupOverrides } from "./MuiButtonGroup";
import { getMuiCardContentOverrides } from "./MuiCardContent";
import { getMuiCheckboxOverrides } from "./MuiCheckbox";
import { getMuiDialogOverrides } from "./MuiDialog";
import { getMuiDialogActionsOverrides } from "./MuiDialogActions";
import { getMuiDialogContentOverrides } from "./MuiDialogContent";
import { getMuiDialogTextContentOverrides } from "./MuiDialogContentText";
import { getMuiDialogTitleOverrides } from "./MuiDialogTitle";
import { getMuiDrawerOverrides } from "./MuiDrawer";
import { getMuiFormControlLabelOverrides } from "./MuiFormControlLabel";
import { getMuiFormLabelOverrides } from "./MuiFormLabel";
import { getMuiIconButtonOverrides } from "./MuiIconButton";
import { getMuiInputAdornmentOverrides } from "./MuiInputAdornment";
import { getMuiInputBaseOverrides } from "./MuiInputBase";
import { getMuiLinkOverrides } from "./MuiLink";
import { getMuiPaperOverrides } from "./MuiPaper";
import { getMuiRadioOverrides } from "./MuiRadio";
import { getMuiSelectOverrides } from "./MuiSelect";
import { getMuiSvgIconOverrides } from "./MuiSvgIcon";
import { getMuiSwitchOverrides } from "./MuiSwitch";
import { getMuiTabOverrides } from "./MuiTab";
import { getMuiTableCellOverrides } from "./MuiTableCell";
import { getMuiTableRowOverrides } from "./MuiTableRow";
import { getMuiTabsOverrides } from "./MuiTabs";
import { getMuiToggleButtonOverrides } from "./MuiToggleButton";
import { getMuiToggleButtonGroupOverrides } from "./MuiToggleButtonGroup";
import { getMuiTypographyOverrides } from "./MuiTypography";

export const getMuiOverrides = (palette: Palette, typography: Typography, spacing: Spacing): ComponentsOverrides => ({
    MuiCheckbox: getMuiCheckboxOverrides(palette),
    MuiRadio: getMuiRadioOverrides(palette),
    MuiDialog: getMuiDialogOverrides(spacing),
    MuiDialogTitle: getMuiDialogTitleOverrides(palette, typography),
    MuiDialogContent: getMuiDialogContentOverrides(palette),
    MuiDialogContentText: getMuiDialogTextContentOverrides(palette),
    MuiDialogActions: getMuiDialogActionsOverrides(palette),
    MuiButton: getMuiButtonOverrides(palette),
    MuiButtonGroup: getMuiButtonGroupOverrides(palette),
    MuiIconButton: getMuiIconButtonOverrides(palette),
    MuiTypography: getMuiTypographyOverrides(),
    MuiPaper: getMuiPaperOverrides(palette),
    MuiAppBar: getMuiAppBarOverrides(),
    MuiFormLabel: getMuiFormLabelOverrides(palette, typography, spacing),
    MuiFormControlLabel: getMuiFormControlLabelOverrides(),
    MuiSvgIcon: getMuiSvgIconOverrides(palette),
    MuiSwitch: getMuiSwitchOverrides(palette),
    MuiSelect: getMuiSelectOverrides(palette),
    MuiDrawer: getMuiDrawerOverrides(palette),
    MuiInputAdornment: getMuiInputAdornmentOverrides(),
    MuiTableCell: getMuiTableCellOverrides(palette, typography),
    MuiTableRow: getMuiTableRowOverrides(),
    MuiTabs: getMuiTabsOverrides(palette, spacing),
    MuiTab: getMuiTabOverrides(palette, typography),
    MuiCardContent: getMuiCardContentOverrides(spacing),
    MuiAutocomplete: getMuiAutocompleteOverrides(spacing),
    MuiInputBase: getMuiInputBaseOverrides(palette, spacing),
    MuiLink: getMuiLinkOverrides(palette),
    MuiToggleButton: getMuiToggleButtonOverrides(palette),
    MuiToggleButtonGroup: getMuiToggleButtonGroupOverrides(palette),
});
