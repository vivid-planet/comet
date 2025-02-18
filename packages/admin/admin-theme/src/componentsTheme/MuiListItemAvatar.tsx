import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemAvatar: GetMuiComponentTheme<"MuiListItemAvatar"> = (component) => ({
    ...component,
    defaultProps: {
        dense: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiListItem">(component?.styleOverrides, {
        root: {
            gap: "10px",
        },
    }),
});
