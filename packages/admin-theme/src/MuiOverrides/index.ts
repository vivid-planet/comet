import getMuiCheckboxOverrides from "./MuiCheckbox";
import getMuiDialogOverrides from "./MuiDialog";

export default () => ({
    MuiCheckbox: getMuiCheckboxOverrides(),
    MuiDialog: getMuiDialogOverrides(),
});
