import { DextinityLogo } from "@dextinity/admin-icons";

import { MuiThemeProvider } from "../../mui/ThemeProvider";
import { createCometTheme } from "../../theme/createCometTheme";
import { AppHeader } from "../AppHeader";

export default {
    title: "components/appHeader/Theming",
};

export const ThemableAppHeader = {
    render: () => {
        const theme = createCometTheme({
            components: {
                CometAdminAppHeader: {
                    defaultProps: {
                        headerHeight: 60,
                    },
                    styleOverrides: {
                        root: {
                            border: "1px solid black",
                        },
                        positionRelative: {
                            backgroundColor: "red",
                        },
                        colorSecondary: {
                            backgroundColor: "teal",
                        },
                    },
                },
            },
        });
        return (
            <MuiThemeProvider theme={theme}>
                <AppHeader position="relative">
                    <DextinityLogo variant="light" sx={{ fontSize: 34 }} />
                </AppHeader>
                <AppHeader position="static" color="secondary">
                    <DextinityLogo variant="light" sx={{ fontSize: 34 }} />
                </AppHeader>
            </MuiThemeProvider>
        );
    },

    name: "Themable AppHeader",
};
