import { File, FileNotMenu } from "@comet/admin-icons";
import { DocumentInterface, rewriteInternalLinks } from "@comet/cms-admin";
import { PageTreePage } from "@comet/cms-admin/lib/pages/pageTree/usePageTree";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { GQLPage, GQLPageInput, GQLPageTreeNodeAdditionalFieldsFragment } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EditPage } from "./EditPage";
import { PageContentBlock } from "./PageContentBlock";

export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
    displayName: <FormattedMessage id="cometDemo.generic.page" defaultMessage="Page" />,
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
    inputToOutput: (input, { idsMap }) => {
        return {
            content: rewriteInternalLinks(PageContentBlock.state2Output(PageContentBlock.input2State(input.content)), idsMap),
            seo: SeoBlock.state2Output(SeoBlock.input2State(input.seo)),
        };
    },
    InfoTag: ({ page }: { page: PageTreePage & GQLPageTreeNodeAdditionalFieldsFragment }) => {
        return <>{page.userGroup}</>;
    },
    menuIcon: File,
    hideInMenuIcon: FileNotMenu,
    anchors: (input) => PageContentBlock.anchors?.(PageContentBlock.input2State(input.content)) ?? [],
    resolveDependencyRoute: (input, { rootColumn, jsonPath }) => {
        return PageContentBlock.resolveDependencyRoute(PageContentBlock.input2State(input[rootColumn]), jsonPath.substring("root.".length));
    },
};
