import { type Components, type Theme } from "@mui/material/styles";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";

export const getMuiPickersPopper = (component: Components["MuiPickersPopper"], theme: Theme): Components["MuiPickersPopper"] => ({
    ...component,
    styleOverrides: mergeOverrideStyles(component?.styleOverrides, {
        paper: {
            boxShadow: theme.shadows[1],
        },
    }),
});
