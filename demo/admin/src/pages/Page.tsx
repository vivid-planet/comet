import { messages } from "@comet/admin";
import { File, FileNotMenu } from "@comet/admin-icons";
import { BlocksBlockOutput } from "@comet/blocks-admin/lib/blocks/factories/createBlocksBlock";
import { DocumentInterface } from "@comet/cms-admin";
import { DependencyInterface } from "@comet/cms-admin/lib/documents/types";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { Chip } from "@mui/material";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPageTreeNodeAdditionalFieldsFragment } from "@src/common/EditPageNode.generated";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";
import { GQLPageDependencyQuery, GQLPageDependencyQueryVariables } from "./Page.generated";
import { PageContentBlock } from "./PageContentBlock";

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> &
    DependencyInterface<GQLPageDependencyQuery, GQLPageDependencyQueryVariables> = {
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
    inputToOutput: (input) => {
        return {
            content: PageContentBlock.state2Output(PageContentBlock.input2State(input.content)),
            seo: SeoBlock.state2Output(SeoBlock.input2State(input.seo)),
        };
    },
    InfoTag: ({ page }: { page: PageTreePage & GQLPageTreeNodeAdditionalFieldsFragment }) => {
        if (page.userGroup !== "All") {
            return <Chip size="small" label={page.userGroup} />;
        }
        return null;
    },
    menuIcon: File,
    hideInMenuIcon: FileNotMenu,
    anchors: (input) => PageContentBlock.anchors?.(PageContentBlock.input2State(input.content)) ?? [],
    dependencies: (input) => PageContentBlock.dependencies?.(PageContentBlock.input2State(input.content)) ?? [],
    replaceDependenciesInOutput: (output, replacements) => {
        const newOutput = {
            ...output,
            content: PageContentBlock.replaceDependenciesInOutput(output.content as BlocksBlockOutput, replacements),
            seo: SeoBlock.replaceDependenciesInOutput(output.seo, replacements),
        };

        return newOutput;
    },
    dependencyQuery: gql`
        query PageDependency($id: ID!) {
            page(id: $id) {
                id
                content
                seo
                pageTreeNode {
                    id
                    name
                    path
                    category
                }
            }
        }
    `,
    getName: (data: GQLPageDependencyQuery) => {
        if (data.page.pageTreeNode === null) {
            throw new Error(`Page.getName: Could not find a PageTreeNode for Page with id ${data.page.id}`);
        }

        return data.page.pageTreeNode.name;
    },
    getSecondaryInformation: (data: GQLPageDependencyQuery) => {
        if (data.page.pageTreeNode === null) {
            throw new Error(`Page.getSecondaryInformation: Could not find a PageTreeNode for Page with id ${data.page.id}`);
        }

        return data.page.pageTreeNode.path;
    },
    getUrl: (data: GQLPageDependencyQuery, { rootColumn, jsonPath, contentScopeUrl }) => {
        if (data.page.pageTreeNode === null) {
            throw new Error(`Page.getUrl: Could not find a PageTreeNode for Page with id ${data.page.id}`);
        }

        let dependencyRoute: string;
        if (rootColumn === "content") {
            dependencyRoute = PageContentBlock.resolveDependencyRoute(
                PageContentBlock.input2State(data.page.content),
                jsonPath.substring("root.".length),
            );
        } else {
            dependencyRoute = SeoBlock.resolveDependencyRoute(SeoBlock.input2State(data.page.seo), jsonPath.substring("root.".length));
        }

        return `${contentScopeUrl}/pages/pagetree/${categoryToUrlParam(data.page.pageTreeNode.category)}/${
            data.page.pageTreeNode.id
        }/edit/${dependencyRoute}`;
    },
};
