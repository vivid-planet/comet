import { DocumentInterface } from "@comet/admin-cms";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";
import { PageContentBlock } from "./PageContentBlock";

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
    displayName: <FormattedMessage id="comet.generic.page" defaultMessage="Page" />,
    editComponent: EditPage,
    getQuery: gql`
        query PageDocument($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                path
                document {
                    ... on DocumentInterface {
                        id
                        updatedAt
                    }

                    __typename
                    ... on Page {
                        content
                        seo
                    }
                }
            }
        }
    `,
    updateMutation: gql`
        mutation UpdatePage($pageId: ID!, $input: PageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID) {
            savePage(pageId: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                seo
                updatedAt
            }
        }
    `,
    inputToOutput: (input) => {
        return {
            content: PageContentBlock.state2Output(PageContentBlock.input2State(input.content)),
            seo: SeoBlock.state2Output(SeoBlock.input2State(input.seo)),
        };
    },
};
