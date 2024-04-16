import { gql } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { ExternalLinkBlockData, InternalLinkBlockData } from "@src/blocks.generated";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { GQLLinkRedirectQuery, GQLLinkRedirectQueryVariables } from "./Link.generated";

const linkRedirectQuery = gql`
    query LinkRedirect($id: ID!) {
        pageTreeNode(id: $id) {
            document {
                __typename
                ... on Link {
                    content
                }
            }
        }
    }
`;

interface Props {
    pageTreeNodeId: string;
    scope: GQLPageTreeNodeScopeInput;
}

export async function Link({ pageTreeNodeId }: Props): Promise<JSX.Element> {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphqlFetch = createGraphQLFetch(previewData);

    const { pageTreeNode } = await graphqlFetch<GQLLinkRedirectQuery, GQLLinkRedirectQueryVariables>(linkRedirectQuery, {
        id: pageTreeNodeId,
    });

    if (pageTreeNode?.document?.__typename === "Link") {
        const content = pageTreeNode.document.content;

        if (content.block?.type === "internal") {
            const link = (content.block.props as InternalLinkBlockData).targetPage?.path;
            if (link) {
                redirect(link);
            }
        }

        if (content.block?.type === "external") {
            const link = (content.block.props as ExternalLinkBlockData).targetUrl;
            if (link) {
                redirect(link);
            }
        }
    }

    notFound();
}
