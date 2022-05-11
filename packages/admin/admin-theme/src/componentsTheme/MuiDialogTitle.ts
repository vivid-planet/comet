import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogTitle: GetMuiComponentTheme<"MuiDialogTitle"> = (styleOverrides, { palette, typography }) => ({
    styleOverrides: mergeOverrideStyles<"MuiDialogTitle">(styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: palette.grey["A100"],
            padding: 20,
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: typography.fontWeightBold,
        },
    }),
});
