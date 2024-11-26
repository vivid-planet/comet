import { Stack, StackBreadcrumbs } from "@comet/admin";
import { Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const _Stack = () => {
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <Typography>Foo</Typography>
        </Stack>
    );
};
