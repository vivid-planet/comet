import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiSvgIcon: GetMuiComponentTheme<"MuiSvgIcon"> = (component, { palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiSvgIcon">(component?.styleOverrides, {
        root: {},
        colorDisabled: {
            color: palette.grey[200],
        },
        fontSizeSmall: {
            fontSize: 10,
        },
        // @ts-expect-error The type for `fontSizeMedium` is missing, but the class exsits.
        fontSizeMedium: {
            fontSize: 16,
        },
        fontSizeLarge: {
            fontSize: 20,
        },
    }),
});
