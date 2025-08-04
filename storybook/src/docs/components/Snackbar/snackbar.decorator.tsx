import { SnackbarProvider } from "@comet/admin";
import { type Decorator } from "@storybook/react-webpack5";

export function snackbarDecorator(): Decorator {
    return (Story) => {
        return (
            <SnackbarProvider>
                <Story />
            </SnackbarProvider>
        );
    };
}
