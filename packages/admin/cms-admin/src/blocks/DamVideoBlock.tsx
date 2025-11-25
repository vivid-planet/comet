import { gql } from "@apollo/client";
import { Field } from "@comet/admin";
import { Video } from "@comet/admin-icons";
import { Box } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { defineMessage, FormattedMessage } from "react-intl";

import { type DamVideoBlockData, type DamVideoBlockInput } from "../blocks.generated";
import { FileField } from "../form/file/FileField";
import { useBlockAdminComponentPaper } from "./common/BlockAdminComponentPaper";
import { BlockAdminComponentSection } from "./common/BlockAdminComponentSection";
import { type GQLVideoBlockDamFileQuery, type GQLVideoBlockDamFileQueryVariables } from "./DamVideoBlock.generated";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { VideoOptionsFields } from "./helpers/VideoOptionsFields";
import { PixelImageBlock } from "./PixelImageBlock";
import { BlockCategory, type BlockDependency, type BlockInterface, type BlockState } from "./types";
import { resolveNewState } from "./utils";

type State = Omit<DamVideoBlockData, "previewImage"> & { previewImage: BlockState<typeof PixelImageBlock> };

export const DamVideoBlock: BlockInterface<DamVideoBlockData, State, DamVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({ showControls: true, previewImage: PixelImageBlock.defaultValues() }),

    category: BlockCategory.Media,

    input2State: (input) => ({ ...input, previewImage: PixelImageBlock.input2State(input.previewImage) }),

    state2Output: (state) => ({
        damFileId: state.damFile?.id,
        previewImage: PixelImageBlock.state2Output(state.previewImage),
        autoplay: state.autoplay,
        loop: state.loop,
        showControls: state.showControls,
    }),

    output2State: async (output, context) => {
        if (!output.damFileId) {
            return { previewImage: await PixelImageBlock.output2State(output.previewImage, context) };
        }

        const { data } = await context.apolloClient.query<GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables>({
            query: gql`
                query VideoBlockDamFile($id: ID!) {
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
        const damFile = data.damFile as unknown as DamVideoBlockData["damFile"];

        return {
            damFile,
            autoplay: output.autoplay,
            loop: output.loop,
            showControls: output.showControls,
            previewImage: await PixelImageBlock.output2State(output.previewImage, context),
        };
    },

    createPreviewState: (state, previewContext) => ({
        ...state,
        autoplay: false,
        loop: false,
        previewImage: PixelImageBlock.createPreviewState(state.previewImage, previewContext),
        adminMeta: { route: previewContext.parentUrl },
    }),

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
        const clonedOutput: DamVideoBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const isInPaper = useBlockAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                    <Field
                        name="damFile"
                        component={FileField}
                        fullWidth
                        allowedMimetypes={["video/mp4", "video/webm"]}
                        preview={<Video fontSize="large" color="primary" />}
                    />
                    <VideoOptionsFields />
                    <BlockAdminComponentSection title={<FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />}>
                        <PixelImageBlock.AdminComponent
                            state={state.previewImage}
                            updateState={(setStateAction) => {
                                updateState({ ...state, previewImage: resolveNewState({ prevState: state.previewImage, setStateAction }) });
                            }}
                        />
                    </BlockAdminComponentSection>
                </BlocksFinalForm>
            </Box>
        );
    },

    previewContent: (state) => (state.damFile ? [{ type: "text", content: state.damFile.name }] : []),

    extractTextContents: (state) => {
        const contents = [];

        if (state.damFile?.altText) contents.push(state.damFile.altText);
        if (state.damFile?.title) contents.push(state.damFile.title);

        return contents;
    },
    tags: [defineMessage({ id: "damVideoBlock.tag.video", defaultMessage: "Video" })],
};
