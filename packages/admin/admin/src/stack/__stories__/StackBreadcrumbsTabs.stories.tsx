import { RouterTab, RouterTabs, Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch } from "@comet/admin";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../../.storybook/decorators/storyRouter.decorator";

export default {
    title: "components/stack/StackBreadcrumbsTabs",
    decorators: [storyRouterDecorator()],
};

export const StackBreadcrumbsWithNestedTabs = {
    render: () => {
        const location = useLocation();

        return (
            <>
                <p>Pathname: {location.pathname}</p>
                <Stack topLevelTitle="Root Stack">
                    <StackBreadcrumbs />
                    <StackSwitch>
                        <StackPage name="table">
                            <RouterTabs>
                                <RouterTab label="Tab 1" path="">
                                    <p>Tab 1</p>
                                </RouterTab>
                                <RouterTab label="Tab 2" path="/tab2">
                                    <p>Tab 2</p>
                                    <StackLink pageName="edit" payload="test">
                                        Edit
                                    </StackLink>
                                </RouterTab>
                            </RouterTabs>
                        </StackPage>
                        <StackPage name="edit" title="Edit">
                            Edit
                        </StackPage>
                    </StackSwitch>
                </Stack>
            </>
        );
    },

    name: "Stack Breadcrumbs with nested Tabs",
};
