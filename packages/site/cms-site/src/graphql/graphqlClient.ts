import { GraphQLClient } from "graphql-request";

import { PreviewData } from "../sitePreview/SitePreviewApiHelper";

type RequestConfig = ConstructorParameters<typeof GraphQLClient>[1]; //graphql-request doesn't export RequestConfig

export function createGraphQLClient(url: string, options?: RequestConfig & { previewData?: PreviewData }): GraphQLClient {
    const { previewData, ...gqlOptions } = options ?? {};
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

    return new GraphQLClient(url, {
        headers,
        ...gqlOptions,
    });
}
