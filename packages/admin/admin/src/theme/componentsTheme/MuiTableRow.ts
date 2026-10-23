import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import type { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTableRow: GetMuiComponentTheme<"MuiTableRow"> = (component, { palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiTableRow">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.background.paper,
        },
    }),
});
