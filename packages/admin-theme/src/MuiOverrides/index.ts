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

export default () => ({
    MuiCheckbox: getMuiCheckboxOverrides(),
    MuiRadio: getMuiRadioOverrides(),
    MuiDialog: getMuiDialogOverrides(),
    MuiDialogTitle: getMuiDialogTitleOverrides(),
    MuiDialogContent: getMuiDialogContentOverrides(),
    MuiDialogContentText: getMuiDialogTextContentOverrides(),
    MuiDialogActions: getMuiDialogActionsOverrides(),
    MuiButton: getMuiButtonOverrides(),
    MuiButtonGroup: getMuiButtonGroupOverrides(),
    MuiTypography: getMuiTypographyOverrides(),
    MuiPaper: getMuiPaperOverrides(),
    MuiAppBar: getMuiAppBarOverrides(),
    MuiFormControlLabel: getMuiFormControlLabelOverrides(),
    MuiSvgIcon: getMuiSvgIconOverrides(),
    MuiSwitch: getMuiSwitchOverrides(),
    MuiSelect: getMuiSelectOverrides(),
    MuiDrawer: getMuiDrawerOverrides(),
    MuiInputAdornment: getMuiInputAdornmentOverrides(),
});
