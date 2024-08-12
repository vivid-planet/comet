import { gql, previewParams } from "@comet/cms-site";
import { domain, languages } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import type { Metadata, ResolvingMetadata } from "next";
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

async function fetchPageTreeNode(params: { path: string[]; lang: string }) {
    const { scope, previewData } = (await previewParams()) || { scope: { domain, language: params.lang }, previewData: undefined };
    const graphQLFetch = createGraphQLFetch(previewData);
    return graphQLFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            path: `/${(params.path ?? []).join("/")}`,
            scope: scope as GQLPageTreeNodeScopeInput, //TODO fix type, the scope from previewParams() is not compatible with GQLPageTreeNodeScopeInput
        },
        { method: "GET" }, //for request memoization
    );
}

type Props = {
    params: { path: string[]; lang: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // TODO support multiple domains, get domain by Host header
    const { scope } = (await previewParams()) || { scope: { domain, language: params.lang } };

    const data = await fetchPageTreeNode(params);

    if (!data.pageTreeNodeByPath?.documentType) {
        return {};
    }

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    const props = {
        pageTreeNodeId,
        scope,
    };
    const { generateMetadata } = documentTypes[data.pageTreeNodeByPath.documentType];
    if (!generateMetadata) return {};

    return generateMetadata(props, parent);
}

export default async function Page({ params }: Props) {
    // TODO support multiple domains, get domain by Host header
    const { scope } = (await previewParams()) || { scope: { domain, language: params.lang } };

    if (!languages.includes(params.lang)) {
        notFound();
    }

    const data = await fetchPageTreeNode(params);

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
