import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTypography: GetMuiComponentTheme<"MuiTypography"> = (component) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
        variantMapping: {
            ...component?.defaultProps?.variantMapping,
            list: "ul",
            listItem: "li",
        },
    },
    styleOverrides: mergeOverrideStyles<"MuiTypography">(component?.styleOverrides, {
        gutterBottom: {
            marginBottom: 20,
        },
    }),
});
