import { MuiThemeProvider, Stack, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const theme = createCometTheme({
    overrides: {
        CometAdminStackLink: {
            root: {
                padding: "10px",
                border: "solid black 1px",
            },
        },
    },
});

function Story() {
    return (
        <MuiThemeProvider theme={theme}>
            <Stack topLevelTitle="Example Stack with StackLinks">
                <StackSwitch>
                    <StackPage name="page1">
                        <h3>Page 1</h3>
                        <StackLink color="secondary" pageName="page2" payload="test">
                            link with secondary color
                        </StackLink>
                    </StackPage>
                    <StackPage name="page2">
                        <h3>Page 2</h3>
                        <StackLink underline="none" pageName="page1" payload="test">
                            link to page1
                        </StackLink>
                    </StackPage>
                </StackSwitch>
            </Stack>
        </MuiThemeProvider>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("StackLink", () => <Story />);
