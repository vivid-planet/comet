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
import { FormattedMessage } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { VideoOptionsFields } from "./helpers/VideoOptionsFields";
import { PixelImageBlock } from "./PixelImageBlock";

type State = Omit<YouTubeVideoBlockData, "previewImage"> & { previewImage: BlockState<typeof PixelImageBlock> };

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

    defaultValues: () => ({ showControls: true, previewImage: PixelImageBlock.defaultValues() }),

    category: BlockCategory.Media,

    input2State: (input) => ({ ...input, previewImage: PixelImageBlock.input2State(input.previewImage) }),

    state2Output: (state) => ({ ...state, previewImage: PixelImageBlock.state2Output(state.previewImage) }),

    output2State: async (output, context) => ({ ...output, previewImage: await PixelImageBlock.output2State(output.previewImage, context) }),

    createPreviewState: (state, previewContext) => {
        return {
            ...state,
            autoplay: false,
            previewImage: PixelImageBlock.createPreviewState(state.previewImage, previewContext),
            adminMeta: { route: previewContext.parentUrl },
        };
    },

    definesOwnPadding: true,

    isValid: ({ youtubeIdentifier }) => !youtubeIdentifier || isValidYouTubeIdentifier(youtubeIdentifier),

    AdminComponent: ({ state, updateState }) => {
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <SelectPreviewComponent>
                    <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                        <Field
                            label={
                                <FormattedMessage id="comet.blocks.youTubeVideo.youtubeIdentifier" defaultMessage="YouTube URL or YouTube Video ID" />
                            }
                            validate={validateIdentifier}
                            name="youtubeIdentifier"
                            component={FinalFormInput}
                            fullWidth
                            disableContentTranslation
                        />
                        <VideoOptionsFields />
                    </BlocksFinalForm>
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />}>
                        <PixelImageBlock.AdminComponent
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

    extractTextContents: (state) => {
        const contents = [];

        if (state.previewImage.damFile?.altText) contents.push(state.previewImage.damFile.altText);
        if (state.previewImage.damFile?.title) contents.push(state.previewImage.damFile.title);

        return contents;
    },
};
