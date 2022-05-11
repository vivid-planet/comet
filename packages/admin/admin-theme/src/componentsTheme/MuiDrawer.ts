import { Components } from "@mui/material/styles/components";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDrawer: GetMuiComponentTheme<"MuiDrawer"> = (styleOverrides, { palette }): Components["MuiDrawer"] => ({
    styleOverrides: mergeOverrideStyles<"MuiDrawer">(styleOverrides, {
        root: {
            zIndex: 1250, // Between AppBar (1200) and Modal (1300)
        },
        paper: {
            backgroundColor: palette.grey[50],
        },
    }),
});
