import { gql } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { defaultLanguage, domain } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import { createGraphQLFetchWithPreviewHeaders } from "@src/util/graphQLClient";
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

export default async function Page({ params }: { params: { path: string[] } }) {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphqlFetch = createGraphQLFetchWithPreviewHeaders(previewData);

    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    //fetch documentType
    const data = await graphqlFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
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
