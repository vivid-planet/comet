import { gql, useApolloClient } from "@apollo/client";
import { Field } from "@comet/admin";
import { Crop, Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { ButtonBase, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { type PixelImageBlockData, type PixelImageBlockInput } from "../blocks.generated";
import { useCometConfig } from "../config/CometConfigContext";
import { useContentScope } from "../contentScope/Provider";
import { useDamAcceptedMimeTypes } from "../dam/config/useDamAcceptedMimeTypes";
import { useDependenciesConfig } from "../dependencies/dependenciesConfig";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField } from "../form/file/FileField";
import { type CmsBlockContext } from "./CmsBlockContextProvider";
import { BlockAdminComponentButton } from "./common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "./common/BlockAdminComponentPaper";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { EditImageDialog } from "./image/EditImageDialog";
import { type GQLImageBlockDamFileQuery, type GQLImageBlockDamFileQueryVariables } from "./PixelImageBlock.generated";
import { BlockCategory, type BlockDependency, type BlockInterface, type BlockPreviewContext } from "./types";

export type ImageBlockState = Omit<PixelImageBlockData, "urlTemplate">;

const urlTemplateRoute = "/dam/images/preview/$fileId/crop:$crop/resize:$resizeWidth:$resizeHeight/$fileName";
function createPreviewUrl({ damFile, cropArea }: ImageBlockState, apiUrl: string, resize?: { width: number; height: number }): string {
    if (!damFile || !damFile.image) return "";

    const imageCropArea = cropArea ? cropArea : damFile.image.cropArea;
    const crop =
        imageCropArea.focalPoint === "SMART"
            ? [imageCropArea.focalPoint]
            : [imageCropArea.width, imageCropArea.height, imageCropArea.focalPoint, imageCropArea.x, imageCropArea.y];

    const filenameContainsExtension = damFile.name.lastIndexOf(".") >= 0;
    const filename = filenameContainsExtension ? damFile.name.substr(0, damFile.name.lastIndexOf(".")) : damFile.name;

    let urlTemplate = apiUrl + urlTemplateRoute;
    if (resize) {
        urlTemplate = urlTemplate.replace("$resizeWidth", String(resize.width)).replace("$resizeHeight", String(resize.height));
    }

    const url = new URL(urlTemplate.replace("$fileId", damFile.id).replace("$crop", crop.join(":")).replace("$fileName", filename));
    return url.toString();
}

export const PixelImageBlock: BlockInterface<PixelImageBlockData, ImageBlockState, PixelImageBlockInput> = {
    ...createBlockSkeleton(),

    name: "Image",

    displayName: <FormattedMessage id="comet.blocks.image" defaultMessage="Image" />,

    defaultValues: () => ({
        file: undefined,
        cropArea: undefined,
    }),

    category: BlockCategory.Media,

    createPreviewState: (state, previewCtx: BlockPreviewContext & CmsBlockContext) => ({
        ...state,
        urlTemplate: createPreviewUrl(state, previewCtx.apiUrl),
        adminMeta: { route: previewCtx.parentUrl },
    }),

    state2Output: (v) => {
        if (!v.damFile) {
            return {};
        }

        return {
            damFileId: v.damFile.id,
            cropArea: v.cropArea,
        };
    },

    output2State: async (output, { apolloClient }: CmsBlockContext): Promise<ImageBlockState> => {
        if (!output.damFileId) {
            return {};
        }

        const { data } = await apolloClient.query<GQLImageBlockDamFileQuery, GQLImageBlockDamFileQueryVariables>({
            query: gql`
                query ImageBlockDamFile($id: ID!) {
                    damFile(id: $id) {
                        id
                        name
                        size
                        mimetype
                        contentHash
                        title
                        altText
                        archived
                        image {
                            width
                            height
                            cropArea {
                                focalPoint
                                width
                                height
                                x
                                y
                            }
                        }
                        fileUrl
                    }
                }
            `,
            variables: { id: output.damFileId },
        });

        // TODO consider throwing an error
        // TODO fix typing: generated GraphQL files use null, we use undefined, e.g. title: string | null vs title?: string
        const damFile = data.damFile as unknown as PixelImageBlockData["damFile"];

        return { damFile, cropArea: output.cropArea };
    },

    dependencies: (state) => {
        const dependencies: BlockDependency[] = [];

        if (state.damFile?.id) {
            dependencies.push({
                targetGraphqlObjectType: "DamFile",
                id: state.damFile.id,
                data: {
                    damFile: state.damFile,
                },
            });
        }

        return dependencies;
    },

    replaceDependenciesInOutput: (output, replacements) => {
        const clonedOutput: PixelImageBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const [open, setOpen] = useState(false);
        const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
        const { apiUrl } = useCometConfig();
        const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();
        const contentScope = useContentScope();
        const apolloClient = useApolloClient();
        const { entityDependencyMap } = useDependenciesConfig();

        // useSyncImageAttributes({ state, updateState });

        const handleClose = useCallback(() => {
            setOpen(false);
        }, [setOpen]);

        const handleCropClick = () => {
            setOpen(true);

            handleMenuClose();
        };

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        const previewUrl = createPreviewUrl(state, apiUrl, { width: 320, height: 320 });

        return (
            <SelectPreviewComponent>
                {state.damFile?.image ? (
                    <>
                        <BlockAdminComponentPaper disablePadding>
                            <ContentRoot component="div" onClick={() => setOpen(true)}>
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid item>{previewUrl && <PreviewImage src={previewUrl} width="70" height="70" />}</Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1">{state.damFile.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <DamPathLazy fileId={state.damFile.id} />
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            onMouseDown={(event) => event.stopPropagation()}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setAnchorEl(event.currentTarget);
                                            }}
                                            size="large"
                                        >
                                            <MoreVertical />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ContentRoot>
                            <Divider />
                            <BlockAdminComponentButton
                                startIcon={<Delete />}
                                onClick={() => updateState({ damFile: undefined, cropArea: undefined })}
                            >
                                <FormattedMessage id="comet.blocks.image.empty" defaultMessage="Empty" />
                            </BlockAdminComponentButton>
                        </BlockAdminComponentPaper>
                        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleCropClick}>
                                <ListItemIcon>
                                    <Crop />
                                </ListItemIcon>
                                <FormattedMessage id="comet.blocks.image.cropImage" defaultMessage="Crop image" />
                            </MenuItem>
                            {entityDependencyMap["DamFile"] && state.damFile?.id && (
                                <MenuItem
                                    onClick={async () => {
                                        // id is checked three lines above
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        const path = await entityDependencyMap["DamFile"].resolvePath({ apolloClient, id: state.damFile!.id });
                                        const url = contentScope.match.url + path;
                                        window.open(url, "_blank");
                                    }}
                                >
                                    <ListItemIcon>
                                        <OpenNewTab />
                                    </ListItemIcon>
                                    <FormattedMessage id="comet.blocks.image.openInDam" defaultMessage="Open in DAM" />
                                </MenuItem>
                            )}
                        </Menu>
                        {open && (
                            <EditImageDialog
                                image={{
                                    name: state.damFile.name,
                                    url: state.damFile.fileUrl,
                                    width: state.damFile.image.width,
                                    height: state.damFile.image.height,
                                    size: state.damFile.size,
                                }}
                                damFileId={state.damFile.id}
                                initialValues={{
                                    useInheritedDamSettings: state.cropArea === undefined,
                                    cropArea: state.cropArea ?? state.damFile.image.cropArea,
                                }}
                                inheritedDamSettings={{ cropArea: state.damFile.image.cropArea }}
                                onSubmit={(cropArea) => {
                                    updateState((prevState) => ({ ...prevState, cropArea }));
                                    setOpen(false);
                                }}
                                onClose={handleClose}
                            />
                        )}
                    </>
                ) : (
                    <BlocksFinalForm<{ damFile?: ImageBlockState["damFile"] }>
                        onSubmit={(newValues) => {
                            updateState((prevState) => ({ ...prevState, damFile: newValues.damFile || undefined, cropArea: undefined })); // reset local crop area when image changes
                        }}
                        initialValues={{ damFile: state.damFile }}
                    >
                        <Field
                            name="damFile"
                            component={FileField}
                            fullWidth
                            buttonText={<FormattedMessage id="comet.blocks.image.chooseImage" defaultMessage="Choose image" />}
                            allowedMimetypes={filteredAcceptedMimeTypes.pixelImage}
                        />
                    </BlocksFinalForm>
                )}
            </SelectPreviewComponent>
        );
    },
    previewContent: (state, ctx) => {
        if (!state.damFile || !state.damFile?.fileUrl || !ctx?.damConfig?.apiUrl) {
            return [];
        }
        const imageSize = { width: 320, height: 320 };
        return [
            { type: "image", content: { src: createPreviewUrl(state, ctx.damConfig.apiUrl, imageSize), ...imageSize } },
            { type: "text", content: state.damFile.name },
        ];
    },

    extractTextContents: (state) => {
        const contents = [];

        if (state.damFile?.altText) contents.push(state.damFile.altText);
        if (state.damFile?.title) contents.push(state.damFile.title);

        return contents;
    },
};

const ContentRoot = styled(ButtonBase)`
    padding: ${({ theme }) => theme.spacing(3)};
    width: 100%;
    text-align: left;
` as typeof ButtonBase;

const PreviewImage = styled("img")`
    object-fit: cover;
`;
