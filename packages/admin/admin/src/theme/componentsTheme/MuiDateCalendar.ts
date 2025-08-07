import type {} from "@mui/x-date-pickers/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDateCalendar: GetMuiComponentTheme<"MuiDateCalendar"> = (component, { shadows }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDateCalendar">(component?.styleOverrides, {
        root: {
            boxShadow: shadows[1],
        },
    }),
});
