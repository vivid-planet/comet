import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { LegacyStoryFn } from "@storybook/addons";
import { RestLink } from "apollo-link-rest";
import * as React from "react";

import { DecoratorContext } from "./storyHelpers";

export function apolloStoryDecorator<StoryFnReturnType = unknown>(options?: { uri?: string; responseTransformer?: RestLink.ResponseTransformer }) {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
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

        return <ApolloProvider client={client}>{fn(c)}</ApolloProvider>;
    };
}
