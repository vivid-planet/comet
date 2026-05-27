import { Stack, StackBreadcrumbs } from "@comet/admin";
import { Typography } from "@mui/material";

export default {
    title: "components/stack/Stack",
};

export const _Stack = () => {
    return (
        <Stack topLevelTitle="Stack">
            <StackBreadcrumbs />
            <Typography>Foo</Typography>
        </Stack>
    );
};
