import { gql } from "@apollo/client";
import { Loading, MainContent, messages, RouterPrompt, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem, useStackApi } from "@comet/admin";
import { ArrowLeft, Preview } from "@comet/admin-icons";
import { AdminComponentRoot, AdminTabLabel } from "@comet/blocks-admin";
import {
    AzureAiTranslatorProvider,
    BlockPreviewWithTabs,
    ContentScopeIndicator,
    createUsePage,
    DependencyList,
    openSitePreviewWindow,
    PageName,
    useBlockPreview,
    useCmsBlockContext,
    useSiteConfig,
} from "@comet/cms-admin";
import { Button, IconButton } from "@mui/material";
import { SeoBlock } from "@src/common/blocks/SeoBlock";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouteMatch } from "react-router";

import { GQLEditPageQuery, GQLEditPageQueryVariables, GQLUpdatePageMutation, GQLUpdatePageMutationVariables } from "./EditPage.generated";
import { PageContentBlock } from "./PageContentBlock";

const pageDependenciesQuery = gql`
    query PageDependencies($id: ID!, $offset: Int!, $limit: Int!, $forceRefresh: Boolean = false) {
        item: page(id: $id) {
            id
            dependencies(offset: $offset, limit: $limit, forceRefresh: $forceRefresh) {
                nodes {
                    targetGraphqlObjectType
                    targetId
                    rootColumnName
                    jsonPath
                    name
                    secondaryInformation
                }
                totalCount
            }
        }
    }
`;

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
        mutation UpdatePage($pageId: ID!, $input: PageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
            savePage(pageId: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                seo
                updatedAt
            }
        }
    `,
});

export const EditPage: React.FC<Props> = ({ id, category }) => {
    const intl = useIntl();
    const { pageState, rootBlocksApi, hasChanges, loading, dialogs, pageSaveButton, handleSavePage } = usePage({
        pageId: id,
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

    if (!pageState) return null;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
<<<<<<< HEAD
        <>
            {hasChanges && (
                <RouterPrompt
                    message={(location) => {
                        if (location.pathname.startsWith(match.url)) return true; //we navigated within our self
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
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        color="info"
                        startIcon={<Preview />}
                        disabled={!pageState}
                        onClick={() => {
                            openSitePreviewWindow(pageState.path, contentScopeMatch.url);
                        }}
                    >
                        <FormattedMessage id="pages.pages.page.edit.preview" defaultMessage="Web preview" />
                    </Button>
                    {pageSaveButton}
                </ToolbarActions>
            </Toolbar>
            <MainContent disablePaddingBottom>
                <BlockPreviewWithTabs previewUrl={`${siteConfig.blockPreviewBaseUrl}/page`} previewState={previewState} previewApi={previewApi}>
                    {[
                        {
                            key: "content",
                            label: (
                                <AdminTabLabel isValid={rootBlocksApi.content.isValid}>
                                    <FormattedMessage {...messages.content} />
                                </AdminTabLabel>
                            ),
                            content: (
                                <AdminComponentRoot title={intl.formatMessage(messages.page)}>{rootBlocksApi.content.adminUI}</AdminComponentRoot>
                            ),
                        },
                        {
                            key: "config",
                            label: (
                                <AdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                    <FormattedMessage id="pages.pages.page.edit.config" defaultMessage="Config" />
                                </AdminTabLabel>
                            ),
                            content: rootBlocksApi.seo.adminUI,
                        },
                        {
                            key: "dependencies",
                            label: (
                                <AdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                    <FormattedMessage id="pages.pages.page.edit.dependencies" defaultMessage="Dependencies" />
                                </AdminTabLabel>
                            ),
                            content: (
                                <DependencyList
                                    query={pageDependenciesQuery}
                                    variables={{
                                        id: pageState?.document?.id ?? "",
                                    }}
                                />
                            ),
                        },
                    ]}
                </BlockPreviewWithTabs>
            </MainContent>
            {dialogs}
        </>
=======
        <AzureAiTranslatorProvider showApplyTranslationDialog={true} enabled={true}>
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
                            color="info"
                            startIcon={<Preview />}
                            disabled={!pageState}
                            onClick={() => {
                                openSitePreviewWindow(pageState.path, contentScopeMatch.url);
                            }}
                        >
                            <FormattedMessage id="pages.pages.page.edit.preview" defaultMessage="Web preview" />
                        </Button>
                        {pageSaveButton}
                    </ToolbarActions>
                </Toolbar>
                <MainContent disablePaddingBottom>
                    <BlockPreviewWithTabs previewUrl={`${siteConfig.previewUrl}/admin/page`} previewState={previewState} previewApi={previewApi}>
                        {[
                            {
                                key: "content",
                                label: (
                                    <AdminTabLabel isValid={rootBlocksApi.content.isValid}>
                                        <FormattedMessage {...messages.content} />
                                    </AdminTabLabel>
                                ),
                                content: (
                                    <AdminComponentRoot title={intl.formatMessage(messages.page)}>{rootBlocksApi.content.adminUI}</AdminComponentRoot>
                                ),
                            },
                            {
                                key: "config",
                                label: (
                                    <AdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                        <FormattedMessage id="pages.pages.page.edit.config" defaultMessage="Config" />
                                    </AdminTabLabel>
                                ),
                                content: rootBlocksApi.seo.adminUI,
                            },
                            {
                                key: "dependencies",
                                label: (
                                    <AdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                        <FormattedMessage id="pages.pages.page.edit.dependencies" defaultMessage="Dependencies" />
                                    </AdminTabLabel>
                                ),
                                content: (
                                    <DependencyList
                                        query={pageDependenciesQuery}
                                        variables={{
                                            id: pageState?.document?.id ?? "",
                                        }}
                                    />
                                ),
                            },
                        ]}
                    </BlockPreviewWithTabs>
                </MainContent>
                {dialogs}
            </EditPageLayout>
        </AzureAiTranslatorProvider>
>>>>>>> main
    );
};
