import { gql } from "@apollo/client";
import { Field } from "@comet/admin";
import { Crop } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { type PixelImageBlockData, type PixelImageBlockInput } from "../blocks.generated";
import { useCometConfig } from "../config/CometConfigContext";
import { useDamBasePath } from "../dam/config/damConfig";
import { useDamAcceptedMimeTypes } from "../dam/config/useDamAcceptedMimeTypes";
import { FileField } from "../form/file/FileField";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { EditImageDialog } from "./image/EditImageDialog";
import { type GQLImageBlockDamFileQuery, type GQLImageBlockDamFileQueryVariables } from "./PixelImageBlock.generated";
import { BlockCategory, type BlockDependency, type BlockInterface } from "./types";

export type ImageBlockState = Omit<PixelImageBlockData, "urlTemplate">;

function createPreviewUrl(
    { damFile, cropArea }: ImageBlockState,
    { apiUrl, damBasePath, resize }: { apiUrl: string; resize?: { width: number; height: number }; damBasePath: string },
): string {
    if (!damFile || !damFile.image) return "";

    const urlTemplateRoute = `/${damBasePath}/images/preview/$fileId/crop:$crop/resize:$resizeWidth:$resizeHeight/$fileName`;
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

    createPreviewState: (state, previewContext) => ({
        ...state,
        urlTemplate: createPreviewUrl(state, { apiUrl: previewContext.apiUrl, damBasePath: previewContext.damBasePath }),
        adminMeta: { route: previewContext.parentUrl },
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

    output2State: async (output, { apolloClient }): Promise<ImageBlockState> => {
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
        const { apiUrl } = useCometConfig();
        const damBasePath = useDamBasePath();
        const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();

        // useSyncImageAttributes({ state, updateState });

        const handleClose = useCallback(() => {
            setOpen(false);
        }, [setOpen]);

        const handleCropClick = () => {
            setOpen(true);
        };

        const previewUrl = createPreviewUrl(state, { apiUrl, resize: { width: 320, height: 320 }, damBasePath });

        return (
            <SelectPreviewComponent>
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
                        preview={<PreviewImage src={previewUrl} width="70" height="70" />}
                        menuActions={[
                            {
                                label: <FormattedMessage id="comet.blocks.image.cropImage" defaultMessage="Crop image" />,
                                icon: <Crop />,
                                onClick: handleCropClick,
                            },
                        ]}
                    />
                </BlocksFinalForm>
                {open && state.damFile?.image && (
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
            </SelectPreviewComponent>
        );
    },
    previewContent: (state, context) => {
        if (!state.damFile || !state.damFile?.fileUrl || !context?.apiUrl || !context?.damBasePath) {
            return [];
        }
        const imageSize = { width: 320, height: 320 };
        return [
            {
                type: "image",
                content: {
                    src: createPreviewUrl(state, { apiUrl: context.apiUrl, resize: imageSize, damBasePath: context.damBasePath }),
                    ...imageSize,
                },
            },
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

const PreviewImage = styled("img")`
    object-fit: cover;
`;
