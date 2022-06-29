import { FileData, FileDataNotMenu } from "@comet/admin-icons";
import { DocumentInterface } from "@comet/cms-admin";
import { GQLDocument } from "@comet/cms-admin/lib/documents/types";
import { GQLPredefinedPage, GQLPredefinedPageDocumentFragment, GQLPredefinedPageInput } from "@src/graphql.generated";
import { EditPredefinedPage } from "@src/predefinedPage/EditPredefinedPage";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const PredefinedPage: DocumentInterface<Pick<GQLPredefinedPage, "type">, GQLPredefinedPageInput> = {
    displayName: <FormattedMessage id="cometDemo.predefinedPage" defaultMessage="Predefined Page" />,
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
        mutation UpdatePredefinedPageDocument($pageId: ID!, $input: PredefinedPageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID) {
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
    additionalDocumentFragment: {
        name: "PredefinedPageDocument",
        fragment: gql`
            fragment PredefinedPageDocument on PredefinedPage {
                id
                updatedAt
                type
            }
        `,
    },
    menuIcon: FileData,
    hideInMenuIcon: FileDataNotMenu,
    infoTag: (document: GQLDocument) => {
        if (document.__typename === "PredefinedPage") {
            const predefinedPageDocument = document as GQLPredefinedPageDocumentFragment;
            return predefinedPageDocument.type ?? "";
        }
    },
};
