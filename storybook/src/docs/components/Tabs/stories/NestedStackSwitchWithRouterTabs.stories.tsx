import { RouterTab, RouterTabs, Stack, StackBreadcrumbs, StackPage, StackSwitch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/Nested StackSwitch with RouterTabs", module)
    .addDecorator(storyRouterDecorator())
    .add("Nested StackSwitch with RouterTabs", () => {
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
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
                                        <RouterTab label="Page 4" path="/page4">
                                            Now the first level of RouterTabs (Page 1 and 2) disappeared
                                            <StackSwitch>
                                                <StackPage name="table">
                                                    <RouterTabs>
                                                        <RouterTab label="Page 5" path="">
                                                            Page 5
                                                        </RouterTab>
                                                        <RouterTab label="Page 6" path="/page6">
                                                            Now the second level of RouterTabs (Page 3 and 4) also disappeared
                                                            <StackSwitch>
                                                                <StackPage name="table">
                                                                    <RouterTabs>
                                                                        <RouterTab label="Page 7" path="">
                                                                            Page 7
                                                                        </RouterTab>
                                                                        <RouterTab label="Page 8" path="/page8">
                                                                            Page 8
                                                                        </RouterTab>
                                                                    </RouterTabs>
                                                                </StackPage>
                                                                <StackPage name="stackpage-4">StackPage 4</StackPage>
                                                            </StackSwitch>
                                                        </RouterTab>
                                                    </RouterTabs>
                                                </StackPage>
                                                <StackPage name="stackpage-3">StackPage 3</StackPage>
                                            </StackSwitch>
                                        </RouterTab>
                                    </RouterTabs>
                                </StackPage>
                                <StackPage name="stackpage-2">StackPage 2</StackPage>
                            </StackSwitch>
                        </RouterTab>
                        <RouterTab label="Page 2" path="/page2">
                            Page 2
                        </RouterTab>
                    </RouterTabs>
                </Stack>
            </div>
        );
    });
