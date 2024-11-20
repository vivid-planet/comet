import { ErrorDialogHandler } from "@comet/admin";
import { Decorator } from "@storybook/react";
import * as React from "react";

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
