import { messages } from "@comet/admin";
import { Link as LinkIcon } from "@comet/admin-icons";
import { createDocumentRootBlocksMethods, DependencyInterface, DocumentInterface } from "@comet/cms-admin";
import { createDependencyMethods } from "@comet/cms-admin/lib/dependencies/createDependencyMethods";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { Chip } from "@mui/material";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { GQLPageTreeNodeAdditionalFieldsFragment } from "@src/common/EditPageNode";
import { GQLLink, GQLLinkInput } from "@src/graphql.generated";
import { EditLink } from "@src/links/EditLink";
import { GQLLinkDependencyQuery } from "@src/links/Link.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const rootBlocks = {
    content: LinkBlock,
};

export const Link: DocumentInterface<Pick<GQLLink, "content">, GQLLinkInput> & DependencyInterface = {
    displayName: <FormattedMessage {...messages.link} />,
    editComponent: EditLink,
    getQuery: gql`
        query LinkDocument($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                name
                slug
                parentId
                document {
                    __typename
                    ... on DocumentInterface {
                        id
                        updatedAt
                    }
                    ... on Link {
                        content
                    }
                }
            }
        }
    `,
    updateMutation: gql`
        mutation UpdateLink($pageId: ID!, $input: LinkInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
            saveLink(linkId: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                updatedAt
            }
        }
    `,
    InfoTag: ({ page }: { page: PageTreePage & GQLPageTreeNodeAdditionalFieldsFragment }) => {
        if (page.userGroup !== "All") {
            return <Chip size="small" label={page.userGroup} />;
        }
        return null;
    },
    menuIcon: LinkIcon,
    ...createDocumentRootBlocksMethods(rootBlocks),
    ...createDependencyMethods({
        rootBlocks,
        query: gql`
            query LinkDependency($id: ID!) {
                node: link(linkId: $id) {
                    id
                    content
                    pageTreeNode {
                        id
                        category
                    }
                }
            }
        `,
        buildUrl: (id, data: GQLLinkDependencyQuery, { contentScopeUrl, blockUrl }) => {
            if (data.node === null || data.node.pageTreeNode === null) {
                throw new Error(`Could not find PageTreeNode for link ${id}`);
            }

            return `${contentScopeUrl}/pages/pagetree/${categoryToUrlParam(data.node.pageTreeNode.category)}/${
                data.node.pageTreeNode.id
            }/edit/${blockUrl}`;
        },
    }),
};
