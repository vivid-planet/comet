import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiSvgIcon: GetMuiComponentTheme<"MuiSvgIcon"> = (styleOverrides, { palette }) => ({
    styleOverrides: mergeOverrideStyles<"MuiSvgIcon">(styleOverrides, {
        root: {
            fontSize: 16,
        },
        colorDisabled: {
            color: palette.grey[200],
        },
        fontSizeSmall: {
            fontSize: 10,
        },
        fontSizeLarge: {
            fontSize: 20,
        },
    }),
});
