import { SeoBlock } from "@comet/cms-site";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import Breadcrumbs, { breadcrumbsFragment } from "@src/components/Breadcrumbs";
import { Header, headerFragment } from "@src/header/Header";
import { DocumentTypeLoaderOptions, InferDocumentTypeLoaderPropsType } from "@src/pages/[[...path]]";
import { topMenuPageTreeNodeFragment, TopNavigation } from "@src/topNavigation/TopNavigation";
import { gql } from "graphql-request";
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

export async function loader({ client, pageTreeNodeId, scope }: DocumentTypeLoaderOptions) {
    return client.request<GQLPageQuery>(pageQuery, {
        pageTreeNodeId,
        domain: scope.domain,
        language: scope.language,
    });
}

export default function Page(props: InferDocumentTypeLoaderPropsType<typeof loader>): JSX.Element {
    if (!props.pageContent) throw new Error("Could not load page content");
    const document = props.pageContent?.document;
    if (document?.__typename != "Page") throw new Error("invalid document type");

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SeoBlock data={document.seo} title={props.pageContent.name} />
            <TopNavigation data={props.topMenu} />
            <Header header={props.header} />
            <Breadcrumbs {...props.pageContent} />
            <div>{document.content && <PageContentBlock data={document.content} />}</div>
        </>
    );
}
