import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiPopover: GetMuiComponentTheme<"MuiPopover"> = () => ({
    defaultProps: {
        elevation: 1,
    },
});
