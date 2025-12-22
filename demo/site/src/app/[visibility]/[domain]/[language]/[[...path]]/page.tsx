export const dynamic = "error";

import { gql } from "@comet/site-nextjs";
import { type NewsLinkBlockData, type RedirectsLinkBlockData } from "@src/blocks.generated";
import { documentTypes } from "@src/documents";
import { type VisibilityParam } from "@src/middleware/domainRewrite";
import { getRedirectTargetUrl } from "@src/util/getRedirectTargetUrl";
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

async function fetchPageTreeNode(params: PageProps<"/[visibility]/[domain]/[language]/[[...path]]">["params"]) {
    const { domain, language, path: pathParam } = await params;
    const siteConfig = getSiteConfigForDomain(domain);

    // Redirects are scoped by domain only, not by language.
    // If the language param isn't a valid language, it may still be the first segment of a redirect source.
    // In that case we skip resolving page and only check if the path is a redirect source.
    const skipPage = !siteConfig.scope.languages.includes(language);

    const path = `/${(pathParam ?? []).join("/")}`;
    const { scope } = { scope: { domain, language } };
    const graphQLFetch = createGraphQLFetch();

    return graphQLFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            skipPage,
            path,
            scope,
            redirectSource: `/${language}${path !== "/" ? path : ""}`,
            redirectScope: { domain: scope.domain },
        },
        { method: "GET" }, //for request memoization
    );
}

export default async function Page({ params }: PageProps<"/[visibility]/[domain]/[language]/[[...path]]">) {
    const { visibility, domain, language } = await params;
    setVisibilityParam(visibility as VisibilityParam);
    const scope = { domain, language };
    const data = await fetchPageTreeNode(params);

    if (!data.pageTreeNodeByPath?.documentType) {
        if (data.redirectBySource?.target) {
            const target = data.redirectBySource?.target as RedirectsLinkBlockData;
            let destination: string | undefined;
            if (target.block !== undefined) {
                if (target.block.type === "news") {
                    const newsLink = target.block.props as NewsLinkBlockData;
                    if (newsLink.news) {
                        destination = `/${newsLink.news.scope.language}/news/${newsLink.news.slug}`;
                    }
                } else {
                    destination = getRedirectTargetUrl(target.block, domain);
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

export async function generateMetadata(
    { params }: PageProps<"/[visibility]/[domain]/[language]/[[...path]]">,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { domain, language } = await params;
    const scope = { domain, language };
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
