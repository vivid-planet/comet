import { gql } from "@apollo/client";
import { File, FileNotMenu } from "@comet/admin-icons";
import { createDocumentDependencyMethods, createDocumentRootBlocksMethods, DependencyInterface, DocumentInterface } from "@comet/cms-admin";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/pageTree/pageTreeCategories";
import { FormattedMessage } from "react-intl";

import { PageContentBlock } from "./blocks/PageContentBlock";
import { SeoBlock } from "./blocks/SeoBlock";
import { StageBlock } from "./blocks/StageBlock";
import { EditPage } from "./EditPage";

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> & DependencyInterface = {
    displayName: <FormattedMessage id="generic.page" defaultMessage="Page" />,
    editComponent: EditPage,
    menuIcon: File,
    hideInMenuIcon: FileNotMenu,
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
                        stage
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
                stage
                updatedAt
            }
        }
    `,
    ...createDocumentRootBlocksMethods({
        content: PageContentBlock,
        seo: SeoBlock,
        stage: StageBlock,
    }),
    ...createDocumentDependencyMethods({
        rootQueryName: "page",
        rootBlocks: {
            content: PageContentBlock,
            seo: { block: SeoBlock, path: "/config" },
            stage: { block: StageBlock, path: "/stage" },
        },
        basePath: ({ pageTreeNode }) => `/pages/pagetree/${categoryToUrlParam(pageTreeNode.category)}/${pageTreeNode.id}/edit`,
    }),
};
