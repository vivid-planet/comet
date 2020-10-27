import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Stack, StackPage, StackSwitchApiContext, useStackSwitch } from "@vivid-planet/react-admin-core";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

function Page1() {
    const switchApi = React.useContext(StackSwitchApiContext);
    return (
        <button
            onClick={e => {
                switchApi.activatePage("page2", "test");
            }}
        >
            activate page2
        </button>
    );
}

function Page2() {
    const { StackSwitch } = useStackSwitch({ initialPage: "page1" });
    return (
        <Stack topLevelTitle="Stack Nested">
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">page2-2</StackPage>
            </StackSwitch>
        </Stack>
    );
}

function Story() {
    const { StackSwitch } = useStackSwitch({ initialPage: "page1" });
    return (
        <Stack topLevelTitle="Stack">
            <StackSwitch>
                <StackPage name="page1">
                    <Page1 />
                </StackPage>
                <StackPage name="page2">
                    <Page2 />
                </StackPage>
            </StackSwitch>
        </Stack>
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
    .add("Stack Nested", () => <App />);
