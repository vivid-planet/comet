import { Components } from "@mui/material/styles/components";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDrawer: GetMuiComponentTheme<"MuiDrawer"> = (component, { palette, zIndex }): Components["MuiDrawer"] => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDrawer">(component?.styleOverrides, {
        paper: {
            backgroundColor: palette.grey[50],
        },
    }),
});
