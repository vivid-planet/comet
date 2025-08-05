import { ErrorDialogHandler } from "@comet/admin";
import { type Decorator } from "@storybook/react-webpack5";

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
