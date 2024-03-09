import { GraphQLClient } from "graphql-request";
import { RequestConfig } from "graphql-request/build/esm/types";

import { PreviewData } from "../sitePreview/SitePreviewApiHelper";

export function buildGraphqlClientHeaders(previewData?: PreviewData) {
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

export function createGraphQLClient(url: string, requestConfig: RequestConfig & { previewData?: PreviewData } = {}): GraphQLClient {
    const headers = buildGraphqlClientHeaders(requestConfig.previewData);
    return new GraphQLClient(url, {
        ...requestConfig,
        headers,
    });
}
