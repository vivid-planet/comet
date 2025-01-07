import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { Decorator } from "@storybook/react";

export function editDialogDecorator(): Decorator {
    return (Story) => {
        return (
            <MockedProvider>
                <RouterMemoryRouter>
                    <Story />
                </RouterMemoryRouter>
            </MockedProvider>
        );
    };
}
