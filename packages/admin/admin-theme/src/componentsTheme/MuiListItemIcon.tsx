import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemIcon: GetMuiComponentTheme<"MuiListItemIcon"> = (component) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiListItemIcon">(component?.styleOverrides, {
        root: {
            minWidth: "unset !important",
        },
    }),
});
