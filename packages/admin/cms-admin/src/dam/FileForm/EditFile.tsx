import { useMutation, useQuery } from "@apollo/client";
import {
    FinalForm,
    Loading,
    LocalErrorScopeApolloContext,
    MainContent,
    messages,
    RouterTab,
    RouterTabs,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { Card, CardContent, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FORM_ERROR } from "final-form";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import ReactSplit from "react-split";

import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/DependenciesConfig";
import { DependencyList } from "../../dependencies/DependencyList";
import { GQLFocalPoint, GQLImageCropAreaInput, GQLLicenseInput } from "../../graphql.generated";
import { useDamConfig } from "../config/useDamConfig";
import { LicenseValidityTags } from "../DataGrid/tags/LicenseValidityTags";
import Duplicates from "./Duplicates";
import { damFileDependentsQuery, damFileDetailQuery, updateDamFileMutation } from "./EditFile.gql";
import {
    GQLDamFileDetailFragment,
    GQLDamFileDetailQuery,
    GQLDamFileDetailQueryVariables,
    GQLUpdateFileMutation,
    GQLUpdateFileMutationVariables,
} from "./EditFile.gql.generated";
import { FilePreview } from "./FilePreview";
import { FileSettingsFields, LicenseType } from "./FileSettingsFields";
import { ImageInfos } from "./ImageInfos";

export interface EditImageFormValues {
    focalPoint: GQLFocalPoint;
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface EditFileFormValues extends EditImageFormValues {
    name: string;
    altText?: string | null;
    title?: string | null;
    license?:
        | Omit<GQLLicenseInput, "type"> & {
              type: LicenseType;
          };
}

interface EditFormProps {
    id: string;
}

const useInitialValues = (id: string) => {
    const { loading, data, error } = useQuery<GQLDamFileDetailQuery, GQLDamFileDetailQueryVariables>(damFileDetailQuery, {
        variables: { id: id },
        skip: !id,
        context: LocalErrorScopeApolloContext,
    });
    return { loading, data, error };
};

const EditFile = ({ id }: EditFormProps): React.ReactElement => {
    const { match: scopeMatch } = useContentScope();
    const initialValues = useInitialValues(id);
    const file = initialValues.data?.damFile;

    if (initialValues.loading) {
        return <Loading behavior="fillPageHeight" />;
    } else if (initialValues.error || file === undefined) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">
                        <FormattedMessage
                            id="comet.dam.file.failedToLoad"
                            defaultMessage="Failed to load file. <link>Go to Assets</link>"
                            values={{
                                link: (chunks: string) => (
                                    <Link to={`${scopeMatch.url}/assets`} component={RouterLink}>
                                        {chunks}
                                    </Link>
                                ),
                            }}
                        />
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return <EditFileInner file={file} id={id} />;
};

export type DamFileDetails = GQLDamFileDetailFragment;

interface EditFileInnerProps {
    file: DamFileDetails;
    id: string;
}

const EditFileInner = ({ file, id }: EditFileInnerProps) => {
    const dependencyMap = useDependenciesConfig();
    const intl = useIntl();
    const stackApi = useStackApi();
    const damConfig = useDamConfig();

    const [updateDamFile, { loading: saving, error: hasSaveErrors }] = useMutation<GQLUpdateFileMutation, GQLUpdateFileMutationVariables>(
        updateDamFileMutation,
    );

    const onSubmit = React.useCallback(
        (values: EditFileFormValues) => {
            let cropArea: GQLImageCropAreaInput;

            if (values.focalPoint === "SMART") {
                cropArea = {
                    focalPoint: "SMART",
                    x: null,
                    y: null,
                    width: null,
                    height: null,
                };
            } else {
                cropArea = {
                    focalPoint: values.focalPoint,
                    x: values.crop.x,
                    y: values.crop.y,
                    width: values.crop.width ? Math.ceil(values.crop.width) : undefined,
                    height: values.crop.height ? Math.ceil(values.crop.height) : undefined,
                };
            }

            return updateDamFile({
                variables: {
                    id,
                    input: {
                        name: values.name,
                        title: values.title,
                        altText: values.altText,
                        image: {
                            cropArea,
                        },
                        license: values.license?.type === "NO_LICENSE" ? null : { ...values.license, type: values.license?.type },
                        folderId: file.folder?.id ?? null,
                    },
                },
            });
        },
        [file.folder?.id, id, updateDamFile],
    );

    const initialBlockListWidth = 100 / 3;
    const initialPreviewWidth = 100 - initialBlockListWidth;

    return (
        <FinalForm<EditFileFormValues>
            mode="edit"
            onSubmit={onSubmit}
            initialValues={{
                name: file.name,
                focalPoint: file.image?.cropArea.focalPoint ?? "SMART",
                crop: {
                    width: file.image?.cropArea.width ?? 100,
                    height: file.image?.cropArea.height ?? 100,
                    x: file.image?.cropArea.x ?? 0,
                    y: file.image?.cropArea.y ?? 0,
                },
                altText: file.altText,
                title: file.title,
                license: {
                    type: file.license?.type ?? "NO_LICENSE",
                    details: file.license?.details,
                    author: file.license?.author,
                    durationFrom: file.license?.durationFrom ? Date.parse(file.license?.durationFrom) : undefined,
                    durationTo: file.license?.durationTo ? Date.parse(file.license?.durationTo) : undefined,
                },
            }}
            initialValuesEqual={(prevValues, newValues) => isEqual(prevValues, newValues)}
        >
            {({ pristine, hasValidationErrors, submitting, handleSubmit }) => (
                <>
                    <Toolbar>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>{file.name}</ToolbarTitleItem>
                        {damConfig.enableLicenseFeature &&
                            (file.license?.isNotValidYet || file.license?.expiresWithinThirtyDays || file.license?.hasExpired) && (
                                <ToolbarItem>
                                    <LicenseValidityTags
                                        expirationDate={file.license?.expirationDate ? new Date(file.license.expirationDate) : undefined}
                                        isNotValidYet={file.license?.isNotValidYet}
                                        expiresWithinThirtyDays={file.license?.expiresWithinThirtyDays}
                                        hasExpired={file.license?.hasExpired}
                                    />
                                </ToolbarItem>
                            )}
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="editFileSave">
                                <SaveButton
                                    color="primary"
                                    variant="contained"
                                    saving={saving}
                                    hasErrors={hasSaveErrors != null}
                                    type="button"
                                    onClick={async () => {
                                        await handleSubmit();
                                    }}
                                >
                                    <FormattedMessage {...messages.save} />
                                </SaveButton>
                                <SaveButton
                                    color="primary"
                                    variant="contained"
                                    saving={saving}
                                    hasErrors={hasSaveErrors != null}
                                    onClick={async () => {
                                        const submitResult = await handleSubmit();
                                        const error = submitResult?.[FORM_ERROR];
                                        if (!error) {
                                            stackApi?.goBack();
                                        }
                                    }}
                                >
                                    <FormattedMessage {...messages.saveAndGoBack} />
                                </SaveButton>
                            </SplitButton>
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <ReactSplit sizes={[initialPreviewWidth, initialBlockListWidth]} minSize={360} gutterSize={40} style={{ display: "flex" }}>
                            <StickyScrollWrapper>
                                <FilePreview file={file} />
                            </StickyScrollWrapper>
                            <RouterTabs>
                                <RouterTab
                                    key="settings"
                                    label={intl.formatMessage({ id: "comet.dam.file.settings", defaultMessage: "Settings" })}
                                    path=""
                                >
                                    <FileSettingsFields isImage={!!file.image} folderId={file.folder?.id || null} />
                                </RouterTab>
                                {file.image !== null && (
                                    <RouterTab
                                        key="infos"
                                        label={intl.formatMessage({ id: "comet.dam.file.infos", defaultMessage: "Infos" })}
                                        path="/infos"
                                    >
                                        <ImageInfos
                                            imageInfos={{
                                                width: file.image.width,
                                                height: file.image.height,
                                                fileSize: file.size,
                                                fileFormat: file.name.split(".").pop() as string,
                                                exif: file.image.exif,
                                            }}
                                        />
                                    </RouterTab>
                                )}
                                <RouterTab
                                    key="duplicates"
                                    label={intl.formatMessage({ id: "comet.dam.file.duplicates.tabTitle", defaultMessage: "Duplicates" })}
                                    path="/duplicates"
                                >
                                    <Duplicates fileId={file.id} />
                                </RouterTab>
                                {Object.keys(dependencyMap).length > 0 && (
                                    <RouterTab
                                        key="dependents"
                                        label={intl.formatMessage({ id: "comet.dam.file.dependents", defaultMessage: "Dependents" })}
                                        path="/dependents"
                                    >
                                        <DependencyList
                                            query={damFileDependentsQuery}
                                            variables={{
                                                id: id,
                                            }}
                                        />
                                    </RouterTab>
                                )}
                            </RouterTabs>
                        </ReactSplit>
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
};

const FullHeightWrapper = styled("div")`
    height: 100%;
`;

const StickyWrapper = styled("div")`
    position: sticky;
    top: 140px;
`;

const StickyScrollWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    return (
        <div>
            <FullHeightWrapper>
                <StickyWrapper>{children}</StickyWrapper>
            </FullHeightWrapper>
        </div>
    );
};

export default EditFile;
