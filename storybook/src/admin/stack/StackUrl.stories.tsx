import { Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch } from "@comet/admin";
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
                            <StackLink pageName="page2" payload="test">
                                go to page 2
                            </StackLink>
                        </StackPage>
                        <StackPage name="page2">
                            <h3>Page 2</h3>
                            <p>
                                <StackLink pageName="page1" payload="test">
                                    go to page 1
                                </StackLink>
                            </p>
                            <StackSwitch>
                                <StackPage name="page2-1">
                                    <h3>Page 2-1</h3>
                                    <p>
                                        <StackLink pageName="page2-2" payload="test">
                                            go to page 2-2
                                        </StackLink>
                                    </p>
                                </StackPage>
                                <StackPage name="page2-2">
                                    <h3>Page 2-2</h3>
                                    <p>
                                        <StackLink pageName="page2-1" payload="test">
                                            go to page 2-1
                                        </StackLink>
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
