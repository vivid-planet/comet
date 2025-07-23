import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { type Decorator } from "@storybook/react-webpack5";

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
