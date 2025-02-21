import { SnackbarProvider } from "@comet/admin";
import { type Decorator } from "@storybook/react";

export function snackbarDecorator(): Decorator {
    return (Story) => {
        return (
            <SnackbarProvider>
                <Story />
            </SnackbarProvider>
        );
    };
}
