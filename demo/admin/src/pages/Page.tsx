import { messages } from "@comet/admin";
import { File, FileNotMenu } from "@comet/admin-icons";
import { BlocksBlockOutput } from "@comet/blocks-admin/lib/blocks/factories/createBlocksBlock";
import { DocumentInterface } from "@comet/cms-admin";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { Chip } from "@mui/material";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPageTreeNodeAdditionalFieldsFragment } from "@src/common/EditPageNode";
import { GQLPage, GQLPageInput } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";
import { PageContentBlock } from "./PageContentBlock";

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
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
};
