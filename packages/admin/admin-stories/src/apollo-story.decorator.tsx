import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import type { StoryContext } from "@storybook/addons";
import * as React from "react";

const createApolloClient = (uri: string) => {
    const link = ApolloLink.from([
        createErrorDialogApolloLink(),
        createHttpLink({
            uri,
        }),
    ]);
    const cache = new InMemoryCache();
    return new ApolloClient({
        link,
        cache,
    });
};

export function apolloStoryDecorator(clientOrUri: ApolloClient<any> | string) {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <ApolloProvider client={typeof clientOrUri == "string" ? createApolloClient(clientOrUri) : clientOrUri}>
                <Story />
            </ApolloProvider>
        );
    };
}

export function apolloSwapiStoryDecorator() {
    return apolloStoryDecorator(`https://swapi-graphql.netlify.app/.netlify/functions/index`); // Test API here: https://graphql.org/swapi-graphql
}
