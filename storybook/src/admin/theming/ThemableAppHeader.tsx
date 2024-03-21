import { AppHeader, CometLogo, MuiThemeProvider } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
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
                <CometLogo />
            </AppHeader>
            <AppHeader position="static" color="secondary">
                <CometLogo />
            </AppHeader>
        </MuiThemeProvider>
    );
}

storiesOf("@comet/admin/theming", module).add("Themable AppHeader", () => <Story />);
