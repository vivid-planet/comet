import { gql, previewParams } from "@comet/cms-site";
import { domain, languages } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
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
    // TODO support multiple domains, get domain by Host header
    const { scope, previewData } = previewParams() || { scope: { domain, language: params.lang }, previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);

    if (!languages.includes(params.lang)) {
        notFound();
    }

    //fetch documentType
    const data = await graphqlFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
        path: `/${(params.path ?? []).join("/")}`,
        scope: scope as GQLPageTreeNodeScopeInput, //TODO fix type, the scope from previewParams() is not compatible with GQLPageTreeNodeScopeInput
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
