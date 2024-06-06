import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogTitle: GetMuiComponentTheme<"MuiDialogTitle"> = (component, { palette, typography }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDialogTitle">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: "#ffffff",
            padding: 20,
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: typography.fontWeightBold,
        },
    }),
});
