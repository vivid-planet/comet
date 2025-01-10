import { ErrorDialogHandler } from "@comet/admin";
import { Decorator } from "@storybook/react";

export function errorDialogStoryProviderDecorator(): Decorator {
    return (Story) => {
        return (
            <>
                <ErrorDialogHandler />
                <Story />
            </>
        );
    };
}
