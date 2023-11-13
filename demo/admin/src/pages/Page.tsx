import { messages } from "@comet/admin";
import { File, FileNotMenu } from "@comet/admin-icons";
import { createDocumentRootBlocksMethods, DependencyInterface, DocumentInterface } from "@comet/cms-admin";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { Chip } from "@mui/material";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPageTreeNodeAdditionalFieldsFragment } from "@src/common/EditPageNode.generated";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import { GQLPageDependencyQuery, GQLPageDependencyQueryVariables } from "@src/pages/Page.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";
import { PageContentBlock } from "./PageContentBlock";

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
    ...createDocumentRootBlocksMethods({
        content: PageContentBlock,
        seo: SeoBlock,
    }),
    getUrl: async ({ rootColumnName, jsonPath, contentScopeUrl, apolloClient, id }) => {
        const { data, error } = await apolloClient.query<GQLPageDependencyQuery, GQLPageDependencyQueryVariables>({
            query: gql`
                query PageDependency($id: ID!) {
                    page(id: $id) {
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
            variables: {
                id,
            },
        });

        if (error || data.page.pageTreeNode === null) {
            throw new Error(`Page.getUrl: Could not find a PageTreeNode for Page with id ${id}`);
        }

        let dependencyRoute: string;
        if (rootColumnName === "content") {
            dependencyRoute = PageContentBlock.resolveDependencyRoute(
                PageContentBlock.input2State(data.page.content),
                jsonPath.substring("root.".length),
            );
        } else {
            dependencyRoute = `config/${SeoBlock.resolveDependencyRoute(SeoBlock.input2State(data.page.seo), jsonPath.substring("root.".length))}`;
        }

        return `${contentScopeUrl}/pages/pagetree/${categoryToUrlParam(data.page.pageTreeNode.category)}/${
            data.page.pageTreeNode.id
        }/edit/${dependencyRoute}`;
    },
};
