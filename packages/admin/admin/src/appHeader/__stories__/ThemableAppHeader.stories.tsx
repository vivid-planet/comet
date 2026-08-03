import { CometLogo } from "../../common/CometLogo";
import { MuiThemeProvider } from "../../mui/ThemeProvider";
import { createDextinityTheme } from "../../theme/createDextinityTheme";
import { AppHeader } from "../AppHeader";

export default {
    title: "components/appHeader/Theming",
};

export const ThemableAppHeader = {
    render: () => {
        const theme = createDextinityTheme({
            components: {
                DextinityAdminAppHeader: {
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
                    <CometLogo />
                </AppHeader>
                <AppHeader position="static" color="secondary">
                    <CometLogo />
                </AppHeader>
            </MuiThemeProvider>
        );
    },

    name: "Themable AppHeader",
};
