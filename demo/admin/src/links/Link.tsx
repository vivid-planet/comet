import { messages } from "@comet/admin";
import { Link as LinkIcon } from "@comet/admin-icons";
import { DocumentInterface, rewriteInternalLinks } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { GQLLink, GQLLinkInput } from "@src/graphql.generated";
import { EditLink } from "@src/links/EditLink";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const Link: DocumentInterface<Pick<GQLLink, "content">, GQLLinkInput> = {
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
        mutation UpdateLink($pageId: ID!, $input: LinkInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID) {
            saveLink(linkId: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                updatedAt
            }
        }
    `,
    inputToOutput: (input, { idsMap }) => {
        return {
            content: rewriteInternalLinks(LinkBlock.state2Output(LinkBlock.input2State(input.content)), idsMap),
        };
    },
    menuIcon: LinkIcon,
};
