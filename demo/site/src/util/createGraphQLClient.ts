import { createGraphQLClient as libraryCreateGraphQLClient, PreviewData } from "@comet/cms-site";
import { RequestConfig } from "graphql-request/build/esm/types";

export default function createGraphQLClient(requestConfig: RequestConfig & { previewData?: PreviewData } = {}) {
    return libraryCreateGraphQLClient(
        `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`,
        requestConfig,
    );
}
