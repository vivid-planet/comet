import { useQuery } from "@apollo/client";
import { FileData, FileDataNotMenu } from "@comet/admin-icons";
import { DocumentInterface } from "@comet/cms-admin";
import { GQLPredefinedPage, GQLPredefinedPageInput } from "@src/graphql.generated";
import { EditPredefinedPage } from "@src/predefinedPage/EditPredefinedPage";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLPredefinedPageInfoTagQuery, GQLPredefinedPageInfoTagQueryVariables } from "./PredefinedPage.generated";

const predefinedPageInfoTagQuery = gql`
    query PredefinedPageInfoTag($id: ID!) {
        page: pageTreeNode(id: $id) {
            id
            document {
                ... on PredefinedPage {
                    id
                    type
                }
            }
        }
    }
`;

export const PredefinedPage: DocumentInterface<Pick<GQLPredefinedPage, "type">, GQLPredefinedPageInput> = {
    displayName: <FormattedMessage id="predefinedPage" defaultMessage="Predefined Page" />,
    editComponent: EditPredefinedPage,
    getQuery: gql`
        query PredefinedPageDocument($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                name
                slug
                parentId
                document {
                    ... on PredefinedPage {
                        id
                        type
                    }
                }
            }
        }
    `,
    updateMutation: gql`
        mutation UpdatePredefinedPageDocument($pageId: ID!, $input: PredefinedPageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
            savePredefinedPage(id: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                type
            }
        }
    `,
    inputToOutput: (input: Pick<GQLPredefinedPage, "type">) => {
        return {
            type: input.type,
        };
    },
    menuIcon: FileData,
    hideInMenuIcon: FileDataNotMenu,
    InfoTag: ({ page }) => {
        const { data } = useQuery<GQLPredefinedPageInfoTagQuery, GQLPredefinedPageInfoTagQueryVariables>(predefinedPageInfoTagQuery, {
            variables: { id: page.id },
            skip: page.documentType !== "PredefinedPage",
        });

        if (data?.page?.document != null) {
            const { type } = data.page.document as GQLPredefinedPage;
            return type ? <>{type}</> : null;
        } else {
            return null;
        }
    },
    anchors: () => [],
    dependencies: () => [],
    replaceDependenciesInOutput: (output, replacements) => {
        return output;
    },
};
