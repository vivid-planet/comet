import { PreviewData } from "@src/pages/api/preview";
import { GraphQLClient } from "graphql-request";

type GraphQLClientOptions = PreviewData;

const defaultOptions: GraphQLClientOptions = {
    includeInvisiblePages: false,
    includeInvisibleBlocks: false,
    previewDamUrls: false,
};
export default function createGraphQLClient(options: Partial<GraphQLClientOptions> = {}): GraphQLClient {
    const { includeInvisibleBlocks, includeInvisiblePages, previewDamUrls } = { ...defaultOptions, ...options };

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

    return new GraphQLClient(`${process.env.API_URL_INTERNAL}/graphql`, {
        headers,
    });
}
