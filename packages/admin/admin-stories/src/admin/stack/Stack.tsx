import { Stack, StackBreadcrumbs } from "@comet/admin";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <Typography>Foo</Typography>
        </Stack>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("Stack", () => <Story />);
