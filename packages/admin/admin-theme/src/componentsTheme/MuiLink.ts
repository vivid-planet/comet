import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiLink: GetMuiComponentTheme<"MuiLink"> = (component, { palette }) => ({
    ...component,
    defaultProps: {
        underline: "always",
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiLink">(component?.styleOverrides, {
        root: {
            color: palette.grey[600],
            fontWeight: 250,
            fontSize: 16,
            lineHeight: "16px",
            letterSpacing: 0,
        },
    }),
});
