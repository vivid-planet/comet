import { useApolloClient, useQuery } from "@apollo/client";
import {
    FinalForm,
    FinalFormSaveButton,
    Loading,
    LocalErrorScopeApolloContext,
    MainContent,
    RouterTab,
    RouterTabs,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
} from "@comet/admin";
import { Card, CardContent, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import ReactSplit from "react-split";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/DependenciesConfig";
import { DependencyList } from "../../dependencies/DependencyList";
import { GQLFocalPoint, GQLImageCropAreaInput, GQLLicenseInput } from "../../graphql.generated";
import { useDamConfig } from "../config/useDamConfig";
import { useDamScope } from "../config/useDamScope";
import { LicenseValidityTags } from "../DataGrid/tags/LicenseValidityTags";
import Duplicates from "./Duplicates";
import { damFileDependentsQuery, damFileDetailQuery, updateDamFileMutation } from "./EditFile.gql";
import { GQLDamFileDetailFragment, GQLDamFileDetailQuery, GQLDamFileDetailQueryVariables } from "./EditFile.gql.generated";
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
    const damConfig = useDamConfig();
    const scope = useDamScope();
    const apolloClient = useApolloClient();

    const onSubmit = React.useCallback(
        async (values: EditFileFormValues) => {
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

            await apolloClient.mutate({
                mutation: updateDamFileMutation,
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
        [apolloClient, file.folder?.id, id],
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
            {() => (
                <>
                    <Toolbar scopeIndicator={<ContentScopeIndicator scope={scope} />}>
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
                            <FinalFormSaveButton />
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
                                    <FileSettingsFields file={file} />
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
