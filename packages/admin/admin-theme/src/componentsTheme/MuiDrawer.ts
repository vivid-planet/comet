import { Components } from "@mui/material/styles/components";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDrawer: GetMuiComponentTheme<"MuiDrawer"> = (component, { palette, zIndex }): Components["MuiDrawer"] => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDrawer">(component?.styleOverrides, {
        root: {
            zIndex: zIndex.drawer + 50, // Between AppBar (1200) and Modal (1300)
        },
        paper: {
            backgroundColor: palette.grey[50],
        },
    }),
});
