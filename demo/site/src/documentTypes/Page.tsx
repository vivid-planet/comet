import { gql, previewParams, SeoBlock } from "@comet/cms-site";
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

export async function Page({ pageTreeNodeId, scope }: { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput }) {
    const { previewData } = previewParams() || { previewData: undefined };
    const graphQLFetch = createGraphQLFetch(previewData);

    const data = await graphQLFetch<GQLPageQuery, GQLPageQueryVariables>(pageQuery, {
        pageTreeNodeId,
        domain: scope.domain,
        language: scope.language,
    });

    if (!data.pageContent) throw new Error("Could not load page content");
    if (!data.pageContent.document) {
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
        }),
        recursivelyLoadBlockData({
            blockType: "Seo",
            blockData: data.pageContent.document.seo,
            graphQLFetch,
            fetch,
        }),
    ]);

    return (
        <>
            <SeoBlock data={data.pageContent.document.seo} title={data.pageContent.name} />
            <TopNavigation data={data.topMenu} />
            <Header header={data.header} />
            <Breadcrumbs {...data.pageContent} />
            <div>
                <PageContentBlock data={data.pageContent.document.content} />
            </div>
        </>
    );
}
