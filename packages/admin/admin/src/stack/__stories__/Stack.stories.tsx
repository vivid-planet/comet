import { Stack, StackBreadcrumbs } from "@comet/admin";
import { Typography } from "@mui/material";

import { storyRouterDecorator } from "../../../.storybook/decorators/storyRouter.decorator";

export default {
    title: "components/stack/Stack",
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
