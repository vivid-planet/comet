import { CurrentUserProvider } from "@comet/cms-admin";
import type { Decorator } from "@storybook/react-vite";

export const CurrentUserProviderDecorator: Decorator = (fn, context) => {
    return <CurrentUserProvider>{fn()}</CurrentUserProvider>;
};
