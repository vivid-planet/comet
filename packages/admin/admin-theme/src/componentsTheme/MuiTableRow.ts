import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTableRow: GetMuiComponentTheme<"MuiTableRow"> = (styleOverrides) => ({
    styleOverrides: mergeOverrideStyles<"MuiTableRow">(styleOverrides, {
        root: {
            backgroundColor: "#fff",
        },
    }),
});
