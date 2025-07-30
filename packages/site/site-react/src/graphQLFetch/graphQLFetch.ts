type Fetch = typeof fetch;

export type PreviewData = {
    includeInvisible: boolean;
};

export function convertPreviewDataToHeaders(previewData?: PreviewData) {
    const { includeInvisibleBlocks, includeInvisiblePages } = {
        includeInvisiblePages: !!previewData,
        includeInvisibleBlocks: previewData && previewData.includeInvisible,
    };

    const headers: Record<string, string> = {};
    const includeInvisibleContentHeaderEntries: string[] = [];
    if (includeInvisiblePages) {
        includeInvisibleContentHeaderEntries.push("Pages:Unpublished");
    }
    if (includeInvisibleBlocks) {
        includeInvisibleContentHeaderEntries.push("Blocks:Invisible");
    }
    // tells api to send invisble content
    // authentication is required when this header is used
    if (includeInvisibleContentHeaderEntries.length > 0) {
        headers["x-include-invisible-content"] = includeInvisibleContentHeaderEntries.join(",");
        headers["x-preview-dam-urls"] = "1";
    }
    return headers;
}

// Adapted from https://github.com/jasonkuhrt/graffle/blob/main/src/layers/6_helpers/gql.ts
export const gql = (chunks: TemplateStringsArray, ...variables: unknown[]): string => {
    return chunks.reduce((acc, chunk, index) => {
        let variable;

        if (index in variables) {
            if (typeof variables[index] !== "string") {
                let errorMessage =
                    `Non-string variable in the GraphQL document\n\n` +
                    `This is most likely due to importing a GraphQL document from a React Client Component.\n` +
                    `All GraphQL documents need to be imported from React Server Components (i.e. no "use client" notation).`;

                if (chunk.trim().length > 0) {
                    errorMessage += `\n\nThe error occurred in the following GraphQL document:\n${chunk}`;
                }

                throw new Error(errorMessage);
            } else {
                variable = variables[index];
            }
        } else {
            variable = "";
        }

        return `${acc}${chunk}${variable}`;
    }, ``);
};

export function createFetchWithPreviewHeaders(fetch: Fetch, previewData?: PreviewData): Fetch {
    const defaultHeaders = convertPreviewDataToHeaders(previewData);
    return createFetchWithDefaults(fetch, { headers: defaultHeaders });
}

export function createFetchWithDefaults(fetch: Fetch, defaults: RequestInit): Fetch {
    return async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        return fetch(input, {
            ...defaults,
            ...init,
            headers: {
                ...defaults.headers,
                ...init?.headers,
            },
        });
    };
}

export type GraphQLFetch = <T, V>(query: string, variables?: V, init?: RequestInit) => Promise<T>;

export function createGraphQLFetch(fetch: Fetch, url: string): GraphQLFetch {
    return async function <T, V>(query: string, variables?: V, init?: RequestInit): Promise<T> {
        let response;
        if (init?.method === "GET") {
            const fetchUrl = new URL(url);
            fetchUrl.searchParams.append("query", query);
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
                    query,
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
