import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogTitle: GetMuiComponentTheme<"MuiDialogTitle"> = (component, { palette, typography, breakpoints }) => ({
    ...component,
    defaultProps: {
        variant: "subtitle1",
    },
    styleOverrides: mergeOverrideStyles<"MuiDialogTitle">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: "#ffffff",
            padding: 10,
            fontSize: "14px",

            [breakpoints.up("sm")]: {
                minWidth: 0,
                fontSize: "16px",
                padding: 20,
            },
        },
    }),
});
