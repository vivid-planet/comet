import { RouterTab, RouterTabs, Stack, StackBreadcrumbs, StackPage, StackSwitch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    return (
        <Stack topLevelTitle="Root Stack">
            <StackBreadcrumbs />
            <RouterTabs>
                <RouterTab label="Page 1" path="">
                    <StackSwitch>
                        <StackPage name="table">
                            <RouterTabs>
                                <RouterTab label="Page 3" path="">
                                    Page 3
                                </RouterTab>
                                <RouterTab label="Page 4 (with RouterTabs)" path="/page4">
                                    Now the first level of RouterTabs (Page 1 and Page 2) disappeared
                                    <StackSwitch>
                                        <StackPage name="table">
                                            <RouterTabs>
                                                <RouterTab label="Page 5" path="">
                                                    Page 5
                                                </RouterTab>
                                                <RouterTab label="Page 6" path="/page6">
                                                    Page 6
                                                </RouterTab>
                                            </RouterTabs>
                                        </StackPage>
                                        <StackPage name="stackpage-2">StackPage 2</StackPage>
                                    </StackSwitch>
                                </RouterTab>
                            </RouterTabs>
                        </StackPage>
                        <StackPage name="edit">Edit</StackPage>
                    </StackSwitch>
                </RouterTab>
                <RouterTab label="Page 2" path="/page2">
                    Page 2
                </RouterTab>
            </RouterTabs>
        </Stack>
    );
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("Nested StackSwitch with RouterTabs", () => <Story />);
