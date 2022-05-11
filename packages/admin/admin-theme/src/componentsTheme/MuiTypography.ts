import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTypography: GetMuiComponentTheme<"MuiTypography"> = (component) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiTypography">(component?.styleOverrides, {
        gutterBottom: {
            marginBottom: 20,
        },
    }),
});
