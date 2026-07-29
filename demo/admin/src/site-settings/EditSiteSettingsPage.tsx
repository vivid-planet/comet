import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FieldSet,
    FillSpace,
    FinalForm,
    Loading,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackToolbar,
    TextAreaField,
    TextField,
    ToolbarActions,
    ToolbarTitleItem,
    useFormApiRef,
} from "@comet/admin";
import {
    type BlockState,
    ContentScopeIndicator,
    createFinalFormBlock,
    DamImageBlock,
    resolveHasSaveConflict,
    useContentScope,
    useContentScopeConfig,
    useFormSaveConflict,
} from "@comet/cms-admin";
import arrayMutators from "final-form-arrays";
import isEqual from "lodash.isequal";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import {
    type GQLCheckForChangesSiteSettingsQuery,
    type GQLCheckForChangesSiteSettingsQueryVariables,
    type GQLSaveSiteSettingsMutation,
    type GQLSaveSiteSettingsMutationVariables,
    type GQLSiteSettingsQuery,
    type GQLSiteSettingsQueryVariables,
    namedOperations,
} from "./EditSiteSettingsPage.generated";
import { SameAsUrlsField } from "./SameAsUrlsField";
import { validateUrl } from "./validateUrl";

const rootBlocks = {
    organizationLogo: DamImageBlock,
};

type FormValues = {
    organizationName: string;
    organizationUrl?: string | null;
    organizationLogo: BlockState<typeof rootBlocks.organizationLogo>;
    organizationSameAs: string[];
    organizationDescription?: string | null;
};

export function EditSiteSettingsPage() {
    const { scope } = useContentScope();
    const client = useApolloClient();
    const formApiRef = useFormApiRef<FormValues>();

    useContentScopeConfig({ redirectPathAfterChange: "/project-snips/site-settings" });

    const { data, error, loading, refetch } = useQuery<GQLSiteSettingsQuery, GQLSiteSettingsQueryVariables>(siteSettingsQuery, {
        variables: { scope },
    });

    const initialValues = useMemo<FormValues>(() => {
        if (!data?.siteSettings) {
            return {
                organizationName: "",
                organizationLogo: rootBlocks.organizationLogo.defaultValues(),
                organizationSameAs: [],
            };
        }

        const { organizationName, organizationUrl, organizationLogo, organizationSameAs, organizationDescription } = data.siteSettings;

        return {
            organizationName,
            organizationUrl,
            organizationLogo: rootBlocks.organizationLogo.input2State(organizationLogo),
            organizationSameAs: [...organizationSameAs],
            organizationDescription,
        };
    }, [data]);

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const { data: latestData } = await client.query<GQLCheckForChangesSiteSettingsQuery, GQLCheckForChangesSiteSettingsQueryVariables>({
                query: checkForChangesQuery,
                variables: { scope },
                fetchPolicy: "network-only",
            });
            return resolveHasSaveConflict(data?.siteSettings?.updatedAt, latestData.siteSettings?.updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formValues: FormValues) => {
        if (await saveConflict.checkForConflicts()) {
            throw new Error("Conflicts detected");
        }

        await client.mutate<GQLSaveSiteSettingsMutation, GQLSaveSiteSettingsMutationVariables>({
            mutation: saveSiteSettingsMutation,
            variables: {
                scope,
                input: {
                    organizationName: formValues.organizationName,
                    organizationUrl: formValues.organizationUrl || null,
                    organizationLogo: rootBlocks.organizationLogo.state2Output(formValues.organizationLogo),
                    organizationSameAs: formValues.organizationSameAs.filter((url) => url.trim().length > 0),
                    organizationDescription: formValues.organizationDescription || null,
                },
            },
            refetchQueries: data?.siteSettings ? [] : [namedOperations.Query.SiteSettings],
        });
    };

    if (error) {
        throw error;
    }

    return (
        <Stack topLevelTitle={null}>
            <SaveBoundary>
                <StackToolbar scopeIndicator={<ContentScopeIndicator />}>
                    <ToolbarTitleItem>
                        <FormattedMessage id="siteSettings.edit.toolbarTitle" defaultMessage="Edit site settings" />
                    </ToolbarTitleItem>
                    <FillSpace />
                    <ToolbarActions>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
                <MainContent>
                    {loading ? (
                        <Loading behavior="fillPageHeight" />
                    ) : (
                        <FinalForm<FormValues>
                            apiRef={formApiRef}
                            mode="edit"
                            onSubmit={handleSubmit}
                            initialValues={initialValues}
                            initialValuesEqual={isEqual} //required to compare block data correctly
                            mutators={{ ...arrayMutators }}
                        >
                            {saveConflict.dialogs}
                            <FieldSet
                                title={<FormattedMessage id="siteSettings.organization" defaultMessage="Organization" />}
                                supportText={
                                    <FormattedMessage
                                        id="siteSettings.organization.supportText"
                                        defaultMessage="Rendered as Organization structured data (JSON-LD) on every page of the site."
                                    />
                                }
                            >
                                <TextField
                                    required
                                    fullWidth
                                    name="organizationName"
                                    label={<FormattedMessage id="siteSettings.organizationName" defaultMessage="Name" />}
                                />
                                <TextField
                                    fullWidth
                                    name="organizationUrl"
                                    label={<FormattedMessage id="siteSettings.organizationUrl" defaultMessage="URL" />}
                                    helperText={
                                        <FormattedMessage
                                            id="siteSettings.organizationUrl.helperText"
                                            defaultMessage="If empty, the site URL configured for this scope (siteConfig.url) is used."
                                        />
                                    }
                                    validate={validateUrl}
                                />
                                <Field
                                    name="organizationLogo"
                                    label={<FormattedMessage id="siteSettings.organizationLogo" defaultMessage="Logo" />}
                                    isEqual={isEqual}
                                    fullWidth
                                >
                                    {createFinalFormBlock(rootBlocks.organizationLogo)}
                                </Field>
                                <SameAsUrlsField
                                    name="organizationSameAs"
                                    label={<FormattedMessage id="siteSettings.organizationSameAs" defaultMessage="Same as" />}
                                    helperText={
                                        <FormattedMessage
                                            id="siteSettings.organizationSameAs.helperText"
                                            defaultMessage="URLs of other web presences of the organization, for instance, social media profiles."
                                        />
                                    }
                                />
                                <TextAreaField
                                    fullWidth
                                    name="organizationDescription"
                                    label={<FormattedMessage id="siteSettings.organizationDescription" defaultMessage="Description" />}
                                />
                            </FieldSet>
                        </FinalForm>
                    )}
                </MainContent>
            </SaveBoundary>
        </Stack>
    );
}

const siteSettingsQuery = gql`
    query SiteSettings($scope: SiteSettingsScopeInput!) {
        siteSettings(scope: $scope) {
            id
            organizationName
            organizationUrl
            organizationLogo
            organizationSameAs
            organizationDescription
            updatedAt
        }
    }
`;

const saveSiteSettingsMutation = gql`
    mutation SaveSiteSettings($input: SiteSettingsInput!, $scope: SiteSettingsScopeInput!) {
        saveSiteSettings(input: $input, scope: $scope) {
            id
            organizationName
            organizationUrl
            organizationLogo
            organizationSameAs
            organizationDescription
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
