import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiLink: GetMuiComponentTheme<"MuiLink"> = (styleOverrides, { palette }) => ({
    defaultProps: {
        underline: "always",
    },
    styleOverrides: mergeOverrideStyles<"MuiLink">(styleOverrides, {
        root: {
            color: palette.grey[600],
        },
    }),
});
