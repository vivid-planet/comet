import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiCard: GetMuiComponentTheme<"MuiCard"> = (component, { spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiCard">(component?.styleOverrides, {
        root: {
            borderRadius: "4px",
        },
    }),
});
