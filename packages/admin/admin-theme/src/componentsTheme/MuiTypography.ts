import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTypography: GetMuiComponentTheme<"MuiTypography"> = (styleOverrides) => ({
    styleOverrides: mergeOverrideStyles<"MuiTypography">(styleOverrides, {
        gutterBottom: {
            marginBottom: 20,
        },
    }),
});
