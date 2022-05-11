import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiToggleButtonGroup: GetMuiComponentTheme<"MuiToggleButtonGroup"> = (styleOverrides, { palette }) => ({
    styleOverrides: mergeOverrideStyles<"MuiToggleButtonGroup">(styleOverrides, {
        root: {
            backgroundColor: palette.common.white,
            borderRadius: 1,
        },
    }),
});
