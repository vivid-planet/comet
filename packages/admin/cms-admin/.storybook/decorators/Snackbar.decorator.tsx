import { SnackbarProvider } from "@comet/admin";
import type { Decorator } from "@storybook/react-vite";

export const SnackbarDecorator: Decorator = (Story) => (
    <SnackbarProvider>
        <Story />
    </SnackbarProvider>
);
