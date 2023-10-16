import { Field, FieldContainer, FinalFormInput, FinalFormRadio, FinalFormSwitch } from "@comet/admin";
import { Box, FormControlLabel } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { useAdminComponentPaper } from "./common/AdminComponentPaper";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./types";

type State = YouTubeVideoBlockData;

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

    AdminComponent: ({ state, updateState }) => {
        const intl = useIntl();
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <SelectPreviewComponent>
                    <BlocksFinalForm
                        onSubmit={(newState) => {
                            updateState({ ...state, ...newState });
                        }}
                        initialValues={state}
                    >
                        <Field
                            label={intl.formatMessage({
                                id: "comet.blocks.youTubeVideo.youtubeIdentifier",
                                defaultMessage: "YouTube URL or YouTube Video ID",
                            })}
                            name="youtubeIdentifier"
                            component={FinalFormInput}
                            fullWidth
                        />
                        <FieldContainer label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.aspectRatio", defaultMessage: "Aspect Ratio" })}>
                            <Field name="aspectRatio" type="radio" value="16X9">
                                {(props) => (
                                    <FormControlLabel
                                        label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.aspectRatio.16X9", defaultMessage: "16:9" })}
                                        control={<FinalFormRadio {...props} />}
                                    />
                                )}
                            </Field>
                            <Field name="aspectRatio" type="radio" value="4X3">
                                {(props) => (
                                    <FormControlLabel
                                        label={intl.formatMessage({ id: "comet.blocks.youTubeVideo.aspectRatio.4X3", defaultMessage: "4:3" })}
                                        control={<FinalFormRadio {...props} />}
                                    />
                                )}
                            </Field>
                        </FieldContainer>
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
