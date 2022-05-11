import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTabs: GetMuiComponentTheme<"MuiTabs"> = (styleOverrides, { palette, spacing }) => ({
    styleOverrides: mergeOverrideStyles<"MuiTabs">(styleOverrides, {
        root: {
            position: "relative",
            marginBottom: spacing(4),

            "&:after": {
                content: '""',
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                height: 1,
                backgroundColor: palette.grey[100],
            },
        },
        scroller: {
            zIndex: 1,
        },
        indicator: {
            backgroundColor: palette.primary.main,
            height: 2,
        },
    }),
});
