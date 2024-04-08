import { MuiThemeProvider } from "@comet/admin";
import { Favorite } from "@comet/admin-icons";
import { createCometTheme } from "@comet/admin-theme";
import { Card, CardContent, Link, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { MyComponent } from "./MyComponent";

function Story() {
    const theme = createCometTheme({
        components: {
            CometAdminMyComponent: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        backgroundColor: "#222",
                    },
                    title: {
                        color: "white",
                    },
                },
            },
        },
    });
    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Typography>
                        Based on the MyComponent example from the{" "}
                        <Link
                            href="https://docs.comet-dxp.com/docs/comet-core-development/create-admin-components-with-theme-support"
                            target="_blank"
                        >
                            docs
                        </Link>
                        .
                    </Typography>
                </CardContent>
            </Card>
            <Typography variant="h3" sx={{ pt: 8 }}>
                MyComponent
            </Typography>
            <MyComponent title="Default" />
            <MuiThemeProvider theme={theme}>
                <MyComponent title="With Custom Theme" />
            </MuiThemeProvider>
            <Typography variant="h3" sx={{ pt: 8 }}>
                MyComponent with shadow
            </Typography>
            <MyComponent shadow title="Default" />
            <MuiThemeProvider theme={theme}>
                <MyComponent shadow title="With Custom Theme" />
            </MuiThemeProvider>
            <Typography variant="h3" sx={{ pt: 8 }}>
                MyComponent with custom icon
            </Typography>
            <MyComponent title="Default" />
            <MyComponent
                title="With Custom Icon"
                iconMapping={{
                    header: <Favorite htmlColor="#FFD700" fontSize="large" />,
                }}
            />
        </Stack>
    );
}

storiesOf("@comet/admin/theming", module).add("Themable MyComponent", () => <Story />);
