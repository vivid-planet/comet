import { gql, useMutation } from "@apollo/client";
import {
    MainContent,
    messages,
    RouterPrompt,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { Add, Delete, Preview, Save } from "@comet/admin-icons";
import { AdminComponentRoot, BlockOutputApi, BlockState, HiddenInSubroute, IFrameBridgeProvider, resolveNewState } from "@comet/blocks-admin";
import { EditPageLayout, openPreviewWindow, SplitPreview, useBlockPreview, useCmsBlockContext, useSiteConfig } from "@comet/cms-admin";
import { Button } from "@mui/material";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { useContentScope } from "@src/common/ContentScopeProvider";
import {
    GQLEditMainMenuItemFragment,
    GQLUpdateMainMenuItemMutation,
    GQLUpdateMainMenuItemMutationVariables,
    namedOperations,
} from "@src/graphql.generated";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouteMatch } from "react-router-dom";

export const editMainMenuItemFragment = gql`
    fragment EditMainMenuItem on MainMenuItem {
        id
        node {
            id
            name
            path
        }
        content
        updatedAt
    }
`;

const updateMainMenuItemMutation = gql`
    mutation UpdateMainMenuItem($pageTreeNodeId: ID!, $lastUpdatedAt: DateTime, $input: MainMenuItemInput!) {
        updateMainMenuItem(pageTreeNodeId: $pageTreeNodeId, lastUpdatedAt: $lastUpdatedAt, input: $input) {
            id
            content
            updatedAt
        }
    }
`;

interface EditMainMenuItemProps {
    item: GQLEditMainMenuItemFragment;
}

type RichTextBlockState = BlockState<typeof RichTextBlock>;
type RichTextBlockOutput = BlockOutputApi<typeof RichTextBlock>;

const EditMainMenuItem: React.FunctionComponent<EditMainMenuItemProps> = ({ item }) => {
    const previewApi = useBlockPreview();
    const match = useRouteMatch();
    const stackApi = useStackApi();
    const [updateMainMenuItem, { loading: saving, error: saveError }] = useMutation<
        GQLUpdateMainMenuItemMutation,
        GQLUpdateMainMenuItemMutationVariables
    >(updateMainMenuItemMutation);
    const [referenceContent, setReferenceContent] = React.useState<RichTextBlockOutput | null>(null);
    const [hasChanges, setHasChanges] = React.useState(false);
    const [content, setContent] = React.useState<RichTextBlockState | null>(null);
    const { match: contentScopeMatch, scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const intl = useIntl();
    const blockContext = useCmsBlockContext();

    React.useEffect(() => {
        setContent(item.content ? RichTextBlock.input2State(item.content) : null);
        setReferenceContent(item.content ? RichTextBlock.state2Output(RichTextBlock.input2State(item.content)) : null);
    }, [item]);

    React.useEffect(() => {
        const equal = isEqual(referenceContent, content ? RichTextBlock.state2Output(content) : null);
        setHasChanges(!equal);
    }, [content, referenceContent]);
    let previewState = undefined;

    if (content) {
        previewState = RichTextBlock.createPreviewState(content, {
            ...blockContext,
            parentUrl: match.url,
            showVisibleOnly: previewApi.showOnlyVisible,
        });
    }

    const handleAddContentClick = () => {
        setContent(RichTextBlock.defaultValues());
    };

    const handleRemoveContentClick = () => {
        setContent(null);
    };

    const handleSaveClick = () => {
        return updateMainMenuItem({
            variables: {
                pageTreeNodeId: item.node.id,
                input: { content: content ? RichTextBlock.state2Output(content) : null },
                lastUpdatedAt: item.updatedAt,
            },
            refetchQueries: [namedOperations.Query.MainMenuItem],
        });
    };

    const handleSaveAction = async () => {
        try {
            await handleSaveClick();
            return true;
        } catch {
            return false;
        }
    };

    return (
        <EditPageLayout>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarTitleItem>{item?.node?.name}</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        startIcon={<Preview />}
                        onClick={() => {
                            openPreviewWindow(item.node.path, contentScopeMatch.url);
                        }}
                    >
                        <FormattedMessage id="cometDemo.pages.pages.page.edit.preview" defaultMessage="Web preview" />
                    </Button>

                    <SplitButton localStorageKey="EditMainMenuItemSave" disabled={!hasChanges}>
                        <SaveButton
                            startIcon={<Save />}
                            saving={saving}
                            hasErrors={saveError != null}
                            color="primary"
                            variant="contained"
                            onClick={handleSaveClick}
                        >
                            <FormattedMessage {...messages.save} />
                        </SaveButton>
                        <SaveButton
                            startIcon={<Save />}
                            saving={saving}
                            hasErrors={saveError != null}
                            color="primary"
                            variant="contained"
                            onClick={async () => {
                                await handleSaveClick();
                                stackApi?.goBack();
                            }}
                        >
                            <FormattedMessage {...messages.saveAndGoBack} />
                        </SaveButton>
                    </SplitButton>
                </ToolbarActions>
            </Toolbar>
            {hasChanges && (
                <RouterPrompt
                    message={(location) => {
                        if (location.pathname.startsWith(match.url)) return true; //we navigated within our self
                        return intl.formatMessage(messages.saveUnsavedChanges);
                    }}
                    saveAction={handleSaveAction}
                />
            )}
            <MainContent>
                <IFrameBridgeProvider>
                    <SplitPreview url={`${siteConfig.previewUrl}/admin/main-menu`} previewState={previewState} previewApi={previewApi}>
                        <div>
                            {content ? (
                                <AdminComponentRoot title={intl.formatMessage({ id: "cometDemo.mainMenu.menuItem", defaultMessage: "Menu item" })}>
                                    <RichTextBlock.AdminComponent
                                        state={content}
                                        updateState={(setStateAction) => {
                                            setContent(resolveNewState({ prevState: content, setStateAction }));
                                        }}
                                    />
                                    <HiddenInSubroute>
                                        <Button startIcon={<Delete />} onClick={handleRemoveContentClick}>
                                            <FormattedMessage id="cometDemo.mainMenu.removeContent" defaultMessage="Remove content" />
                                        </Button>
                                    </HiddenInSubroute>
                                </AdminComponentRoot>
                            ) : (
                                <Button startIcon={<Add />} onClick={handleAddContentClick}>
                                    <FormattedMessage id="cometDemo.mainMenu.addContent" defaultMessage="Add content" />
                                </Button>
                            )}
                        </div>
                    </SplitPreview>
                </IFrameBridgeProvider>
            </MainContent>
        </EditPageLayout>
    );
};

export default EditMainMenuItem;
