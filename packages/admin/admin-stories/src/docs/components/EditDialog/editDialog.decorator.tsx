import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { StoryContext } from "@storybook/addons";
import * as React from "react";

export function editDialogDecorator() {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <MockedProvider>
                <RouterMemoryRouter>
                    <Story />
                </RouterMemoryRouter>
            </MockedProvider>
        );
    };
}
