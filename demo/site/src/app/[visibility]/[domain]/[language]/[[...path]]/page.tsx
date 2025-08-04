export const dynamic = "error";

import { gql } from "@comet/site-nextjs";
import { type ExternalLinkBlockData, type InternalLinkBlockData, type NewsLinkBlockData, type RedirectsLinkBlockData } from "@src/blocks.generated";
import { documentTypes } from "@src/documents";
import { type GQLPageTreeNodeScope } from "@src/graphql.generated";
import { type VisibilityParam } from "@src/middleware/domainRewrite";
import { createSitePath } from "@src/util/createSitePath";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { setVisibilityParam } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { type Metadata, type ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

import { type GQLDocumentTypeQuery, type GQLDocumentTypeQueryVariables } from "./page.generated";

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

async function fetchPageTreeNode(params: PageProps["params"]) {
    const siteConfig = getSiteConfigForDomain(params.domain);

    // Redirects are scoped by domain only, not by language.
    // If the language param isn't a valid language, it may still be the first segment of a redirect source.
    // In that case we skip resolving page and only check if the path is a redirect source.
    const skipPage = !siteConfig.scope.languages.includes(params.language);

    const path = `/${(params.path ?? []).join("/")}`;
    const { scope } = { scope: { domain: params.domain, language: params.language } };
    const graphQLFetch = createGraphQLFetch();

    return graphQLFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            skipPage,
            path,
            scope,
            redirectSource: `/${params.language}${path !== "/" ? path : ""}`,
            redirectScope: { domain: scope.domain },
        },
        { method: "GET" }, //for request memoization
    );
}

interface PageProps {
    params: { path: string[]; domain: string; language: string; visibility: VisibilityParam };
}

export default async function Page({ params }: PageProps) {
    setVisibilityParam(params.visibility);
    const scope = { domain: params.domain, language: params.language };
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
                            destination = createSitePath({
                                path: internalLink.targetPage.path,
                                scope: internalLink.targetPage.scope as GQLPageTreeNodeScope,
                            });
                        }
                        break;
                    }
                    case "external":
                        destination = (target.block.props as ExternalLinkBlockData).targetUrl;
                        break;
                    case "news": {
                        const newsLink = target.block.props as NewsLinkBlockData;
                        if (newsLink.news) {
                            destination = `/${newsLink.news.scope.language}/news/${newsLink.news.slug}`;
                        }
                        break;
                    }
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

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
    const scope = { domain: params.domain, language: params.language };
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
