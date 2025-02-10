import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
<<<<<<< HEAD
import { type GetMuiComponentTheme } from "./getComponentsTheme";
=======
import { GetMuiComponentTheme } from "./getComponentsTheme";
>>>>>>> main

export const getMuiListItemIcon: GetMuiComponentTheme<"MuiListItemIcon"> = (component, theme) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiListItemIcon">(component?.styleOverrides, {
        root: {
            minWidth: 0,
        },
    }),
});
