<<<<<<< HEAD
import { type GetMuiComponentTheme } from "./getComponentsTheme";
=======
import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";
>>>>>>> main

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
