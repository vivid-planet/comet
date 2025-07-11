import type {} from "@mui/x-date-pickers/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDatePicker: GetMuiComponentTheme<"MuiDatePicker"> = (component) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
        slotProps: {
            ...component?.defaultProps?.slotProps,
            textField: {
                size: "small",
                ...component?.defaultProps?.slotProps?.textField,
            },
        },
    },
    styleOverrides: mergeOverrideStyles<"MuiDatePicker">(component?.styleOverrides, {}),
});
