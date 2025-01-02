import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemIcon: GetMuiComponentTheme<"MuiListItemIcon"> = (component) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiListItemIcon">(component?.styleOverrides, {
        root: {
            minWidth: "unset !important",
        },
    }),
});
