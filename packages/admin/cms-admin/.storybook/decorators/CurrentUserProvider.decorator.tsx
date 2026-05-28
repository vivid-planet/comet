import { CurrentUserProvider } from "@comet/cms-admin";
import type { Decorator } from "@storybook/react-vite";

export const CurrentUserProviderDecorator: Decorator = (Story) => (
    <CurrentUserProvider>
        <Story />
    </CurrentUserProvider>
);
