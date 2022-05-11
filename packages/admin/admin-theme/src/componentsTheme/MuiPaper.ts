import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiPaper: GetMuiComponentTheme<"MuiPaper"> = (styleOverrides, { palette }) => ({
    defaultProps: {
        square: true,
    },
    styleOverrides: mergeOverrideStyles<"MuiPaper">(styleOverrides, {
        outlined: {
            borderTop: "none",
            borderRight: "none",
            borderBottom: `1px solid ${palette.divider}`,
            borderLeft: "none",
        },
    }),
});
