import { gql } from "@apollo/client";
import {
    MainContent as CometMainContent,
    messages,
    RouterPrompt,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useStackApi,
} from "@comet/admin";
import { ArrowLeft, Preview } from "@comet/admin-icons";
import { AdminComponentRoot, AdminTabLabel } from "@comet/blocks-admin";
import {
    BlockPreviewWithTabs,
    createUsePage,
    EditPageLayout,
    openPreviewWindow,
    PageName,
    useBlockPreview,
    useCmsBlockContext,
    useSiteConfig,
} from "@comet/cms-admin";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { withStyles } from "@mui/styles";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { useContentScope } from "@src/common/ContentScopeProvider";
import {
    GQLEditPageQuery,
    GQLEditPageQueryVariables,
    GQLPageTreeNodeCategory,
    GQLUpdatePageMutation,
    GQLUpdatePageMutationVariables,
} from "@src/graphql.generated";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router";

import { PageContentBlock } from "./PageContentBlock";

interface Props {
    id: string;
    category: GQLPageTreeNodeCategory;
}

const usePage = createUsePage({
    rootBlocks: {
        content: PageContentBlock,
        seo: SeoBlock,
    },
    pageType: "Page",
})<GQLEditPageQuery, GQLEditPageQueryVariables, GQLUpdatePageMutation["savePage"], GQLUpdatePageMutationVariables>({
    getQuery: gql`
        query EditPage($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                path
                document {
                    __typename
                    ... on DocumentInterface {
                        id
                        updatedAt
                    }
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
});

// TODO: Add `disablePaddingBottom` prop to `MainContent` in @comet/admin
const MainContent = withStyles({
    root: {
        paddingBottom: 0,
    },
})(CometMainContent);

export const EditPage: React.FC<Props> = ({ id, category }) => {
    const intl = useIntl();
    const history = useHistory();
    const { pageState, rootBlocksApi, hasChanges, loading, dialogs, pageSaveButton, handleSavePage } = usePage({
        pageId: id,

        onValidationFailed: () => {
            history.push(`${match}/content`);
        },
    });

    const match = useRouteMatch();
    const stackApi = useStackApi();
    const { match: contentScopeMatch, scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const previewApi = useBlockPreview();

    const blockContext = useCmsBlockContext();

    const handleSaveAction = async () => {
        try {
            await handleSavePage();
            return true;
        } catch {
            return false;
        }
    };

    let previewState = undefined;

    if (pageState && pageState.document) {
        previewState = PageContentBlock.createPreviewState(pageState.document.content, {
            ...blockContext,
            parentUrl: match.url,
            showVisibleOnly: previewApi.showOnlyVisible,
        });
    }

    if (!pageState) return <></>;

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <EditPageLayout>
            {hasChanges && (
                <RouterPrompt
                    message={(location) => {
                        if (location.pathname.startsWith(match.url)) return true; //we navigated within our self
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
                <ToolbarActions>
                    <Button
                        startIcon={<Preview />}
                        disabled={!pageState}
                        onClick={() => {
                            openPreviewWindow(pageState.path, contentScopeMatch.url);
                        }}
                    >
                        <FormattedMessage id="cometDemo.pages.pages.page.edit.preview" defaultMessage="Web preview" />
                    </Button>
                    {pageSaveButton}
                </ToolbarActions>
            </Toolbar>
            <MainContent>
                <BlockPreviewWithTabs previewUrl={`${siteConfig.previewUrl}/admin/page`} previewState={previewState} previewApi={previewApi}>
                    {[
                        {
                            key: "content",
                            label: (
                                <AdminTabLabel isValid={rootBlocksApi.content.isValid}>
                                    <FormattedMessage id="comet.blocks" defaultMessage="Blocks" />
                                </AdminTabLabel>
                            ),
                            content: (
                                <AdminComponentRoot
                                    title={intl.formatMessage({ id: "cometDemo.pages.pages.page.edit.pageBlocks.title", defaultMessage: "Page" })}
                                >
                                    {rootBlocksApi.content.adminUI}
                                </AdminComponentRoot>
                            ),
                        },
                        {
                            key: "config",
                            label: (
                                <AdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                    <FormattedMessage id="cometDemo.pages.pages.page.edit.config" defaultMessage="Config" />{" "}
                                </AdminTabLabel>
                            ),
                            content: rootBlocksApi.seo.adminUI,
                        },
                    ]}
                </BlockPreviewWithTabs>
            </MainContent>
            {dialogs}
        </EditPageLayout>
    );
};
