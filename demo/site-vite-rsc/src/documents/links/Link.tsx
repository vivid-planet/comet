import { gql } from "@comet/site-react";
import { type DamFileDownloadLinkBlockData, type ExternalLinkBlockData, type InternalLinkBlockData } from "@src/blocks.generated";
import { type GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { NotFoundError, RedirectError } from "@src/util/rscErrors";

import { type GQLLinkRedirectQuery, type GQLLinkRedirectQueryVariables } from "./Link.generated";

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
    const graphqlFetch = createGraphQLFetch();

    const { pageTreeNode } = await graphqlFetch<GQLLinkRedirectQuery, GQLLinkRedirectQueryVariables>(linkRedirectQuery, {
        id: pageTreeNodeId,
    });

    if (pageTreeNode?.document?.__typename === "Link") {
        const content = pageTreeNode.document.content;

        if (content.block?.type === "internal") {
            const link = (content.block.props as InternalLinkBlockData).targetPage?.path;
            if (link) {
                throw new RedirectError(link);
            }
        }

        if (content.block?.type === "external") {
            const link = (content.block.props as ExternalLinkBlockData).targetUrl;
            if (link) {
                throw new RedirectError(link);
            }
        }

        if (content.block?.type === "damFileDownload") {
            const link = (content.block.props as DamFileDownloadLinkBlockData).file?.fileUrl.replace("/download", "");
            if (link) {
                throw new RedirectError(link);
            }
        }
    }

    throw new NotFoundError();
}
