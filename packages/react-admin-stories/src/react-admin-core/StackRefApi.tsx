import { storiesOf } from "@storybook/react";
import { Stack, StackPage, useStackSwitch } from "@vivid-planet/react-admin-core";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

function Story() {
    const { StackSwitch, api } = useStackSwitch({ initialPage: "page1" });
    // demonstrate how to access the StackSwitchApi in the component where StackSwich is created (useStackSwitchApi doesn't work)
    return (
        <div>
            <button
                onClick={() => {
                    api.activatePage("page2", "foo");
                }}
            >
                page2
            </button>
            <Stack topLevelTitle="Stack">
                <StackSwitch>
                    <StackPage name="page1">
                        <div>page1</div>
                    </StackPage>
                    <StackPage name="page2">
                        <div>page2</div>
                    </StackPage>
                </StackSwitch>
            </Stack>
        </div>
    );
}

function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/foo" />
            </Route>
            <Route path="/foo">
                <Story />
            </Route>
        </Switch>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(StoryRouter())
    .add("Stack Ref Api", () => <App />);
