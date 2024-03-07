import { messages } from "@comet/admin";
import { File, FileNotMenu } from "@comet/admin-icons";
import { createDocumentRootBlocksMethods, DependencyInterface, DocumentInterface } from "@comet/cms-admin";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { Chip } from "@mui/material";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPageTreeNodeAdditionalFieldsFragment } from "@src/common/EditPageNode";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import { PageContentBlock } from "@src/pages/PageContentBlock";
import { createDocumentDependencyMethods } from "@src/utils/createDocumentDependencyMethods";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";

const rootBlocks = {
    content: PageContentBlock,
    seo: SeoBlock,
};

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> & DependencyInterface = {
    displayName: <FormattedMessage {...messages.page} />,
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
        mutation UpdatePage($pageId: ID!, $input: PageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
            savePage(pageId: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                seo
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
    menuIcon: File,
    hideInMenuIcon: FileNotMenu,
    ...createDocumentRootBlocksMethods(rootBlocks),
    ...createDocumentDependencyMethods({
        rootBlocks,
        prefixes: { seo: "config/" },
        query: gql`
            query PageDependency($id: ID!) {
                node: page(id: $id) {
                    id
                    content
                    seo
                    pageTreeNode {
                        id
                        category
                    }
                }
            }
        `,
    }),
};
