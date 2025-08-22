import { CometConfigProvider } from "@comet/cms-admin";
import { type Decorator } from "@storybook/react-webpack5";

export const CometConfigProviderDecorator: Decorator = (fn, context) => {
    return (
        <CometConfigProvider graphQLApiUrl="/graphql" apiUrl="" adminUrl="">
            {fn()}
        </CometConfigProvider>
    );
};
