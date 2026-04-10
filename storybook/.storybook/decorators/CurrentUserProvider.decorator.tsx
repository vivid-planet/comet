import { CurrentUserProvider } from "@comet/cms-admin";
import { type Decorator } from "@storybook/react-webpack5";

export const CurrentUserProviderDecorator: Decorator = (fn, context) => {
    return <CurrentUserProvider>{fn()}</CurrentUserProvider>;
};
