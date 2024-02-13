import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StoryContext } from "@storybook/addons";
import { RestLink } from "apollo-link-rest";
import * as React from "react";

export function apolloRestStoryDecorator(options?: { uri?: string; responseTransformer?: RestLink.ResponseTransformer }) {
    return (Story: React.ComponentType, c: StoryContext) => {
        const link = ApolloLink.from([
            new RestLink({
                uri: options?.uri || "https://jsonplaceholder.typicode.com/",
                responseTransformer: options?.responseTransformer,
            }),
        ]);

        const cache = new InMemoryCache();
        const client = new ApolloClient({
            link,
            cache,
        });

        return (
            <ApolloProvider client={client}>
                <Story />
            </ApolloProvider>
        );
    };
}
