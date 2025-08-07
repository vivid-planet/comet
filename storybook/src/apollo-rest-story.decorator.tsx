import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { type Decorator } from "@storybook/react-webpack5";
import { RestLink } from "apollo-link-rest";

export function apolloRestStoryDecorator(options?: { uri?: string; responseTransformer?: RestLink.ResponseTransformer }): Decorator {
    return (Story) => {
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
