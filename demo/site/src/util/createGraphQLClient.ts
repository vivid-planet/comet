import { GraphQLClient } from "graphql-request";

interface GraphQLClientOptions {
    includeInvisibleContent: boolean;
    previewDamUrls: boolean;
}
const defaultOptions: GraphQLClientOptions = {
    includeInvisibleContent: false,
    previewDamUrls: false,
};
export default function createGraphQLClient(options: Partial<GraphQLClientOptions> = {}): GraphQLClient {
    const { includeInvisibleContent, previewDamUrls } = { ...defaultOptions, ...options };

    const headers: Record<string, string> = {
        authorization: `Basic ${Buffer.from(`vivid:${process.env.API_PASSWORD}`).toString("base64")}`,
    };

    // tells api to send invisble content
    // authentication is required when this header is used
    if (includeInvisibleContent) {
        headers["x-include-invisible-content"] = "Unpublished"; // do not use @src/graphql.generated here
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
