import { useMutation, useQuery } from "@apollo/client";
import {
    FinalForm,
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
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { Card, CardContent, CircularProgress, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FORM_ERROR } from "final-form";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import ReactSplit from "react-split";

import { useContentScope } from "../../contentScope/Provider";
import {
    GQLDamFileDetailFragment,
    GQLDamFileDetailQuery,
    GQLDamFileDetailQueryVariables,
    GQLFocalPoint,
    GQLImageCropAreaInput,
    GQLUpdateFileMutation,
    GQLUpdateFileMutationVariables,
} from "../../graphql.generated";
import { usePersistedDamLocation } from "../Table/RedirectToPersistedDamLocation";
import Duplicates from "./Duplicates";
import { damFileDetailQuery, updateDamFileMutation } from "./EditFile.gql";
import { FilePreview } from "./FilePreview";
import { FileSettingsFields } from "./FileSettingsFields";
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

interface EditFileFormValues extends EditImageFormValues {
    name: string;
    altText?: string | null;
    title?: string | null;
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
    const persistedDamLocationApi = usePersistedDamLocation();
    const initialValues = useInitialValues(id);
    const file = initialValues.data?.damFile;

    if (initialValues.loading) {
        return <CircularProgress />;
    } else if (initialValues.error || file === undefined) {
        // otherwise, the user always gets redirected to the broken file and is stuck there
        persistedDamLocationApi?.reset();

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

interface EditFileInnerProps {
    file: GQLDamFileDetailFragment;
    id: string;
}

const EditFileInner = ({ file, id }: EditFileInnerProps) => {
    const intl = useIntl();
    const stackApi = useStackApi();

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
                    },
                },
            });
        },
        [id, updateDamFile],
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
            }}
            initialValuesEqual={(prevValues, newValues) => isEqual(prevValues, newValues)}
            onAfterSubmit={() => {
                // override default onAfterSubmit because default is stackApi.goBack()
                // https://github.com/vivid-planet/comet/blob/master/packages/admin/src/FinalForm.tsx#L53
            }}
        >
            {({ pristine, hasValidationErrors, submitting, handleSubmit }) => (
                <>
                    <Toolbar>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>{file.name}</ToolbarTitleItem>
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
                                {/*<RouterTab*/}
                                {/*    key="dependencies"*/}
                                {/*    label={intl.formatMessage({ id: "comet.dam.file.dependencies", defaultMessage: "Dependencies" })}*/}
                                {/*    path="/dependencies"*/}
                                {/*>*/}
                                {/*    /!*@TODO: Add Dependencies*!/*/}
                                {/*    <div />*/}
                                {/*</RouterTab>*/}
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
