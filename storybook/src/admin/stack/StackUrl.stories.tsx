import { Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { Link } from "@mui/material";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const StackUrl = {
    render: () => {
        const location = useLocation();

        return (
            <>
                <p>Pathname: {location.pathname}</p>
                <Stack topLevelTitle="Stack Url">
                    <StackBreadcrumbs />
                    <StackSwitch>
                        <StackPage name="page1">
                            <h3>Page 1</h3>
                            <Link component={StackLink} pageName="page2" payload="test">
                                go to page 2
                            </Link>
                        </StackPage>
                        <StackPage name="page2">
                            <h3>Page 2</h3>
                            <p>
                                <Link component={StackLink} pageName="page1" payload="test">
                                    go to page 1
                                </Link>
                            </p>
                            <StackSwitch>
                                <StackPage name="page2-1">
                                    <h3>Page 2-1</h3>
                                    <p>
                                        <Link component={StackLink} pageName="page2-2" payload="test">
                                            go to page 2-2
                                        </Link>
                                    </p>
                                </StackPage>
                                <StackPage name="page2-2">
                                    <h3>Page 2-2</h3>
                                    <p>
                                        <Link component={StackLink} pageName="page2-1" payload="test">
                                            go to page 2-1
                                        </Link>
                                    </p>
                                </StackPage>
                            </StackSwitch>
                        </StackPage>
                    </StackSwitch>
                </Stack>
            </>
        );
    },

    name: "StackUrl",
};
