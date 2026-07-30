import { gql, useMutation, useQuery } from "@apollo/client";
import { FieldSet, FillSpace, MainContent, SaveButton, Stack, StackToolbar, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
import {
    type BlockState,
    ContentScopeIndicator,
    resolveHasSaveConflict,
    useContentScope,
    useContentScopeConfig,
    useSaveConflictQuery,
} from "@comet/cms-admin";
import type { OrganizationBlockInput } from "@src/blocks.generated";
import isEqual from "lodash.isequal";
import { type JSX, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { OrganizationBlock } from "./blocks/OrganizationBlock";
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
    const [organizationState, setOrganizationState] = useState<BlockState<typeof OrganizationBlock>>(OrganizationBlock.defaultValues());
    const [hasChanges, setHasChanges] = useState(false);
    const [referenceOrganization, setReferenceOrganization] = useState<OrganizationBlockInput | null>(null);

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
            const state = data.siteSettings ? OrganizationBlock.input2State(data.siteSettings.organization) : OrganizationBlock.defaultValues();
            setOrganizationState(state);
            setReferenceOrganization(OrganizationBlock.state2Output(state));
        }
    }, [data]);

    useEffect(() => {
        const equal = isEqual(referenceOrganization, organizationState ? OrganizationBlock.state2Output(organizationState) : null);
        setHasChanges(!equal);
    }, [organizationState, referenceOrganization]);

    if (loading) {
        return null;
    }

    const handleSavePage = async () => {
        const hasSaveConflict = await saveConflict.checkForConflicts();
        if (hasSaveConflict) {
            return; // dialogs open for the user to handle the conflict
        }

        const input = { organization: OrganizationBlock.state2Output(organizationState) };
        await update({
            variables: { input, scope },
        });
    };

    return (
        <>
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
                <FieldSet
                    title={<FormattedMessage id="siteSettings.organization.title" defaultMessage="Organization" />}
                    supportText={
                        <FormattedMessage
                            id="siteSettings.organization.supportText"
                            defaultMessage="Emitted as Organization structured data (JSON-LD) on every page of this scope."
                        />
                    }
                    collapsible={false}
                >
                    <Stack topLevelTitle={null}>
                        <OrganizationBlock.AdminComponent state={organizationState} updateState={setOrganizationState} />
                    </Stack>
                </FieldSet>
            </MainContent>
            {saveConflict.dialogs}
        </>
    );
}

const siteSettingsQuery = gql`
    query SiteSettings($scope: SiteSettingsScopeInput!) {
        siteSettings(scope: $scope) {
            id
            organization
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
            organization
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
