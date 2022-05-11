import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiCardContent: GetMuiComponentTheme<"MuiCardContent"> = (styleOverrides, { spacing }) => ({
    styleOverrides: mergeOverrideStyles<"MuiCardContent">(styleOverrides, {
        root: {
            padding: spacing(4),
            "&:last-child": {
                paddingBottom: spacing(4),
            },
        },
    }),
});
