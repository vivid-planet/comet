import { MockedProvider } from "@apollo/client/testing";
import { StoryContext } from "@storybook/addons";
import * as React from "react";
import { MemoryRouter } from "react-router";

export function editDialogDecorator() {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <MockedProvider>
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            </MockedProvider>
        );
    };
}
