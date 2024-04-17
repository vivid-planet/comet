import { gql, GraphQLFetch } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { defaultLanguage, domain } from "@src/config";
import { documentTypes } from "@src/documentTypes";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import type { Metadata, ResolvingMetadata } from "next";
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

function fetchPageTreeNode(graphqlFetch: GraphQLFetch, options: { path: string[]; scope: GQLPageTreeNodeScopeInput }) {
    return graphqlFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            path: `/${(options.path ?? []).join("/")}`,
            scope: options.scope,
        },
        { method: "GET" }, //for request memoization
    );
}

type Props = {
    params: { path: string[] };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphQLFetch = createGraphQLFetch(previewData);

    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const data = await fetchPageTreeNode(graphQLFetch, { path: params.path, scope });

    if (!data.pageTreeNodeByPath?.documentType) {
        return {};
    }

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    const props = {
        pageTreeNodeId,
        scope,
    };
    const { generateMetadata } = documentTypes[data.pageTreeNodeByPath.documentType];

    return generateMetadata(props, parent);
}

export default async function Page({ params }: Props) {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphQLFetch = createGraphQLFetch(previewData);

    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const data = await fetchPageTreeNode(graphQLFetch, { path: params.path, scope });

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
