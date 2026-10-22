import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import type { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiFormControlLabel: GetMuiComponentTheme<"MuiFormControlLabel"> = (component) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiFormControlLabel">(component?.styleOverrides, {
        root: {
            // The checkboxes, radios and switches of @dextinity/ui have no padding around them, unlike MUI's.
            marginLeft: 0,
            marginTop: 0,
            marginBottom: 0,
            minHeight: 40,
            gap: "var(--dextinity-space-sm)",
        },
    }),
});
