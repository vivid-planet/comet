import { gql, useApolloClient } from "@apollo/client";
import { Field, FinalFormInput, FormSection } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { GQLDamFilenameAlreadyExistsQuery, GQLDamFilenameAlreadyExistsQueryVariables } from "../../graphql.generated";
import { CropSettingsFields } from "./CropSettingsFields";

interface SettingsFormProps {
    isImage: boolean;
    folderId: string | null;
}

const damFilenameAlreadyExistsQuery = gql`
    query DamFilenameAlreadyExists($filename: String!, $folderId: String) {
        damFilenameAlreadyExists(filename: $filename, folderId: $folderId)
    }
`;

export const FileSettingsFields = ({ isImage, folderId }: SettingsFormProps): React.ReactElement => {
    const intl = useIntl();
    const apollo = useApolloClient();
    const damFilenameAlreadyExists = React.useCallback(
        async (filename: string): Promise<boolean> => {
            const { data } = await apollo.query<GQLDamFilenameAlreadyExistsQuery, GQLDamFilenameAlreadyExistsQueryVariables>({
                query: damFilenameAlreadyExistsQuery,
                variables: {
                    filename,
                    folderId,
                },
                fetchPolicy: "network-only",
            });

            return data.damFilenameAlreadyExists;
        },
        [apollo, folderId],
    );

    return (
        <div>
            <FormSection title="General">
                <Field
                    label={intl.formatMessage({
                        id: "comet.dam.file.fileName",
                        defaultMessage: "File Name",
                    })}
                    name="name"
                    component={FinalFormInput}
                    validate={async (value, allValues, meta) => {
                        if (value && meta?.dirty) {
                            if (await damFilenameAlreadyExists(value)) {
                                return intl.formatMessage({
                                    id: "comet.dam.file.validate.filename.error",
                                    defaultMessage: "Filename already exists",
                                });
                            }
                        }
                    }}
                    fullWidth
                />
            </FormSection>
            {isImage && <CropSettingsFields />}
            <FormSection title={intl.formatMessage({ id: "comet.dam.file.seo", defaultMessage: "SEO" })}>
                <Field
                    label={intl.formatMessage({
                        id: "comet.dam.file.altText",
                        defaultMessage: "Alternative Text",
                    })}
                    name="altText"
                    component={FinalFormInput}
                    fullWidth
                />
                <Field
                    label={intl.formatMessage({
                        id: "comet.dam.file.title",
                        defaultMessage: "Title",
                    })}
                    name="title"
                    component={FinalFormInput}
                    fullWidth
                />
            </FormSection>
        </div>
    );
};
