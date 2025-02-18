import { Button, RouterTab, RouterTabs, Stack, StackBreadcrumbs, StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/stack",
    decorators: [storyRouterDecorator()],
};

export const RouterTabsWithNestedStack = {
    render: () => {
        return (
            <Stack topLevelTitle="Root Stack">
                <StackBreadcrumbs />
                <RouterTabs>
                    <RouterTab label="Page 1" path="">
                        <Stack topLevelTitle="Nested Stack">
                            <StackBreadcrumbs />
                            <StackSwitch>
                                <StackPage name="table">
                                    <StackSwitchApiContext.Consumer>
                                        {(stackApi) => <Button onClick={() => stackApi.activatePage("edit", "test")}>Test</Button>}
                                    </StackSwitchApiContext.Consumer>
                                </StackPage>
                                <StackPage name="edit" title="Edit">
                                    <RouterTabs>
                                        <RouterTab label="Page 3" path="">
                                            Page 3
                                        </RouterTab>
                                    </RouterTabs>
                                </StackPage>
                            </StackSwitch>
                        </Stack>
                    </RouterTab>
                    <RouterTab label="Page 2" path="/page2">
                        Page 2
                    </RouterTab>
                </RouterTabs>
            </Stack>
        );
    },

    name: "RouterTabs with nested Stack",
};
