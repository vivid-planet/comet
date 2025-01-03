import { gql, previewParams } from "@comet/cms-site";
import { ExternalLinkBlockData, InternalLinkBlockData, RedirectsLinkBlockData } from "@src/blocks.generated";
import { documentTypes } from "@src/documents";
import { GQLPageTreeNodeScope, GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

import { GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables } from "./page.generated";

const documentTypeQuery = gql`
    query DocumentType(
        $skipPage: Boolean!
        $path: String!
        $scope: PageTreeNodeScopeInput!
        $redirectSource: String!
        $redirectScope: RedirectScopeInput!
    ) {
        pageTreeNodeByPath(path: $path, scope: $scope) @skip(if: $skipPage) {
            id
            documentType
        }
        redirectBySource(source: $redirectSource, sourceType: path, scope: $redirectScope) {
            target
        }
    }
`;

async function fetchPageTreeNode({ domain, language, path }: Props["params"]) {
    const skipPage = !getSiteConfigForDomain(domain).scope.languages.includes(language);
    const { scope, previewData } = (await previewParams()) || { scope: { domain, language }, previewData: undefined };
    const graphQLFetch = createGraphQLFetch(previewData);
    const pathname = `/${(path ?? []).join("/")}`;
    return graphQLFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            skipPage,
            path: pathname,
            scope: scope as GQLPageTreeNodeScopeInput, //TODO fix type, the scope from previewParams() is not compatible with GQLPageTreeNodeScopeInput
            redirectSource: `/${language}${pathname !== "/" ? pathname : ""}`,
            redirectScope: { domain: scope.domain },
        },
        { method: "GET" }, //for request memoization
    );
}

type Props = {
    params: { path: string[]; domain: string; language: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // TODO support multiple domains, get domain by Host header
    const { scope } = (await previewParams()) || { scope: { domain: params.domain, language: params.language } };

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
    const { scope } = (await previewParams()) || { scope: { domain: params.domain, language: params.language } };

    const data = await fetchPageTreeNode(params);

    if (!data.pageTreeNodeByPath?.documentType) {
        if (data.redirectBySource?.target) {
            const target = data.redirectBySource?.target as RedirectsLinkBlockData;
            let destination: string | undefined;
            if (target.block !== undefined) {
                switch (target.block.type) {
                    case "internal": {
                        const internalLink = target.block.props as InternalLinkBlockData;
                        if (internalLink.targetPage) {
                            destination = `/${(internalLink.targetPage.scope as GQLPageTreeNodeScope).language}/${internalLink.targetPage.path}`;
                        }
                        break;
                    }
                    case "external":
                        destination = (target.block.props as ExternalLinkBlockData).targetUrl;
                        break;
                }
            }
            if (destination) {
                redirect(destination);
            }
        }
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
