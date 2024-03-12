import { createGraphQLClient as libraryCreateGraphQLClient, PreviewData } from "@comet/cms-site";

export default function createGraphQLClient(previewData?: PreviewData) {
    return libraryCreateGraphQLClient(`${process.env.API_URL_INTERNAL}/graphql`, previewData);
}
