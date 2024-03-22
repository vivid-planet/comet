import { PreviewData } from "@src/app/api/site-preview/route";

function graphQLHeaders(previewData?: PreviewData) {
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

type Fetch = typeof fetch;

export function createFetchWithPreviewHeaders(fetch: Fetch, previewData?: PreviewData) {
    const defaultHeaders = graphQLHeaders(previewData);
    return async function (input: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(input, {
            ...init,
            headers: { ...defaultHeaders, ...init?.headers },
        });
    };
}

//from graphql-request
export const gql = (chunks: TemplateStringsArray, ...variables: unknown[]): string => {
    return chunks.reduce((acc, chunk, index) => `${acc}${chunk}${index in variables ? String(variables[index]) : ``}`, ``);
};

export type GraphqlFetch = <T, V>(query: string, variables?: V, init?: RequestInit) => Promise<T>;

export function createGraphqlFetch(fetch: Fetch, url: string): GraphqlFetch {
    return async function <T, V>(query: string, variables?: V, init?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            method: "POST",
            ...init,
            headers: { "Content-Type": "application/json", ...init?.headers },
            body: JSON.stringify({
                query,
                variables,
            }),
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const { data, errors } = await response.json();
        if (errors) {
            const errorMessage = errors.map((error) => error.message).join("\n");
            throw new Error(`GraphQL Error: ${errorMessage}`);
        }

        return data;
    };
}

export function createGraphlFetchWithPreviewHeaders(fetch: Fetch, previewData?: PreviewData) {
    const url = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
    return createGraphqlFetch(createFetchWithPreviewHeaders(fetch, previewData), url);
}
