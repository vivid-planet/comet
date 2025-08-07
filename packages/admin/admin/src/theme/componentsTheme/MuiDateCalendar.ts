import { type Components, type Theme } from "@mui/material/styles";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";

export const getMuiDateCalendar = (component: Components["MuiDateCalendar"], theme: Theme): Components["MuiDateCalendar"] => ({
    ...component,
    styleOverrides: mergeOverrideStyles(component?.styleOverrides, {
        root: {
            boxShadow: theme.shadows[1],
        },
    }),
});
