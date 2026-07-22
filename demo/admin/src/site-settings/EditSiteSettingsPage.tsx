import { gql, useMutation, useQuery } from "@apollo/client";
import { FillSpace, MainContent, SaveButton, Stack, StackToolbar, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
import {
    BlockAdminComponentRoot,
    type BlockState,
    ContentScopeIndicator,
    resolveHasSaveConflict,
    useContentScope,
    useContentScopeConfig,
    useSaveConflictQuery,
} from "@comet/cms-admin";
import type { SiteSettingsContentBlockInput } from "@src/blocks.generated";
import isEqual from "lodash.isequal";
import { type JSX, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { SiteSettingsContentBlock } from "./blocks/SiteSettingsContentBlock";
import {
    type GQLCheckForChangesSiteSettingsQuery,
    type GQLCheckForChangesSiteSettingsQueryVariables,
    type GQLSaveSiteSettingsMutation,
    type GQLSaveSiteSettingsMutationVariables,
    type GQLSiteSettingsQuery,
    type GQLSiteSettingsQueryVariables,
    namedOperations,
} from "./EditSiteSettingsPage.generated";

export function EditSiteSettingsPage(): JSX.Element | null {
    const { scope } = useContentScope();
    const [siteSettingsState, setSiteSettingsState] = useState<BlockState<typeof SiteSettingsContentBlock>>(SiteSettingsContentBlock.defaultValues());
    const [hasChanges, setHasChanges] = useState(false);
    const [referenceContent, setReferenceContent] = useState<SiteSettingsContentBlockInput | null>(null);

    useContentScopeConfig({ redirectPathAfterChange: "/project-snips/site-settings" });

    const { data, refetch, loading } = useQuery<GQLSiteSettingsQuery, GQLSiteSettingsQueryVariables>(siteSettingsQuery, {
        variables: {
            scope,
        },
    });

    const saveConflict = useSaveConflictQuery<GQLCheckForChangesSiteSettingsQuery, GQLCheckForChangesSiteSettingsQueryVariables>(
        checkForChangesQuery,
        {
            variables: {
                scope,
            },
            resolveHasConflict: (checkForChangesData) => {
                return resolveHasSaveConflict(data?.siteSettings?.updatedAt, checkForChangesData?.siteSettings?.updatedAt);
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

    const [update, { loading: saving, error: hasSaveErrors }] = useMutation<GQLSaveSiteSettingsMutation, GQLSaveSiteSettingsMutationVariables>(
        saveSiteSettingsMutation,
        { refetchQueries: !data?.siteSettings ? [namedOperations.Query.SiteSettings] : [] },
    );

    useEffect(() => {
        if (data) {
            if (data.siteSettings) {
                const content = SiteSettingsContentBlock.input2State(data.siteSettings.content);
                setSiteSettingsState(content);
                setReferenceContent(SiteSettingsContentBlock.state2Output(content));
            } else {
                const state = SiteSettingsContentBlock.defaultValues();
                setSiteSettingsState(state);
                setReferenceContent(SiteSettingsContentBlock.state2Output(state));
            }
        }
    }, [data]);

    useEffect(() => {
        const equal = isEqual(referenceContent, siteSettingsState ? SiteSettingsContentBlock.state2Output(siteSettingsState) : null);
        setHasChanges(!equal);
    }, [siteSettingsState, referenceContent]);

    if (loading) {
        return null;
    }

    const handleSavePage = async () => {
        const hasSaveConflict = await saveConflict.checkForConflicts();
        if (hasSaveConflict) {
            return; // dialogs open for the user to handle the conflict
        }

        const input = { content: SiteSettingsContentBlock.state2Output(siteSettingsState) };
        await update({
            variables: { input, scope },
        });
    };

    return (
        <Stack topLevelTitle={null}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
                <ToolbarTitleItem>
                    <FormattedMessage id="siteSettings.edit.toolbarTitle" defaultMessage="Edit site settings" />
                </ToolbarTitleItem>
                <FillSpace />
                <ToolbarActions>
                    <SaveButton disabled={!hasChanges} loading={saving} hasErrors={hasSaveErrors != null} onClick={handleSavePage} />
                </ToolbarActions>
            </StackToolbar>
            <MainContent>
                <BlockAdminComponentRoot>
                    <SiteSettingsContentBlock.AdminComponent state={siteSettingsState} updateState={setSiteSettingsState} />
                </BlockAdminComponentRoot>
            </MainContent>
            {saveConflict.dialogs}
        </Stack>
    );
}

const siteSettingsQuery = gql`
    query SiteSettings($scope: SiteSettingsScopeInput!) {
        siteSettings(scope: $scope) {
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

const saveSiteSettingsMutation = gql`
    mutation SaveSiteSettings($input: SiteSettingsInput!, $scope: SiteSettingsScopeInput!) {
        saveSiteSettings(input: $input, scope: $scope) {
            id
            content
            updatedAt
        }
    }
`;

const checkForChangesQuery = gql`
    query CheckForChangesSiteSettings($scope: SiteSettingsScopeInput!) {
        siteSettings(scope: $scope) {
            updatedAt
        }
    }
`;
