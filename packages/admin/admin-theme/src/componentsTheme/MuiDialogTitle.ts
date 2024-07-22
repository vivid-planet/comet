import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogTitle: GetMuiComponentTheme<"MuiDialogTitle"> = (component, { palette, typography }) => ({
    ...component,
    defaultProps: {
        variant: "subtitle1",
    },
    styleOverrides: mergeOverrideStyles<"MuiDialogTitle">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: "#ffffff",
            padding: 20,
        },
    }),
});
