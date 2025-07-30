import { SeoBlock } from "@comet/site-nextjs";
import Breadcrumbs from "@src/common/components/Breadcrumbs";
import { breadcrumbsFragment } from "@src/common/components/Breadcrumbs.fragment";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { type GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { Header, headerFragment } from "@src/layout/header/Header";
import { topMenuPageTreeNodeFragment, TopNavigation } from "@src/topNavigation/TopNavigation";
import { gql, type GraphQLClient } from "graphql-request";
import Head from "next/head";

import { StageBlock } from "./blocks/StageBlock";
import { type GQLPageQuery } from "./Page.generated";

// @TODO: Scope for menu should also be of type PageTreeNodeScopeInput
const pageQuery = gql`
    query Page($pageTreeNodeId: ID!, $domain: String!, $language: String!) {
        pageContent: pageTreeNode(id: $pageTreeNodeId) {
            document {
                __typename
                ... on Page {
                    content
                    seo
                    stage
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
    return client.request<GQLPageQuery>(pageQuery, {
        pageTreeNodeId,
        domain: scope.domain,
        language: scope.language,
    });
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
            {document?.__typename === "Page" && <StageBlock data={document.stage} />}
            {props.pageContent && <Breadcrumbs {...props.pageContent} />}
            {document?.__typename === "Page" ? <div>{document.content && <PageContentBlock data={document.content} />}</div> : null}
        </>
    );
}
