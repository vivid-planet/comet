import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemAvatar: GetMuiComponentTheme<"MuiListItemAvatar"> = (component, { spacing }) => ({
    ...component,
    defaultProps: {
        dense: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiListItemAvatar">(component?.styleOverrides, {
        root: {
            gap: spacing(2),
        },
    }),
});
