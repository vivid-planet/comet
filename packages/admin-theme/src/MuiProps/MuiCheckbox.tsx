import { CheckboxChecked, CheckboxUnchecked } from "@comet/admin-icons";
import { CheckboxProps } from "@mui/material/Checkbox";
import * as React from "react";

export const getMuiCheckboxProps = (): Partial<CheckboxProps> => ({
    color: "primary",
    icon: <CheckboxUnchecked />,
    checkedIcon: <CheckboxChecked />,
});
