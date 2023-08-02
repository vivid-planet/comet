import { Field, FieldContainer, FinalFormInput, FinalFormRadio, FinalFormSwitch } from "@comet/admin";
import { FormControlLabel } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { YouTubeVideoBlockData, YouTubeVideoBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./types";

type State = YouTubeVideoBlockData;

const EXPECTED_YT_ID_LENGTH = 11;

const isYtUrl = (value: string) => {
    // regex from https://stackoverflow.com/a/27728417
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const match = value.match(regExp);
    return !!match && match[1].length == EXPECTED_YT_ID_LENGTH;
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

    isValid: (state) => isYtUrl(state.youtubeIdentifier),

    AdminComponent: ({ state, updateState }) => {
        const intl = useIntl();

        const shouldBeYtUrl = () => (value: string) => {
            return isYtUrl(value) ? undefined : `Should be a valid YouTube URL`;
        };

        return (
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
                        validate={shouldBeYtUrl()}
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
        );
    },

    previewContent: (state) => [{ type: "text", content: state.youtubeIdentifier }],
};
