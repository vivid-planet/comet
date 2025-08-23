import {
    convertPreviewDataToHeaders,
    createFetchWithDefaultNextRevalidate,
    createFetchWithDefaults,
    createGraphQLFetch as createGraphQLFetchLibrary,
    type GraphQLFetch,
    type SitePreviewData,
} from "@comet/site-nextjs";

import { getVisibilityParam } from "./ServerContext";

type Fetch = typeof fetch;

function createPersistedQueryGraphQLFetch(fetch: Fetch, url: string): GraphQLFetch {
    return async function <T, V>(query: string | { hash: string }, variables?: V, init?: RequestInit): Promise<T> {
        if (typeof query === "string") throw new Error("at runtime only hashed queries are supported");
        const hash = query.hash; //await sha256(query.trim());
        let response;
        if (init?.method === "GET") {
            const fetchUrl = new URL(url);
            fetchUrl.searchParams.append("extensions.persistedQuery.sha256Hash", hash);
            fetchUrl.searchParams.append("variables", JSON.stringify(variables));
            response = await fetch(fetchUrl, {
                ...init,
                headers: {
                    /**
                     * It's recommended to add the `Apollo-Require-Preflight` header to GET requests, running on an Apollo Server 4.
                     *
                     * If this header is missing, Apollo Server 4 will return: This operation has been blocked as a potential Cross-Site Request Forgery (CSRF).
                     *
                     * see: https://www.apollographql.com/docs/graphos/routing/security/csrf#enable-csrf-prevention
                     */
                    "Apollo-Require-Preflight": "true",
                    ...init.headers,
                },
            });
        } else {
            response = await fetch(url, {
                method: "POST",
                ...init,
                headers: { "Content-Type": "application/json", ...init?.headers },
                body: JSON.stringify({
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: hash,
                        },
                    },
                    variables,
                }),
            });
        }
        if (!response.ok) {
            let errorMessage = `Network response was not ok. Status: ${response.status}`;
            const body = await response.text();

            try {
                const json = JSON.parse(body);

                const { errors } = json;
                if (errors) {
                    errorMessage += `\n\nGraphQL error(s):\n- ${errors.map((error: { message: string }) => error.message).join("\n- ")}`;
                }
            } catch {
                errorMessage += `\n${body}`;
            }

            throw new Error(errorMessage);
        }

        const { data, errors } = await response.json();

        if (errors) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error(`GraphQL error(s):\n- ${errors.map((error: any) => error.message).join("\n- ")}`);
        }

        return data;
    };
}

export function createGraphQLFetch() {
    if (process.env.NEXT_RUNTIME === "edge") {
        throw new Error("createGraphQLFetch: cannot use in edge runtime, use createGraphQLFetchMiddleware instead.");
    }

    let previewData: SitePreviewData | undefined;
    const visibilityParam = getVisibilityParam();
    if (visibilityParam === "invisibleBlocks") previewData = { includeInvisible: true };
    if (visibilityParam === "invisiblePages") previewData = { includeInvisible: false };

    if (typeof window !== "undefined") {
        // Client-side rendering
        return createPersistedQueryGraphQLFetch(
            createFetchWithDefaults(fetch, {
                headers: {
                    ...convertPreviewDataToHeaders(previewData),
                },
            }),
            `/graphql`, // api route
        );
    } else {
        // Server-side rendering
        if (!process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD) {
            throw new Error("API_BASIC_AUTH_SYSTEM_USER_PASSWORD is not set");
        }
        return createGraphQLFetchLibrary(
            // set a default revalidate time of 7.5 minutes to get an effective cache duration of 15 minutes if a CDN cache is enabled
            // see cache-handler.ts for maximum cache duration (24 hours)
            createFetchWithDefaults(createFetchWithDefaultNextRevalidate(fetch, 7.5 * 60), {
                headers: {
                    authorization: `Basic ${Buffer.from(`system-user:${process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
                    ...convertPreviewDataToHeaders(previewData),
                },
            }),
            `${process.env.API_URL_INTERNAL}/graphql`,
        );
    }
}
