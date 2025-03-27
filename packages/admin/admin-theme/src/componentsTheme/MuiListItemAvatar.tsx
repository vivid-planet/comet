import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemAvatar: GetMuiComponentTheme<"MuiListItemAvatar"> = (component, { spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiListItemAvatar">(component?.styleOverrides, {
        root: {
            minWidth: 0,
        },
    }),
});
