import { CurrentUserProvider } from "../../src/userPermissions/hooks/currentUser";
import type { Decorator } from "@storybook/react-vite";

export const CurrentUserProviderDecorator: Decorator = (Story) => (
    <CurrentUserProvider>
        <Story />
    </CurrentUserProvider>
);
