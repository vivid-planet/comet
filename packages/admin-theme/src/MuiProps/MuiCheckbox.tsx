import { CheckboxChecked, CheckboxUnchecked } from "@comet/admin-icons";
import { CheckboxProps } from "@material-ui/core/Checkbox";
import * as React from "react";

export const getMuiCheckboxProps = (): CheckboxProps => ({
    color: "primary",
    icon: <CheckboxUnchecked />,
    checkedIcon: <CheckboxChecked />,
});
