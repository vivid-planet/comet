import { Button, Stack, StackBreadcrumbs, StackPage, StackPageTitle, useStackSwitch } from "@comet/admin";
import { Typography } from "@mui/material";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const StackWithReactReactNodeTitle = {
    render: () => {
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
    },

    name: "Stack with ReactNode title",
};
