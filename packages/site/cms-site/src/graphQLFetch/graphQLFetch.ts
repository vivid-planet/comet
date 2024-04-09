import { SitePreviewParams } from "../sitePreview/SitePreviewApiHelper";

type SitePreviewData = SitePreviewParams["settings"];
type Fetch = typeof fetch;

function graphQLHeaders(previewData?: SitePreviewData) {
    const { includeInvisibleBlocks, includeInvisiblePages, previewDamUrls } = {
        includeInvisiblePages: !!previewData,
        includeInvisibleBlocks: previewData && previewData.includeInvisible,
        previewDamUrls: !!previewData,
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
    }
    // tells api to create preview image urls
    // authentication is required when this header is used
    if (previewDamUrls) {
        headers["x-preview-dam-urls"] = "1";
    }
    return headers;
}

//from graphql-request https://github.com/jasonkuhrt/graphql-request/blob/main/src/raw/functions/gql.ts
export const gql = (chunks: TemplateStringsArray, ...variables: unknown[]): string => {
    return chunks.reduce((acc, chunk, index) => `${acc}${chunk}${index in variables ? String(variables[index]) : ``}`, ``);
};

export function createFetchWithPreviewHeaders(fetch: Fetch, previewData?: SitePreviewData) {
    const defaultHeaders = graphQLHeaders(previewData);
    return createFetchWithDefaults(fetch, { headers: defaultHeaders });
}

export function createFetchWithDefaults(fetch: Fetch, defaults: RequestInit) {
    return async function (input: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(input, {
            ...defaults,
            ...init,
            headers: {
                ...defaults.headers,
                ...init?.headers,
            },
            next: {
                ...defaults.next,
                ...init?.next,
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
            response = await fetch(fetchUrl, init);
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
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const { data, errors } = await response.json();
        if (errors) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorMessage = errors.map((error: any) => error.message).join("\n");
            throw new Error(`GraphQL Error: ${errorMessage}`);
        }

        return data;
    };
}
