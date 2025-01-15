import { dialogTitleClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogContent: GetMuiComponentTheme<"MuiDialogContent"> = (component, { palette, breakpoints }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDialogContent">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey[50],
            padding: 10,

            [`.${dialogTitleClasses.root} + &`]: {
                paddingTop: 10,
            },

            [breakpoints.up("sm")]: {
                padding: 40,

                [`.${dialogTitleClasses.root} + &`]: {
                    paddingTop: 40,
                },
            },
        },
    }),
});
