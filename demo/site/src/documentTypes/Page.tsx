import { generateImageUrl, gql, previewParams } from "@comet/cms-site";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import Breadcrumbs from "@src/components/Breadcrumbs";
import { breadcrumbsFragment } from "@src/components/Breadcrumbs.fragment";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { Header } from "@src/header/Header";
import { headerFragment } from "@src/header/Header.fragment";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { TopNavigation } from "@src/topNavigation/TopNavigation";
import { topMenuPageTreeNodeFragment } from "@src/topNavigation/TopNavigation.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import * as React from "react";

import { GQLPageQuery, GQLPageQueryVariables } from "./Page.generated";

// @TODO: Scope for menu should also be of type PageTreeNodeScopeInput
const pageQuery = gql`
    query Page($pageTreeNodeId: ID!, $domain: String!, $language: String!) {
        pageContent: pageTreeNode(id: $pageTreeNodeId) {
            document {
                __typename
                ... on Page {
                    content
                    seo
                }
            }
            ...Breadcrumbs
        }

        header: mainMenu(scope: { domain: $domain, language: $language }) {
            ...Header
        }

        topMenu(scope: { domain: $domain, language: $language }) {
            ...TopMenuPageTreeNode
        }
    }
    ${breadcrumbsFragment}
    ${headerFragment}
    ${topMenuPageTreeNodeFragment}
`;

type Props = { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput };

async function fetchData({ pageTreeNodeId, scope }: Props) {
    const { previewData } = (await previewParams()) || { previewData: undefined };
    const graphQLFetch = createGraphQLFetch(previewData);

    const props = await graphQLFetch<GQLPageQuery, GQLPageQueryVariables>(
        pageQuery,
        {
            pageTreeNodeId,
            domain: scope.domain,
            language: scope.language,
        },
        { method: "GET" }, //for request memoization
    );

    if (!props.pageContent) throw new Error("Could not load page content");
    const document = props.pageContent.document;
    if (!document) {
        return null;
    }
    if (document.__typename != "Page") throw new Error(`invalid document type, expected Page, got ${document.__typename}`);

    return {
        ...props,
        pageContent: {
            ...props.pageContent,
            document,
        },
    };
}

export async function generateMetadata({ pageTreeNodeId, scope }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const data = await fetchData({ pageTreeNodeId, scope });
    const document = data?.pageContent?.document;
    if (!document) {
        return {};
    }
    const siteUrl = "http://localhost:3000"; //TODO get from site config
    const canonicalUrl = document.seo.canonicalUrl || `${siteUrl}${data.pageContent.path}`;

    // TODO move into library
    return {
        title: document.seo.htmlTitle || data.pageContent.name,
        description: document.seo.metaDescription,
        openGraph: {
            title: document.seo.openGraphTitle,
            description: document.seo.openGraphDescription,
            type: "website",
            url: canonicalUrl,
            images: document.seo.openGraphImage.block?.urlTemplate
                ? generateImageUrl({ src: document.seo.openGraphImage.block?.urlTemplate, width: 1200 }, 1200 / 630)
                : undefined,
        },
        robots: {
            index: !document.seo.noIndex,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: document.seo.alternativeLinks.reduce((acc, link) => {
                if (link.code && link.url) acc[link.code] = link.url;
                return acc;
            }, {}),
        },
    };
}

export async function Page({ pageTreeNodeId, scope }: { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput }) {
    const { previewData } = (await previewParams()) || { previewData: undefined };
    const graphQLFetch = createGraphQLFetch(previewData);

    const data = await fetchData({ pageTreeNodeId, scope });
    const document = data?.pageContent?.document;
    if (!document) {
        // no document attached to page
        notFound(); //no return needed
    }
    if (data.pageContent.document?.__typename != "Page") throw new Error(`invalid document type`);

    [data.pageContent.document.content, data.pageContent.document.seo] = await Promise.all([
        recursivelyLoadBlockData({
            blockType: "PageContent",
            blockData: data.pageContent.document.content,
            graphQLFetch,
            fetch,
            pageTreeNodeId,
        }),
        recursivelyLoadBlockData({
            blockType: "Seo",
            blockData: data.pageContent.document.seo,
            graphQLFetch,
            fetch,
            pageTreeNodeId,
        }),
    ]);

    return (
        <>
            {document.seo.structuredData && document.seo.structuredData.length > 0 && (
                <script type="application/ld+json">{document.seo.structuredData}</script>
            )}
            <TopNavigation data={data.topMenu} />
            <Header header={data.header} />
            <Breadcrumbs {...data.pageContent} />
            <div>
                <PageContentBlock data={data.pageContent.document.content} />
            </div>
        </>
    );
}
