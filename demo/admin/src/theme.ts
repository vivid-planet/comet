import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/lab/themeAugmentation";
import { Theme } from "@mui/material";

export default createCometTheme({
    typography: {
        // TODO move to Button variant "text"
        button: {
            textTransform: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            fontWeight: "inherit",
            color: "inherit",
        },
    },
    // TODO move default props and style overrides to @comet/admin-theme
    components: {
        MuiMenu: {
            defaultProps: {
                elevation: 1,
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    zIndex: 1250,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "uppercase",
                },
            },
        },
    },
});

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
