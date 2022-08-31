import { gql } from "@apollo/client";
import { MainContent, messages, RouterPrompt, RouterTab, RouterTabs, Toolbar, ToolbarFillSpace, ToolbarItem, useStackApi } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { AdminComponentRoot } from "@comet/blocks-admin";
import { createUsePage, EditPageLayout, PageName } from "@comet/cms-admin";
import { CircularProgress, IconButton } from "@mui/material";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { GQLEditLinkQuery, GQLEditLinkQueryVariables, GQLUpdateLinkMutation, GQLUpdateLinkMutationVariables } from "@src/graphql.generated";
import * as React from "react";
import { useIntl } from "react-intl";

const usePage = createUsePage({
    rootBlocks: {
        content: LinkBlock,
    },
    pageType: "Link",
})<GQLEditLinkQuery, GQLEditLinkQueryVariables, GQLUpdateLinkMutation["saveLink"], GQLUpdateLinkMutationVariables>({
    getQuery: gql`
        query EditLink($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                name
                slug
                parentId
                document {
                    ... on DocumentInterface {
                        id
                        updatedAt
                    }
                    __typename
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
});

interface Props {
    id: string;
}

export const EditLink: React.FC<Props> = ({ id }) => {
    const intl = useIntl();
    const stackApi = useStackApi();

    const {
        pageState: linkState,
        rootBlocksApi,
        hasChanges,
        loading,
        dialogs,
        pageSaveButton,
        handleSavePage,
    } = usePage({
        pageId: id,
    });

    const handleSaveAction = async () => {
        try {
            await handleSavePage();
            return true;
        } catch {
            return false;
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!linkState) return <></>;

    return (
        <EditPageLayout>
            {hasChanges && (
                <RouterPrompt
                    message={(location) => {
                        return intl.formatMessage(messages.saveUnsavedChanges);
                    }}
                    saveAction={handleSaveAction}
                />
            )}
            <Toolbar>
                <ToolbarItem>
                    <IconButton onClick={stackApi?.goBack}>
                        <ArrowLeft />
                    </IconButton>
                </ToolbarItem>
                <PageName pageId={id} />
                <ToolbarFillSpace />
                <ToolbarItem>{pageSaveButton}</ToolbarItem>
            </Toolbar>
            <MainContent>
                <RouterTabs>
                    <RouterTab label={intl.formatMessage(messages.content)} path="">
                        <AdminComponentRoot>{rootBlocksApi.content.adminUI}</AdminComponentRoot>
                    </RouterTab>
                </RouterTabs>
            </MainContent>
            {dialogs}
        </EditPageLayout>
    );
};
