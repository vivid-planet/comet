import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink, useErrorDialog } from "@comet/admin";
import { StoryContext, StoryFn } from "@storybook/addons/dist/types";
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

export function apolloSwapiStoryDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        return <SwapiApolloProvider>{fn()}</SwapiApolloProvider>;
    };
}
