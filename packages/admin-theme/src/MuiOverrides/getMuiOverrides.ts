import { Palette } from "@material-ui/core/styles/createPalette";
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
import { getMuiInputAdornmentOverrides } from "./MuiInputAdornment";
import { getMuiPaperOverrides } from "./MuiPaper";
import { getMuiRadioOverrides } from "./MuiRadio";
import { getMuiSelectOverrides } from "./MuiSelect";
import { getMuiSvgIconOverrides } from "./MuiSvgIcon";
import { getMuiSwitchOverrides } from "./MuiSwitch";
import { getMuiTypographyOverrides } from "./MuiTypography";

export const getMuiOverrides = (palette: Palette): Overrides => ({
    MuiCheckbox: getMuiCheckboxOverrides(palette),
    MuiRadio: getMuiRadioOverrides(palette),
    MuiDialog: getMuiDialogOverrides(),
    MuiDialogTitle: getMuiDialogTitleOverrides(),
    MuiDialogContent: getMuiDialogContentOverrides(palette),
    MuiDialogContentText: getMuiDialogTextContentOverrides(palette),
    MuiDialogActions: getMuiDialogActionsOverrides(palette),
    MuiButton: getMuiButtonOverrides(palette),
    MuiButtonGroup: getMuiButtonGroupOverrides(palette),
    MuiTypography: getMuiTypographyOverrides(),
    MuiPaper: getMuiPaperOverrides(palette),
    MuiAppBar: getMuiAppBarOverrides(),
    MuiFormControlLabel: getMuiFormControlLabelOverrides(),
    MuiSvgIcon: getMuiSvgIconOverrides(palette),
    MuiSwitch: getMuiSwitchOverrides(palette),
    MuiSelect: getMuiSelectOverrides(palette),
    MuiDrawer: getMuiDrawerOverrides(palette),
    MuiInputAdornment: getMuiInputAdornmentOverrides(),
});
