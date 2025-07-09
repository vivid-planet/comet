import { gql } from "@apollo/client";
import { Field } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, IPreviewContext, SelectPreviewComponent } from "@comet/blocks-admin";
import { BlockDependency } from "@comet/blocks-admin/lib/blocks/types";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { FormattedMessage } from "react-intl";

import { SvgImageBlockData, SvgImageBlockInput } from "../blocks.generated";
import { useDamAcceptedMimeTypes } from "../dam/config/useDamAcceptedMimeTypes";
import { FileField } from "../form/file/FileField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLSvgImageBlockDamFileQuery, GQLSvgImageBlockDamFileQueryVariables } from "./SvgImageBlock.generated";
import { useCmsBlockContext } from "./useCmsBlockContext";

export type SvgImageBlockState = Omit<SvgImageBlockData, "urlTemplate">;

export function createPreviewUrl({ damFile }: SvgImageBlockState, apiUrl: string): string {
    if (!damFile) return "";
    return new URL(
        `${apiUrl}/dam/files/preview/$fileId/$fileName`
            .replace("$fileId", damFile.id)
            .replace("$fileName", damFile.name.substr(0, damFile.name.lastIndexOf("."))),
    ).toString();
}

export const SvgImageBlock: BlockInterface<SvgImageBlockData, SvgImageBlockState, SvgImageBlockInput> = {
    ...createBlockSkeleton(),

    name: "SVG",

    displayName: <FormattedMessage id="comet.blocks.svgImage" defaultMessage="SVG" />,

    defaultValues: () => ({}),

    category: BlockCategory.Media,

    createPreviewState: (state, previewCtx: IPreviewContext & CmsBlockContext) => ({
        ...state,
        urlTemplate: createPreviewUrl(state, previewCtx.damConfig.apiUrl),
        adminMeta: { route: previewCtx.parentUrl },
    }),

    state2Output: (v) => {
        if (!v.damFile) {
            return {};
        }
        return {
            damFileId: v.damFile.id,
        };
    },

    output2State: async (output, { apolloClient }: CmsBlockContext): Promise<SvgImageBlockState> => {
        if (!output.damFileId) {
            return {};
        }

        const { data } = await apolloClient.query<GQLSvgImageBlockDamFileQuery, GQLSvgImageBlockDamFileQueryVariables>({
            query: gql`
                query SvgImageBlockDamFile($id: ID!) {
                    damFile(id: $id) {
                        id
                        name
                        size
                        mimetype
                        contentHash
                        title
                        altText
                        archived
                        fileUrl
                    }
                }
            `,
            variables: { id: output.damFileId },
        });

        // TODO consider throwing an error
        // TODO fix typing: generated GraphQL files use null, we use undefined, e.g. title: string | null vs title?: string
        const damFile = data.damFile as unknown as SvgImageBlockData["damFile"];

        return { damFile };
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
        const clonedOutput: SvgImageBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const context = useCmsBlockContext();
        const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();

        const previewUrl = createPreviewUrl(state, context.damConfig.apiUrl);

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<{ damFile?: SvgImageBlockState["damFile"] }>
                    onSubmit={(newValues) => {
                        updateState((prevState) => ({ ...prevState, damFile: newValues.damFile || undefined }));
                    }}
                    initialValues={{ damFile: state.damFile }}
                >
                    <Field
                        name="damFile"
                        component={FileField}
                        fullWidth
                        buttonText={<FormattedMessage id="comet.blocks.image.chooseImage" defaultMessage="Choose image" />}
                        allowedMimetypes={filteredAcceptedMimeTypes.svgImage}
                        preview={<img src={previewUrl} width="70" height="70" />}
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
    previewContent: (state, ctx) => {
        if (!state.damFile || !state.damFile?.fileUrl || !ctx?.damConfig?.apiUrl) {
            return [];
        }
        return [
            { type: "image", content: { src: createPreviewUrl(state, ctx.damConfig.apiUrl), width: 320, height: 320 } },
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
