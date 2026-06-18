import type { Decorator } from "@storybook/react-vite";

import { ContentScopeProvider } from "../../src/contentScope/Provider";

export const ContentScopeProviderDecorator: Decorator = (Story, context) => {
    if (context.parameters.skipContentScopeProvider) {
        return <Story />;
    }
    return (
        <ContentScopeProvider
            values={[{ scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } }]}
            defaultValue={{ domain: "main", language: "en" }}
        >
            {() => <Story />}
        </ContentScopeProvider>
    );
};
