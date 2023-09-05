import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiInput: GetMuiComponentTheme<"MuiInput"> = (component, { palette, spacing }) => ({
    ...component,
    defaultProps: {
        disableUnderline: true,
        ...component?.defaultProps,
    },
});
