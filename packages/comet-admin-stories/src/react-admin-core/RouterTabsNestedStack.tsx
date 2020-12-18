import { Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { RouterTab, RouterTabs, Stack, StackPage, StackSwitch, StackSwitchApiContext } from "@vivid-planet/comet-admin";
import * as React from "react";
import StoryRouter from "storybook-react-router";

function Story() {
    return (
        <Stack topLevelTitle="Root Stack">
            <RouterTabs>
                <RouterTab label="Page 1" path="">
                    <Stack topLevelTitle="Nested Stack">
                        <StackSwitch>
                            <StackPage name="table">
                                <StackSwitchApiContext.Consumer>
                                    {(stackApi) => (
                                        <Button color="primary" variant="contained" onClick={() => stackApi.activatePage("edit", "test")}>
                                            Test
                                        </Button>
                                    )}
                                </StackSwitchApiContext.Consumer>
                            </StackPage>
                            <StackPage name="edit" title="Edit">
                                <RouterTabs>
                                    <RouterTab label="Page 3" path="">
                                        Page 3
                                    </RouterTab>
                                </RouterTabs>
                            </StackPage>
                        </StackSwitch>
                    </Stack>
                </RouterTab>
                <RouterTab label="Page 2" path="/page2">
                    Page 2
                </RouterTab>
            </RouterTabs>
        </Stack>
    );
}

storiesOf("comet-admin", module)
    .addDecorator(StoryRouter())
    .add("RouterTabs with nested Stack", () => <Story />);
