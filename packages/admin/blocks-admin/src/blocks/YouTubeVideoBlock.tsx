import { Field, FinalFormInput, FinalFormSwitch } from "@comet/admin";
import { Box } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { useAdminComponentPaper } from "./common/AdminComponentPaper";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./types";

type State = YouTubeVideoBlockData;

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

    defaultValues: () => ({ youtubeIdentifier: "", autoplay: false, showControls: false, loop: false, aspectRatio: "16X9" }),

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
                    <BlocksFinalForm
                        onSubmit={(newState) => {
                            updateState(newState);
                        }}
                        initialValues={state}
                    >
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
                        <Field
                            label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.autoplay", defaultMessage: "Autoplay" })}
                            name="autoplay"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                        <Field
                            label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.showControls", defaultMessage: "Show controls" })}
                            name="showControls"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                        <Field
                            label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.loop", defaultMessage: "Loop" })}
                            name="loop"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                    </BlocksFinalForm>
                </SelectPreviewComponent>
            </Box>
        );
    },

    previewContent: (state) => [{ type: "text", content: state.youtubeIdentifier }],
};
