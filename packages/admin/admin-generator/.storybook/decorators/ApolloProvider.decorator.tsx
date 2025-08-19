import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";

import { createErrorDialogApolloLink } from "@comet/admin";

const createApolloClient = () => {
    const link = ApolloLink.from([
        createErrorDialogApolloLink(),
        createHttpLink({
            uri: "/graphql",
        }),
    ]);

    return new ApolloClient({
        cache: new InMemoryCache(),
        link,
    });
};
export function ApolloProviderDecorator(fn) {
    return <ApolloProvider client={createApolloClient()}>{fn()}</ApolloProvider>;
}
