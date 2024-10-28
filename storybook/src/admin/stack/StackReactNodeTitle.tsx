import { Stack, StackBreadcrumbs, StackPage, StackPageTitle, useStackSwitch } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const [StackSwitch, api] = useStackSwitch();

    return (
        <Stack topLevelTitle={<Typography color="primary">Page 1</Typography>}>
            <StackBreadcrumbs />
            <StackSwitch initialPage="page1">
                <StackPage name="page1">
                    <Typography variant="h1">Page 1</Typography>
                    <Button onClick={() => api.activatePage("page2", "foo")}>To page 2</Button>
                </StackPage>
                <StackPage name="page2">
                    <StackPageTitle title={<Typography color="secondary">Page 2</Typography>}>
                        <Typography variant="h2">Page 2</Typography>
                    </StackPageTitle>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const StackWithReactReactNodeTitle = () => <Story />;

StackWithReactReactNodeTitle.storyName = "Stack with React.ReactNode title";
