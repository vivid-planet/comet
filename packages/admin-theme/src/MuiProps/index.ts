import getMuiAppBarProps from "./MuiAppBar";
import { getMuiCheckboxProps } from "./MuiCheckbox";
import { getMuiRadioProps } from "./MuiRadio";

export default () => ({
    MuiCheckbox: getMuiCheckboxProps(),
    MuiRadio: getMuiRadioProps(),
    MuiAppBar: getMuiAppBarProps(),
});
