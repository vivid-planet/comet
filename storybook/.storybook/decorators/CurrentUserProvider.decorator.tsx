import { CurrentUserProvider } from "@comet/cms-admin";
import { type Decorator } from "@storybook/react";

export const CurrentUserProviderDecorator: Decorator = (fn, context) => {
    return <CurrentUserProvider>{fn()}</CurrentUserProvider>;
};
