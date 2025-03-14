import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemIcon: GetMuiComponentTheme<"MuiListItemIcon"> = (component, theme) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiListItemIcon">(component?.styleOverrides, {
        root: {
            minWidth: 0,
        },
    }),
});
