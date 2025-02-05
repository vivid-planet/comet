import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItem: GetMuiComponentTheme<"MuiListItem"> = (component) => ({
    ...component,
    defaultProps: {
        dense: true,
        ...component?.defaultProps,
    },
});
