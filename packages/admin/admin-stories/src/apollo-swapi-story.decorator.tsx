import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createErrorDialogApolloLink } from "@comet/admin";
import { LegacyStoryFn } from "@storybook/addons";
import * as React from "react";

import { DecoratorContext } from "./storyHelpers";

const createApolloClient = () => {
    const link = ApolloLink.from([
        createErrorDialogApolloLink(),
        createHttpLink({
            uri: `https://swapi-graphql.netlify.app/.netlify/functions/index`, // Test API here: https://graphql.org/swapi-graphql
        }),
    ]);
    const cache = new InMemoryCache();
    return new ApolloClient({
        link,
        cache,
    });
};

const apolloClient = createApolloClient();

const SwapiApolloProvider: React.FunctionComponent = ({ children }) => {
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export function apolloSwapiStoryDecorator<StoryFnReturnType = unknown>() {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
        return <SwapiApolloProvider>{fn(c)}</SwapiApolloProvider>;
    };
}
