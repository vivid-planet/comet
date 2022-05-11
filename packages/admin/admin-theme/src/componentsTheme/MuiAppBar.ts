import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAppBar: GetMuiComponentTheme<"MuiAppBar"> = () => ({
    defaultProps: {
        elevation: 0,
    },
});
