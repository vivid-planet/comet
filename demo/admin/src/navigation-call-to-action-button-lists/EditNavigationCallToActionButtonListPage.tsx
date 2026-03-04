import { gql, useMutation, useQuery } from "@apollo/client";
import { FillSpace, MainContent, messages, SaveButton, Stack, StackToolbar, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
import { Save } from "@comet/admin-icons";
import {
    BlockAdminComponentRoot,
    BlockPreviewWithTabs,
    type BlockState,
    ContentScopeIndicator,
    resolveHasSaveConflict,
    useBlockContext,
    useBlockPreview,
    useContentScope,
    useSaveConflictQuery,
    useSiteConfig,
} from "@comet/cms-admin";
import { type NavigationCallToActionButtonListContentBlockInput } from "@src/blocks.generated";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useRouteMatch } from "react-router";

import { NavigationCallToActionButtonListContentBlock } from "./blocks/NavigationCallToActionButtonListContentBlock";
import {
    type GQLCheckForChangesNavigationCallToActionButtonListQuery,
    type GQLCheckForChangesNavigationCallToActionButtonListQueryVariables,
    type GQLNavigationCallToActionButtonListQuery,
    type GQLNavigationCallToActionButtonListQueryVariables,
    type GQLSaveNavigationCallToActionButtonListMutation,
    type GQLSaveNavigationCallToActionButtonListMutationVariables,
    namedOperations,
} from "./EditNavigationCallToActionButtonListPage.generated";

export function EditNavigationCallToActionButtonListPage(): JSX.Element | null {
    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const [state, setState] = useState<BlockState<typeof NavigationCallToActionButtonListContentBlock>>(
        NavigationCallToActionButtonListContentBlock.defaultValues(),
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [referenceContent, setReferenceContent] = useState<NavigationCallToActionButtonListContentBlockInput | null>(null);
    const match = useRouteMatch();
    const previewApi = useBlockPreview();
    const blockContext = useBlockContext();

    const { data, refetch, loading } = useQuery<GQLNavigationCallToActionButtonListQuery, GQLNavigationCallToActionButtonListQueryVariables>(
        navigationCallToActionButtonListQuery,
        {
            variables: {
                scope,
            },
        },
    );

    const saveConflict = useSaveConflictQuery<
        GQLCheckForChangesNavigationCallToActionButtonListQuery,
        GQLCheckForChangesNavigationCallToActionButtonListQueryVariables
    >(
        checkForChangesQuery,
        {
            variables: {
                scope,
            },
            resolveHasConflict: (checkForChangesData) => {
                return resolveHasSaveConflict(
                    data?.navigationCallToActionButtonList?.updatedAt,
                    checkForChangesData?.navigationCallToActionButtonList?.updatedAt,
                );
            },
        },
        {
            hasChanges,
            loadLatestVersion: async () => {
                await refetch();
            },
            onDiscardButtonPressed: async () => {
                await refetch();
            },
        },
    );

    const [update, { loading: saving, error: hasSaveErrors }] = useMutation<
        GQLSaveNavigationCallToActionButtonListMutation,
        GQLSaveNavigationCallToActionButtonListMutationVariables
    >(saveNavigationCallToActionButtonListMutation, {
        refetchQueries: !data?.navigationCallToActionButtonList ? [namedOperations.Query.NavigationCallToActionButtonList] : [],
    });

    useEffect(() => {
        if (data) {
            if (data.navigationCallToActionButtonList) {
                const content = NavigationCallToActionButtonListContentBlock.input2State(data.navigationCallToActionButtonList.content);
                setState(content);
                setReferenceContent(NavigationCallToActionButtonListContentBlock.state2Output(content));
            } else {
                const defaultState = NavigationCallToActionButtonListContentBlock.defaultValues();
                setState(defaultState);
                setReferenceContent(NavigationCallToActionButtonListContentBlock.state2Output(defaultState));
            }
        }
    }, [data]);

    useEffect(() => {
        const equal = isEqual(referenceContent, state ? NavigationCallToActionButtonListContentBlock.state2Output(state) : null);
        setHasChanges(!equal);
    }, [state, referenceContent]);

    if (loading) {
        return null;
    }

    const handleSavePage = async () => {
        const hasSaveConflict = await saveConflict.checkForConflicts();
        if (hasSaveConflict) {
            return; // dialogs open for the user to handle the conflict
        }

        const input = { content: NavigationCallToActionButtonListContentBlock.state2Output(state) };
        await update({
            variables: { input, scope },
        });
    };

    const tabs = [
        {
            key: "content",
            label: <FormattedMessage {...messages.content} />,
            content: (
                <BlockAdminComponentRoot>
                    <NavigationCallToActionButtonListContentBlock.AdminComponent state={state} updateState={setState} />
                </BlockAdminComponentRoot>
            ),
        },
    ];

    const previewState = NavigationCallToActionButtonListContentBlock.createPreviewState(state, {
        ...blockContext,
        parentUrl: match.url,
        showVisibleOnly: previewApi.showOnlyVisible,
    });

    return (
        <Stack topLevelTitle={null}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
                <ToolbarTitleItem>
                    <FormattedMessage id="navigationCallToActionButtonLists.edit.toolbarTitle" defaultMessage="Edit navigation buttons" />
                </ToolbarTitleItem>
                <FillSpace />
                <ToolbarActions>
                    <SaveButton
                        disabled={!hasChanges}
                        variant="primary"
                        loading={saving}
                        hasErrors={hasSaveErrors != null}
                        onClick={handleSavePage}
                        startIcon={<Save />}
                    >
                        <FormattedMessage {...messages.save} />
                    </SaveButton>
                </ToolbarActions>
            </StackToolbar>
            <MainContent disablePaddingBottom>
                <BlockPreviewWithTabs
                    previewUrl={`${siteConfig.blockPreviewBaseUrl}/navigation-call-to-action-button-list`}
                    previewState={previewState}
                    previewApi={previewApi}
                >
                    {tabs}
                </BlockPreviewWithTabs>
            </MainContent>
            {saveConflict.dialogs}
        </Stack>
    );
}

const navigationCallToActionButtonListQuery = gql`
    query NavigationCallToActionButtonList($scope: NavigationCallToActionButtonListScopeInput!) {
        navigationCallToActionButtonList(scope: $scope) {
            id
            content
            scope {
                domain
                language
            }
            updatedAt
        }
    }
`;

const saveNavigationCallToActionButtonListMutation = gql`
    mutation SaveNavigationCallToActionButtonList(
        $input: NavigationCallToActionButtonListInput!
        $scope: NavigationCallToActionButtonListScopeInput!
    ) {
        saveNavigationCallToActionButtonList(input: $input, scope: $scope) {
            id
            content
            updatedAt
        }
    }
`;

const checkForChangesQuery = gql`
    query CheckForChangesNavigationCallToActionButtonList($scope: NavigationCallToActionButtonListScopeInput!) {
        navigationCallToActionButtonList(scope: $scope) {
            updatedAt
        }
    }
`;
