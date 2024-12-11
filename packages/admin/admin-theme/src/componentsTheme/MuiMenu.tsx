import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiMenu: GetMuiComponentTheme<"MuiMenu"> = (component) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiMenu">(component?.styleOverrides, {
        paper: { minWidth: 220, borderRadius: "4px" },
    }),
});
