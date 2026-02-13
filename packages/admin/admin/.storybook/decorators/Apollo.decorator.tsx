import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { type Decorator } from "@storybook/react-webpack5";

import { createErrorDialogApolloLink } from "../../src/error/errordialog/createErrorDialogApolloLink";

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
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network",
            },
        },
    });
};

export function ApolloDecorator(clientOrUri: ApolloClient<any> | string): Decorator {
    return (Story) => {
        return (
            <ApolloProvider client={typeof clientOrUri == "string" ? createApolloClient(clientOrUri) : clientOrUri}>
                <Story />
            </ApolloProvider>
        );
    };
}
