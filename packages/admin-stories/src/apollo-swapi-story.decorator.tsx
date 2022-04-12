import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink, useErrorDialog } from "@comet/admin";
import type { StoryContext } from "@storybook/addons";
import * as React from "react";

const SwapiApolloProvider: React.FunctionComponent = ({ children }) => {
    const errorDialog = useErrorDialog();

    const link = ApolloLink.from([
        createErrorDialogApolloLink({ errorDialog }),
        createHttpLink({
            uri: `https://swapi-graphql.netlify.app/.netlify/functions/index`, // Test API here: https://graphql.org/swapi-graphql
        }),
    ]);
    const cache = new InMemoryCache();

    const apolloClient = new ApolloClient({
        link,
        cache,
    });
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export function apolloSwapiStoryDecorator() {
    return (Story: React.ComponentType, c: StoryContext) => {
        return (
            <SwapiApolloProvider>
                <Story />
            </SwapiApolloProvider>
        );
    };
}
