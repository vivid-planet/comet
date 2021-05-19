import { Breadcrumbs, Stack } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

function Story() {
    return (
        <Stack topLevelTitle="Stack">
            <Breadcrumbs />
            <Typography>Foo</Typography>
        </Stack>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(StoryRouter())
    .add("Stack", () => <Story />);
