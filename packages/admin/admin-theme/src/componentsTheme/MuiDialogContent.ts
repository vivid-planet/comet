import { dialogTitleClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogContent: GetMuiComponentTheme<"MuiDialogContent"> = (component, { palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDialogContent">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey[50],
            padding: 40,

            [`.${dialogTitleClasses.root} + &`]: {
                paddingTop: 40,
            },
        },
    }),
});
