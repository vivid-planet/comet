import { gql } from "@apollo/client";
import { FillSpace, Loading, MainContent, messages, RouterPrompt, RouterTab, RouterTabs, Toolbar, ToolbarItem, useStackApi } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { AdminComponentRoot } from "@comet/blocks-admin";
import { ContentScopeIndicator, createUsePage, PageName } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { useIntl } from "react-intl";

import {
    type GQLEditLinkQuery,
    type GQLEditLinkQueryVariables,
    type GQLUpdateLinkMutation,
    type GQLUpdateLinkMutationVariables,
} from "./EditLink.generated";

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
        mutation UpdateLink($pageId: ID!, $input: LinkInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
            saveLink(id: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
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

export const EditLink = ({ id }: Props) => {
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
        return <Loading behavior="fillPageHeight" />;
    }

    if (!linkState) return null;

    return (
        <>
            {hasChanges && (
                <RouterPrompt
                    message={(location) => {
                        return intl.formatMessage(messages.saveUnsavedChanges);
                    }}
                    saveAction={handleSaveAction}
                />
            )}
            <Toolbar scopeIndicator={<ContentScopeIndicator />}>
                <ToolbarItem>
                    <IconButton onClick={stackApi?.goBack}>
                        <ArrowLeft />
                    </IconButton>
                </ToolbarItem>
                <PageName pageId={id} />
                <FillSpace />
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
        </>
    );
};
