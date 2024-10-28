import { Stack, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { Button, Link } from "@mui/material";
import * as React from "react";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const location = useLocation();

    return (
        <>
            <p>Pathname: {location.pathname}</p>
            <Stack topLevelTitle="Example Stack with StackLinks">
                <StackSwitch>
                    <StackPage name="page1">
                        <h3>Page 1</h3>
                        <Link component={StackLink} pageName="page2" payload="test">
                            link based on StackLink
                        </Link>
                    </StackPage>
                    <StackPage name="page2">
                        <h3>Page 2</h3>
                        <Button component={StackLink} pageName="page1" payload="test">
                            button based on StackLink
                        </Button>
                    </StackPage>
                </StackSwitch>
            </Stack>
        </>
    );
}

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const _StackLink = () => <Story />;

_StackLink.storyName = "StackLink";
