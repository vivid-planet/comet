import { Field, FinalFormInput } from "@comet/admin";
import {
    AdminComponentSection,
    BlockCategory,
    BlockInterface,
    BlocksFinalForm,
    BlockState,
    createBlockSkeleton,
    resolveNewState,
    SelectPreviewComponent,
    useAdminComponentPaper,
} from "@comet/blocks-admin";
import { Box } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { DamImageBlock } from "../dam/blocks/DamImageBlock";
import { VideoOptionsFields } from "./VideoOptionsFields";

type State = Omit<YouTubeVideoBlockData, "previewImage"> & { previewImage: BlockState<typeof DamImageBlock> };

const EXPECTED_YT_ID_LENGTH = 11;

const isValidYouTubeIdentifier = (value: string) => {
    // regex from https://stackoverflow.com/a/51870158
    const regExp =
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
    const match = value.match(regExp);
    return value.length === EXPECTED_YT_ID_LENGTH || (!!match && match[8].length == EXPECTED_YT_ID_LENGTH);
};

const validateIdentifier = (value?: string) => {
    if (!value) return undefined;

    return value && isValidYouTubeIdentifier(value) ? undefined : (
        <FormattedMessage id="comet.blocks.youTubeVideo.validation" defaultMessage="Should be a valid YouTube URL or identifier" />
    );
};

export const YouTubeVideoBlock: BlockInterface<YouTubeVideoBlockData, State, YouTubeVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "YouTubeVideo",

    displayName: <FormattedMessage id="comet.blocks.youTubeVideo" defaultMessage="Video (YouTube)" />,

    defaultValues: () => ({ showControls: true, previewImage: DamImageBlock.defaultValues() }),

    category: BlockCategory.Media,

    input2State: (input) => ({ ...input, previewImage: DamImageBlock.input2State(input.previewImage) }),

    state2Output: (state) => ({ ...state, previewImage: DamImageBlock.state2Output(state.previewImage) }),

    // @ts-expect-error attachedBlocks missing in generated type for OneOfBlockInput
    output2State: async (output, context) => ({ ...output, previewImage: await DamImageBlock.output2State(output.previewImage, context) }),

    // @ts-expect-error type mismatch between generated types and OneOfBlockPreviewState
    createPreviewState: (state, previewContext) => {
        return {
            ...state,
            autoplay: false,
            previewImage: DamImageBlock.createPreviewState(state.previewImage, previewContext),
            adminMeta: { route: previewContext.parentUrl },
        };
    },

    definesOwnPadding: true,

    isValid: ({ youtubeIdentifier }) => !youtubeIdentifier || isValidYouTubeIdentifier(youtubeIdentifier),

    AdminComponent: ({ state, updateState }) => {
        const intl = useIntl();
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <SelectPreviewComponent>
                    <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                        <Field
                            label={intl.formatMessage({
                                id: "comet.blocks.youTubeVideo.youtubeIdentifier",
                                defaultMessage: "YouTube URL or YouTube Video ID",
                            })}
                            validate={validateIdentifier}
                            name="youtubeIdentifier"
                            component={FinalFormInput}
                            fullWidth
                            disableContentTranslation
                        />
                        <VideoOptionsFields />
                    </BlocksFinalForm>
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />}>
                        <DamImageBlock.AdminComponent
                            state={state.previewImage}
                            updateState={(setStateAction) => {
                                updateState({ ...state, previewImage: resolveNewState({ prevState: state.previewImage, setStateAction }) });
                            }}
                        />
                    </AdminComponentSection>
                </SelectPreviewComponent>
            </Box>
        );
    },

    previewContent: (state) => [{ type: "text", content: state.youtubeIdentifier }],
};
