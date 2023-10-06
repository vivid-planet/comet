import { createGraphQLClient as libraryCreateGraphQLClient, PreviewData } from "@comet/cms-site";

export default function createGraphQLClient(previewData?: PreviewData) {
    return libraryCreateGraphQLClient(
        `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`,
        previewData,
    );
}
