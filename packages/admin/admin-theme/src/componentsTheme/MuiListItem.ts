import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItem: GetMuiComponentTheme<"MuiListItem"> = (component, { spacing }) => ({
    ...component,
    defaultProps: {
        dense: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiListItem">(component?.styleOverrides, {
        root: {
            gap: spacing(2),
        },
    }),
});
