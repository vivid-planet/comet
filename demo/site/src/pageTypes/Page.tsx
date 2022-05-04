import { PageContentBlock } from "@src/blocks/PageContentBlock";
import SeoBlock from "@src/blocks/seo/SeoBlock";
import Breadcrumbs, { breadcrumbsFragment } from "@src/components/Breadcrumbs";
import { GQLPageQuery } from "@src/graphql.generated";
import { Header, headerFragment } from "@src/header/Header";
import { gql } from "graphql-request";
import Head from "next/head";
import * as React from "react";

// @TODO: Scope for menu should also be of type PageTreeNodeScopeInput
export const pageQuery = gql`
    query Page($pageId: ID!, $domain: String!, $language: String!) {
        pageContent: pageTreeNode(id: $pageId) {
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
    }

    ${breadcrumbsFragment}
    ${headerFragment}
`;

export default function Page(props: GQLPageQuery): JSX.Element {
    const document = props.pageContent?.document;
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {document?.__typename === "Page" && (
                <SeoBlock
                    data={document.seo}
                    title={props.pageContent?.name ?? ""}
                    canonicalUrl={`${process.env.SITE_URL}${props.pageContent?.path}`}
                />
            )}
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
