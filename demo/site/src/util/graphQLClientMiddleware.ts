import { createFetchWithDefaults, createGraphQLFetch } from "@comet/cms-site";

export function createGraphQLFetchMiddleware() {
    return createGraphQLFetch(
        createFetchWithDefaults(fetch, {
            next: {
                revalidate: 7.5 * 60,
            },
            headers: {
                authorization: `Basic ${Buffer.from(`vivid:${process.env.API_PASSWORD}`).toString("base64")}`,
            },
        }),
        `${process.env.API_URL_INTERNAL}/graphql`,
    );
}
