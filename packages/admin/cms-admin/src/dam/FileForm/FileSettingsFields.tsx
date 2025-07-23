import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Field, FieldContainer, FinalFormInput, FinalFormSelect, FormSection, Loading } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { ArtificialIntelligence, Calendar } from "@comet/admin-icons";
import { IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";
import { useForm } from "react-final-form";
import { FormattedMessage, useIntl } from "react-intl";

import { useContentLanguage } from "../../contentLanguage/useContentLanguage";
import { useContentScope } from "../../contentScope/Provider";
import { useDamConfig } from "../config/damConfig";
import { useDamScope } from "../config/useDamScope";
import { slugifyFilename } from "../helpers/slugifyFilename";
import { CropSettingsFields } from "./CropSettingsFields";
import { type DamFileDetails, type EditFileFormValues } from "./EditFile";
import { type GQLDamIsFilenameOccupiedQuery, type GQLDamIsFilenameOccupiedQueryVariables } from "./FileSettingsFields.generated";
import { generateAltTextMutation, generateImageTitleMutation } from "./FileSettingsFields.gql";
import {
    type GQLGenerateAltTextMutation,
    type GQLGenerateAltTextMutationVariables,
    type GQLGenerateImageTitleMutation,
    type GQLGenerateImageTitleMutationVariables,
} from "./FileSettingsFields.gql.generated";
import { type LicenseType, licenseTypeArray, licenseTypeLabels } from "./licenseType";

interface SettingsFormProps {
    file: DamFileDetails;
}

const damIsFilenameOccupiedQuery = gql`
    query DamIsFilenameOccupied($filename: String!, $folderId: String, $scope: DamScopeInput!) {
        damIsFilenameOccupied(filename: $filename, folderId: $folderId, scope: $scope)
    }
`;

export const FileSettingsFields = ({ file }: SettingsFormProps) => {
    const folderId = file.folder?.id ?? null;
    const isImage = !!file.image;
    const intl = useIntl();
    const apollo = useApolloClient();
    const scope = useDamScope();
    const damConfig = useDamConfig();
    const formApi = useForm();
    const { contentGeneration } = useDamConfig();
    const contentScope = useContentScope();
    const language = useContentLanguage(contentScope);

    const damIsFilenameOccupied = useCallback(
        async (filename: string): Promise<boolean> => {
            const { data } = await apollo.query<GQLDamIsFilenameOccupiedQuery, GQLDamIsFilenameOccupiedQueryVariables>({
                query: damIsFilenameOccupiedQuery,
                variables: {
                    filename,
                    folderId,
                    scope,
                },
                fetchPolicy: "network-only",
            });

            return data.damIsFilenameOccupied;
        },
        [apollo, folderId, scope],
    );

    const requiredValidator = useCallback(
        (value: unknown, allValues: object) => {
            const type = (allValues as EditFileFormValues).license?.type;
            const isRequired = type === "ROYALTY_FREE" ? false : damConfig.requireLicense;

            if (isRequired && !value) {
                return <FormattedMessage id="comet.form.required" defaultMessage="Required" />;
            }
        },
        [damConfig.requireLicense],
    );

    const [generateAltText, { loading: loadingAltText }] = useMutation<GQLGenerateAltTextMutation, GQLGenerateAltTextMutationVariables>(
        generateAltTextMutation,
    );
    const [generateImageTitle, { loading: loadingImageTitle }] = useMutation<GQLGenerateImageTitleMutation, GQLGenerateImageTitleMutationVariables>(
        generateImageTitleMutation,
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
                    endAdornment={`.${file.name.split(".").pop()}`}
                    component={FinalFormInput}
                    validate={async (value, allValues, meta) => {
                        if (value && meta?.dirty) {
                            if (await damIsFilenameOccupied(value)) {
                                return intl.formatMessage({
                                    id: "comet.dam.file.validate.filename.error",
                                    defaultMessage: "Filename already exists",
                                });
                            }
                        }
                    }}
                    onBlur={() => {
                        formApi.blur("name");

                        const filename: string | undefined = formApi.getFieldState("name")?.value;
                        const nameWithoutExtension = filename?.split(".").slice(0, -1).join(".");
                        const extension = file.name.split(".").pop();

                        if (nameWithoutExtension) {
                            // slugify can't happen on format because then it wouldn't be possible
                            // to type spaces and other special characters that are removed by slugify
                            formApi.change("name", slugifyFilename(nameWithoutExtension, extension));
                        }
                    }}
                    format={(value: string) => {
                        const nameWithoutExtension = value.split(".").slice(0, -1).join(".");
                        return nameWithoutExtension;
                    }}
                    parse={(value: string) => {
                        const extension = file.name.split(".").pop();
                        return `${value}.${extension}`;
                    }}
                    fullWidth
                    required
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
                    endAdornment={
                        isImage &&
                        contentGeneration?.generateAltText && (
                            <IconButton
                                color="primary"
                                onClick={async () => {
                                    const { data } = await generateAltText({ variables: { fileId: file.id, language } });
                                    formApi.change("altText", data?.generateAltText);
                                }}
                            >
                                {loadingAltText ? <Loading behavior="fillParent" fontSize="large" /> : <ArtificialIntelligence />}
                            </IconButton>
                        )
                    }
                />
                <Field
                    label={intl.formatMessage({
                        id: "comet.dam.file.title",
                        defaultMessage: "Title",
                    })}
                    name="title"
                    component={FinalFormInput}
                    fullWidth
                    endAdornment={
                        isImage &&
                        contentGeneration?.generateImageTitle && (
                            <IconButton
                                color="primary"
                                onClick={async () => {
                                    const { data } = await generateImageTitle({ variables: { fileId: file.id, language } });
                                    formApi.change("title", data?.generateImageTitle);
                                }}
                            >
                                {loadingImageTitle ? <Loading behavior="fillParent" fontSize="large" /> : <ArtificialIntelligence />}
                            </IconButton>
                        )
                    }
                />
            </FormSection>
            {damConfig.enableLicenseFeature && (
                <FormSection title={<FormattedMessage id="comet.dam.file.licenseInformation" defaultMessage="License information" />}>
                    <Field
                        component={FinalFormSelect}
                        options={licenseTypeArray}
                        getOptionLabel={(option: LicenseType) => licenseTypeLabels[option]}
                        getOptionSelected={(option: LicenseType, selectedOption: LicenseType) => {
                            return option === selectedOption;
                        }}
                        name="license.type"
                        label={<FormattedMessage id="comet.dam.file.type" defaultMessage="Type" />}
                        fullWidth
                        required={damConfig.requireLicense}
                        validate={(value: string) => {
                            if (damConfig.requireLicense && value === "NO_LICENSE") {
                                return <FormattedMessage id="comet.dam.file.error.license.type" defaultMessage="License type is required" />;
                            }
                        }}
                        shouldShowError={() => true}
                    />
                    <Field name="license.type">
                        {({ input: { value: licenseType } }) => {
                            return (
                                <>
                                    <Field
                                        label={<FormattedMessage id="comet.dam.file.licenseDetails" defaultMessage="License details" />}
                                        name="license.details"
                                        component={FinalFormInput}
                                        multiline
                                        minRows={3}
                                        fullWidth
                                        disabled={licenseType === "NO_LICENSE"}
                                        shouldShowError={() => true}
                                    />
                                    <Field
                                        label={<FormattedMessage id="comet.dam.file.creatorOrAuthor" defaultMessage="Creator/Author" />}
                                        name="license.author"
                                        component={FinalFormInput}
                                        fullWidth
                                        disabled={licenseType === "NO_LICENSE"}
                                        shouldShowError={() => true}
                                    />
                                    <FieldContainer
                                        label={<FormattedMessage id="comet.dam.file.licenseDuration" defaultMessage="License duration" />}
                                        fullWidth
                                        disabled={licenseType === "NO_LICENSE"}
                                    >
                                        <DurationFieldWrapper>
                                            <Field
                                                name="license.durationFrom"
                                                placeholder="from"
                                                component={FinalFormDatePicker}
                                                clearable
                                                startAdornment={null}
                                                endAdornment={
                                                    <InputAdornment position="start">
                                                        <Calendar />
                                                    </InputAdornment>
                                                }
                                                validateFields={["license.durationTo"]}
                                                disabled={licenseType === "NO_LICENSE"}
                                                validate={requiredValidator}
                                                shouldShowError={() => true}
                                            />
                                            <Field
                                                name="license.durationTo"
                                                placeholder="to"
                                                component={FinalFormDatePicker}
                                                clearable
                                                startAdornment={null}
                                                endAdornment={
                                                    <InputAdornment position="start">
                                                        <Calendar />
                                                    </InputAdornment>
                                                }
                                                validate={(value: Date | undefined, allValues) => {
                                                    const requiredError = requiredValidator(value, allValues);
                                                    if (requiredError) {
                                                        return requiredError;
                                                    }

                                                    const durationFrom = (allValues as EditFileFormValues).license?.durationFrom;
                                                    if (value && durationFrom && value < durationFrom) {
                                                        return (
                                                            <FormattedMessage
                                                                id="comet.dam.file.error.durationTo"
                                                                defaultMessage="The end date of the license must be after the start date"
                                                            />
                                                        );
                                                    }
                                                }}
                                                disabled={licenseType === "NO_LICENSE"}
                                                shouldShowError={() => true}
                                            />
                                        </DurationFieldWrapper>
                                    </FieldContainer>
                                </>
                            );
                        }}
                    </Field>
                </FormSection>
            )}
        </div>
    );
};

const DurationFieldWrapper = styled("div")`
    display: flex;
`;
