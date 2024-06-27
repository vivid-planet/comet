import { Field, FinalFormInput } from "@comet/admin";
import {
    BlockCategory,
    BlockInterface,
    BlocksFinalForm,
    createBlockSkeleton,
    createCompositeBlock,
    SelectPreviewComponent,
    useAdminComponentPaper,
} from "@comet/blocks-admin";
import { Box } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { DamImageBlock } from "../dam/blocks/DamImageBlock";
import { VideoOptionsFields } from "./VideoOptionsFields";

type State = Omit<YouTubeVideoBlockData, "previewImage">;

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

const BaseYouTubeVideoBlock: BlockInterface<Omit<YouTubeVideoBlockData, "previewImage">, State, Omit<YouTubeVideoBlockInput, "previewImage">> = {
    ...createBlockSkeleton(),

    name: "YouTubeVideo",

    displayName: <FormattedMessage id="comet.blocks.youTubeVideo" defaultMessage="Video (YouTube)" />,

    defaultValues: () => ({ youtubeIdentifier: "", showControls: true }),

    category: BlockCategory.Media,

    createPreviewState: (state, previewCtx) => {
        return { ...state, autoplay: false, adminMeta: { route: previewCtx.parentUrl } };
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
                </SelectPreviewComponent>
            </Box>
        );
    },

    previewContent: (state) => [{ type: "text", content: state.youtubeIdentifier }],
};

// TODO: how can i add the previewImage block to block above without wrapping it in a composite block?
export const YouTubeVideoBlock = createCompositeBlock(
    {
        name: "YouTubeVideo",
        displayName: <FormattedMessage id="comet.blocks.youTubeVideo" defaultMessage="Video (YouTube)" />,
        blocks: {
            video: {
                block: BaseYouTubeVideoBlock,
            },
            previewImage: {
                block: DamImageBlock,
                title: <FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        block.previewContent = (state) => [{ type: "text", content: state.video.youtubeIdentifier }];
        return block;
    },
);
