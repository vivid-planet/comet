import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiFormControlLabel: GetMuiComponentTheme<"MuiFormControlLabel"> = (styleOverrides) => ({
    styleOverrides: mergeOverrideStyles<"MuiFormControlLabel">(styleOverrides, {
        root: {
            marginLeft: -9,
            marginTop: -7,
            marginBottom: -7,
        },
    }),
});
