import { getMuiAppBarProps } from "./MuiAppBar";
import { getMuiButtonProps } from "./MuiButton";
import { getMuiButtonGroupProps } from "./MuiButtonGroup";
import { getMuiCheckboxProps } from "./MuiCheckbox";
import { getMuiPaperProps } from "./MuiPaper";
import { getMuiPopoverProps } from "./MuiPopover";
import { getMuiRadioProps } from "./MuiRadio";
import { getMuiSelectProps } from "./MuiSelect";
import { getMuiSwitchProps } from "./MuiSwitch";

export default () => ({
    MuiCheckbox: getMuiCheckboxProps(),
    MuiRadio: getMuiRadioProps(),
    MuiAppBar: getMuiAppBarProps(),
    MuiPopover: getMuiPopoverProps(),
    MuiPaper: getMuiPaperProps(),
    MuiSwitch: getMuiSwitchProps(),
    MuiButton: getMuiButtonProps(),
    MuiButtonGroup: getMuiButtonGroupProps(),
    MuiSelect: getMuiSelectProps(),
});
