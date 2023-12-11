import { PageContentBlock } from "@src/blocks/PageContentBlock";
import SeoBlock from "@src/blocks/seo/SeoBlock";
import Breadcrumbs, { breadcrumbsFragment } from "@src/components/Breadcrumbs";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { Header, headerFragment } from "@src/header/Header";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { topMenuPageTreeNodeFragment, TopNavigation } from "@src/topNavigation/TopNavigation";
import { gql, GraphQLClient } from "graphql-request";
import Head from "next/head";
import * as React from "react";

import { GQLPageQuery } from "./Page.generated";

// @TODO: Scope for menu should also be of type PageTreeNodeScopeInput
export const pageQuery = gql`
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

export async function loader({
    client,
    pageTreeNodeId,
    scope,
}: {
    client: GraphQLClient;
    pageTreeNodeId: string;
    scope: GQLPageTreeNodeScopeInput;
}): Promise<unknown> {
    const data = await client.request<GQLPageQuery>(pageQuery, {
        pageTreeNodeId,
        domain: scope.domain,
        language: scope.language,
    });
    if (data.pageContent?.document?.__typename !== "Page") throw new Error("document type must be Page");

    //TODO: load in paralell
    data.pageContent.document.content = await recursivelyLoadBlockData({
        blockType: "PageContent",
        blockData: data.pageContent.document.content,
        client,
    });
    data.pageContent.document.seo = await recursivelyLoadBlockData({
        blockType: "Seo",
        blockData: data.pageContent.document.seo,
        client,
    });
    return data;
}

export default function Page(props: GQLPageQuery): JSX.Element {
    const document = props.pageContent?.document;

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {document?.__typename === "Page" && <SeoBlock data={document.seo} title={props.pageContent?.name ?? ""} />}
            <TopNavigation data={props.topMenu} />
            <Header header={props.header} />
            {props.pageContent && <Breadcrumbs {...props.pageContent} />}
            {document && document.__typename === "Page" ? (
                <>
                    <div>{document.content && <PageContentBlock data={document.content} />}</div>
                </>
            ) : null}
        </>
    );
}
