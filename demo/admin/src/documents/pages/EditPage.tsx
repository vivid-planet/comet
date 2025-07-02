import { gql } from "@apollo/client";
import { Button, FillSpace, Loading, MainContent, RouterPrompt, Toolbar, ToolbarActions, ToolbarItem, useStackApi } from "@comet/admin";
import { ArrowLeft, Preview } from "@comet/admin-icons";
import {
    AzureAiTranslatorProvider,
    BlockAdminComponentRoot,
    BlockAdminTabLabel,
    BlockPreviewWithTabs,
    ContentGenerationConfigProvider,
    ContentScopeIndicator,
    createUsePage,
    openSitePreviewWindow,
    PageName,
    useBlockContext,
    useBlockPreview,
    useContentScope,
    useSiteConfig,
} from "@comet/cms-admin";
import { IconButton, Stack } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouteMatch } from "react-router";

import { PageContentBlock } from "./blocks/PageContentBlock";
import { SeoBlock } from "./blocks/SeoBlock";
import { StageBlock } from "./blocks/StageBlock";
import {
    type GQLEditPageQuery,
    type GQLEditPageQueryVariables,
    type GQLUpdatePageMutation,
    type GQLUpdatePageMutationVariables,
} from "./EditPage.generated";

interface Props {
    id: string;
}

const usePage = createUsePage({
    rootBlocks: {
        content: PageContentBlock,
        seo: SeoBlock,
        stage: StageBlock,
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
});

export const EditPage = ({ id }: Props) => {
    const intl = useIntl();
    const { pageState, rootBlocksApi, hasChanges, loading, dialogs, pageSaveButton, handleSavePage } = usePage({
        pageId: id,
    });

    const match = useRouteMatch();
    const stackApi = useStackApi();
    const { match: contentScopeMatch, scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const previewApi = useBlockPreview();

    const blockContext = useBlockContext();

    const tabRouteMatch = useRouteMatch<{ tab: string }>(`${match.path}/:tab`);

    if (pageState == null || pageState.document == null) {
        return null;
    }

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    let previewUrl: string;
    let previewState;

    if (tabRouteMatch?.params.tab === "stage") {
        previewUrl = `${siteConfig.blockPreviewBaseUrl}/stage`;
        previewState = StageBlock.createPreviewState(pageState.document.stage, {
            ...blockContext,
            parentUrl: `${match.url}/stage`,
            showVisibleOnly: previewApi.showOnlyVisible,
        });
    } else {
        previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
        previewState = PageContentBlock.createPreviewState(pageState.document.content, {
            ...blockContext,
            parentUrl: match.url,
            showVisibleOnly: previewApi.showOnlyVisible,
        });
    }

    return (
        <AzureAiTranslatorProvider showApplyTranslationDialog={true} enabled={true}>
            <ContentGenerationConfigProvider
                seo={{
                    getRelevantContent: () => {
                        if (!pageState || !pageState.document) return [];

                        return PageContentBlock.extractTextContents?.(pageState.document.content, { includeInvisibleContent: false }) ?? [];
                    },
                }}
            >
                {hasChanges && (
                    <RouterPrompt
                        message={(location) => {
                            if (location.pathname.startsWith(match.url)) return true; //we navigated within our self
                            return intl.formatMessage({
                                id: "editPage.discardChanges",
                                defaultMessage: "Discard unsaved changes?",
                            });
                        }}
                        saveAction={async () => {
                            try {
                                await handleSavePage();
                                return true;
                            } catch {
                                return false;
                            }
                        }}
                    />
                )}
                <Toolbar scopeIndicator={<ContentScopeIndicator />}>
                    <ToolbarItem>
                        <IconButton onClick={stackApi?.goBack} size="large">
                            <ArrowLeft />
                        </IconButton>
                    </ToolbarItem>
                    <PageName pageId={id} />
                    <FillSpace />
                    <ToolbarActions>
                        <Stack direction="row" spacing={1}>
                            <Button
                                startIcon={<Preview />}
                                variant="textDark"
                                disabled={!pageState}
                                onClick={() => {
                                    openSitePreviewWindow(pageState.path, contentScopeMatch.url);
                                }}
                            >
                                <FormattedMessage id="pages.pages.page.edit.preview" defaultMessage="Web preview" />
                            </Button>
                            {pageSaveButton}
                        </Stack>
                    </ToolbarActions>
                </Toolbar>
                <MainContent disablePaddingBottom>
                    <BlockPreviewWithTabs previewUrl={previewUrl} previewState={previewState} previewApi={previewApi}>
                        {[
                            {
                                key: "content",
                                label: (
                                    <BlockAdminTabLabel isValid={rootBlocksApi.content.isValid}>
                                        <FormattedMessage id="generic.blocks" defaultMessage="Blocks" />
                                    </BlockAdminTabLabel>
                                ),
                                content: (
                                    <BlockAdminComponentRoot
                                        title={intl.formatMessage({ id: "pages.pages.page.edit.pageBlocks.title", defaultMessage: "Page" })}
                                    >
                                        {rootBlocksApi.content.adminUI}
                                    </BlockAdminComponentRoot>
                                ),
                            },
                            {
                                key: "stage",
                                label: (
                                    <BlockAdminTabLabel isValid={rootBlocksApi.stage.isValid}>
                                        <FormattedMessage id="pages.page.edit.stage" defaultMessage="Stage" />
                                    </BlockAdminTabLabel>
                                ),
                                content: (
                                    <BlockAdminComponentRoot
                                        title={intl.formatMessage({ id: "pages.pages.page.edit.stage.title", defaultMessage: "Stage" })}
                                    >
                                        {rootBlocksApi.stage.adminUI}
                                    </BlockAdminComponentRoot>
                                ),
                            },
                            {
                                key: "config",
                                label: (
                                    <BlockAdminTabLabel isValid={rootBlocksApi.seo.isValid}>
                                        <FormattedMessage id="pages.pages.page.edit.config" defaultMessage="Config" />
                                    </BlockAdminTabLabel>
                                ),
                                content: rootBlocksApi.seo.adminUI,
                            },
                        ]}
                    </BlockPreviewWithTabs>
                </MainContent>
                {dialogs}
            </ContentGenerationConfigProvider>
        </AzureAiTranslatorProvider>
    );
};
