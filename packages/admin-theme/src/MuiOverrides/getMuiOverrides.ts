import { Palette } from "@material-ui/core/styles/createPalette";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { Typography } from "@material-ui/core/styles/createTypography";
import { Overrides } from "@material-ui/core/styles/overrides";

import { getMuiAppBarOverrides } from "./MuiAppBar";
import { getMuiButtonOverrides } from "./MuiButton";
import { getMuiButtonGroupOverrides } from "./MuiButtonGroup";
import { getMuiCheckboxOverrides } from "./MuiCheckbox";
import { getMuiDialogOverrides } from "./MuiDialog";
import { getMuiDialogActionsOverrides } from "./MuiDialogActions";
import { getMuiDialogContentOverrides } from "./MuiDialogContent";
import { getMuiDialogTextContentOverrides } from "./MuiDialogContentText";
import { getMuiDialogTitleOverrides } from "./MuiDialogTitle";
import { getMuiDrawerOverrides } from "./MuiDrawer";
import { getMuiFormControlLabelOverrides } from "./MuiFormControlLabel";
import { getMuiIconButtonOverrides } from "./MuiIconButton";
import { getMuiInputAdornmentOverrides } from "./MuiInputAdornment";
import { getMuiPaperOverrides } from "./MuiPaper";
import { getMuiRadioOverrides } from "./MuiRadio";
import { getMuiSelectOverrides } from "./MuiSelect";
import { getMuiSvgIconOverrides } from "./MuiSvgIcon";
import { getMuiSwitchOverrides } from "./MuiSwitch";
import { getMuiTabOverrides } from "./MuiTab";
import { getMuiTableCellOverrides } from "./MuiTableCell";
import { getMuiTableRowOverrides } from "./MuiTableRow";
import { getMuiTabsOverrides } from "./MuiTabs";
import { getMuiTypographyOverrides } from "./MuiTypography";

export const getMuiOverrides = (palette: Palette, typography: Typography, spacing: Spacing): Overrides => ({
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
    MuiFormControlLabel: getMuiFormControlLabelOverrides(),
    MuiSvgIcon: getMuiSvgIconOverrides(palette),
    MuiSwitch: getMuiSwitchOverrides(palette),
    MuiSelect: getMuiSelectOverrides(palette),
    MuiDrawer: getMuiDrawerOverrides(palette),
    MuiInputAdornment: getMuiInputAdornmentOverrides(),
    MuiTableCell: getMuiTableCellOverrides(palette, typography),
    MuiTableRow: getMuiTableRowOverrides(),
    MuiTabs: getMuiTabsOverrides(palette, spacing),
    MuiTab: getMuiTabOverrides(palette),
});
