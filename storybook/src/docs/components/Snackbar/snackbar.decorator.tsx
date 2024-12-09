import { SnackbarProvider } from "@comet/admin";
import { Decorator } from "@storybook/react";
import * as React from "react";

export function snackbarDecorator(): Decorator {
    return (Story) => {
        return (
            <SnackbarProvider>
                <Story />
            </SnackbarProvider>
        );
    };
}
