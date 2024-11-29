import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiFormHelperText: GetMuiComponentTheme<"MuiFormHelperText"> = (component, { palette, typography, spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiFormHelperText">(component?.styleOverrides, {
        root: {
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: typography.fontWeightLight,
            letterSpacing: 0,
            marginLeft: 0,
            marginRight: 0,
            color: palette.grey[300],
            marginTop: "4px",
            display: "flex",
            gap: spacing(1),
        },
    }),
});
