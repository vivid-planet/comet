import { previewParams, SeoBlock } from "@comet/cms-site";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import Breadcrumbs from "@src/components/Breadcrumbs";
import { breadcrumbsFragment } from "@src/components/Breadcrumbs.fragment";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { Header } from "@src/header/Header";
import { headerFragment } from "@src/header/Header.fragment";
import { TopNavigation } from "@src/topNavigation/TopNavigation";
import { topMenuPageTreeNodeFragment } from "@src/topNavigation/TopNavigation.fragment";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
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

export default async function Page({ pageTreeNodeId, scope }: { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput }) {
    const { previewData } = previewParams() || { previewData: undefined };
    const client = createGraphQLClient(previewData);

    const props = await client.request<GQLPageQuery, GQLPageQueryVariables>(pageQuery, {
        pageTreeNodeId,
        domain: scope.domain,
        language: scope.language,
    });

    if (!props.pageContent) throw new Error("Could not load page content");
    const document = props.pageContent.document;
    if (!document) {
        // no document attached to page
        notFound(); //no return needed
    }
    if (document.__typename != "Page") throw new Error(`invalid document type, expected Page, got ${document.__typename}`);

    return (
        <>
            <SeoBlock data={document.seo} title={props.pageContent.name} />
            <TopNavigation data={props.topMenu} />
            <Header header={props.header} />
            <Breadcrumbs {...props.pageContent} />
            <div>{document.content && <PageContentBlock data={document.content} />}</div>
        </>
    );
}
