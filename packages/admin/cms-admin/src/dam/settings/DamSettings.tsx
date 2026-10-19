import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FieldSet,
    FillSpace,
    FinalForm,
    FinalFormSaveButton,
    Loading,
    MainContent,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarTitleItem,
} from "@dextinity/admin";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { FileField, type GQLDamFileFieldFileFragment } from "../../form/file/FileField";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { useDamScope } from "../config/useDamScope";
import { damSettingsQuery, updateDamSettingsMutation } from "./DamSettings.gql";
import type {
    GQLDamSettingsQuery,
    GQLDamSettingsQueryVariables,
    GQLUpdateDamSettingsMutation,
    GQLUpdateDamSettingsMutationVariables,
} from "./DamSettings.gql.generated";

interface FormValues {
    expiredLicenseFallbackImage?: GQLDamFileFieldFileFragment;
}

interface DamSettingsProps {
    contentScopeIndicator?: ReactNode;
}

export const DamSettings = ({ contentScopeIndicator }: DamSettingsProps) => {
    const scope = useDamScope();
    const apolloClient = useApolloClient();
    const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const { data, error, loading } = useQuery<GQLDamSettingsQuery, GQLDamSettingsQueryVariables>(damSettingsQuery, { variables: { scope } });

    if (error) {
        throw error;
    }

    if (loading || !data) {
        return <Loading behavior="fillPageHeight" />;
    }

    const handleSubmit = async ({ expiredLicenseFallbackImage }: FormValues) => {
        await apolloClient.mutate<GQLUpdateDamSettingsMutation, GQLUpdateDamSettingsMutationVariables>({
            mutation: updateDamSettingsMutation,
            variables: { scope, input: { expiredLicenseFallbackImageId: expiredLicenseFallbackImage?.id ?? null } },
        });
    };

    return (
        <FinalForm<FormValues>
            mode="edit"
            onSubmit={handleSubmit}
            initialValues={{ expiredLicenseFallbackImage: data.damSettings.expiredLicenseFallbackImage ?? undefined }}
        >
            {() => (
                <>
                    <Toolbar scopeIndicator={contentScopeIndicator}>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>
                            <FormattedMessage id="dextinity.dam.settings.title" defaultMessage="Settings" />
                        </ToolbarTitleItem>
                        <FillSpace />
                        <ToolbarActions>
                            <FinalFormSaveButton />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <FieldSet title={<FormattedMessage id="dextinity.dam.settings.licenses" defaultMessage="Licenses" />}>
                            <Field
                                name="expiredLicenseFallbackImage"
                                component={FileField}
                                fullWidth
                                label={
                                    <FormattedMessage
                                        id="dextinity.dam.settings.expiredLicenseFallbackImage"
                                        defaultMessage="Fallback image for expired licenses"
                                    />
                                }
                                helperText={
                                    <FormattedMessage
                                        id="dextinity.dam.settings.expiredLicenseFallbackImage.helperText"
                                        defaultMessage="Images with an expired license are replaced with this image on the site. If no fallback image is set, images with an expired license aren't shown at all."
                                    />
                                }
                                buttonText={<FormattedMessage id="dextinity.dam.settings.chooseImage" defaultMessage="Choose image" />}
                                allowedMimetypes={filteredAcceptedMimeTypes.pixelImage}
                            />
                        </FieldSet>
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
};
