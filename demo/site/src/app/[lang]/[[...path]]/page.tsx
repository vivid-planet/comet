import { PreviewData } from "@src/app/api/site-preview/route";
import { domain } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables } from "./page.generated";

const documentTypeQuery = gql`
    query DocumentType($path: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeByPath(path: $path, scope: $scope) {
            id
            documentType
        }
    }
`;

export default async function Page({ params }: { params: { path: string[]; lang: string } }) {
    let previewData: PreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const client = createGraphQLClient(previewData);
    const scope = { domain, language: params.lang };

    //fetch documentType
    const data = await client.request<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
        path: `/${(params.path ?? []).join("/")}`,
        scope,
    });

    if (!data.pageTreeNodeByPath?.documentType) {
        notFound();
    }

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    const props = {
        pageTreeNodeId,
        scope,
    };
    const { component: Component } = documentTypes[data.pageTreeNodeByPath.documentType];

    return <Component {...props} />;
}

export async function generateStaticParams() {
    return [];
}
