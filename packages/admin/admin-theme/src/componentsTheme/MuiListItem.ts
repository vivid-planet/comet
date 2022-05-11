import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItem: GetMuiComponentTheme<"MuiListItem"> = () => ({
    defaultProps: {
        dense: true,
    },
});
