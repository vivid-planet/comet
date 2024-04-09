import { gql } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import Breadcrumbs from "@src/components/Breadcrumbs";
import { breadcrumbsFragment } from "@src/components/Breadcrumbs.fragment";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { Header } from "@src/header/Header";
import { headerFragment } from "@src/header/Header.fragment";
import { TopNavigation } from "@src/topNavigation/TopNavigation";
import { topMenuPageTreeNodeFragment } from "@src/topNavigation/TopNavigation.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import type { Metadata, ResolvingMetadata } from "next";
import { draftMode } from "next/headers";
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
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphqlFetch = createGraphQLFetch(previewData);

    const props = await graphqlFetch<GQLPageQuery, GQLPageQueryVariables>(
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
    // TODO move into library
    return {
        title: document.seo.htmlTitle || data.pageContent.name, //support passedTitle
        description: document.seo.metaDescription,
        openGraph: {
            title: document.seo.openGraphTitle,
            description: document.seo.openGraphDescription,
            type: "website",
            url: document.seo.canonicalUrl, //support passedCanonicalUrl
            // TODO image: generateImageUrl({ src: openGraphImageUrlTemplate, width: 1024 }, 1 / 1),
        },
        // TODO structuredData (must be part of Page component)
        robots: {
            index: !document.seo.noIndex,
        },
        alternates: {
            canonical: document.seo.canonicalUrl, //support passedCanonicalUrl,
            languages: document.seo.alternativeLinks.reduce((acc, link) => {
                if (link.code && link.url) acc[link.code] = link.url;
                return acc;
            }, {}),
        },
    };
}

export default async function Page({ pageTreeNodeId, scope }: Props) {
    const data = await fetchData({ pageTreeNodeId, scope });
    const document = data?.pageContent?.document;
    if (!document) {
        // no document attached to page
        notFound(); //no return needed
    }
    if (document.__typename != "Page") throw new Error(`invalid document type, expected Page, got ${document.__typename}`);

    return (
        <>
            <TopNavigation data={data.topMenu} />
            <Header header={data.header} />
            <Breadcrumbs {...data.pageContent} />
            <div>{document.content && <PageContentBlock data={document.content} />}</div>
        </>
    );
}
