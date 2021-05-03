import { getMuiCheckboxOverrides } from "./MuiCheckbox";
import getMuiDialogOverrides from "./MuiDialog";
import { getMuiRadioOverrides } from "./MuiRadio";

export default () => ({
    MuiCheckbox: getMuiCheckboxOverrides(),
    MuiRadio: getMuiRadioOverrides(),
    MuiDialog: getMuiDialogOverrides(),
});
