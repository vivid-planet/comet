import { SnackbarProvider } from "@comet/admin";
import { Decorator } from "@storybook/react";

export function snackbarDecorator(): Decorator {
    return (Story) => {
        return (
            <SnackbarProvider>
                <Story />
            </SnackbarProvider>
        );
    };
}
