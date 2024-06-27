import { Field, FieldContainer, FinalFormInput, FinalFormRadio, FinalFormSwitch } from "@comet/admin";
import { Box, FormControlLabel } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { VimeoVideoBlockData, VimeoVideoBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { useAdminComponentPaper } from "./common/AdminComponentPaper";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./types";

const isValidVimeoIdentifier = (value: string) => {
    const urlRegEx = /^(https?:\/\/)?((www\.|player\.)?vimeo\.com\/?(showcase\/)*([0-9a-z]*\/)*([0-9]{6,11})[?]?.*)$/;
    const idRegEx = /^([0-9]{6,11})$/;

    const urlMatch = urlRegEx.test(value);
    const idMatch = idRegEx.test(value);

    return urlMatch || idMatch;
};

const validateIdentifier = (value?: string) => {
    if (!value) return undefined;

    return value && isValidVimeoIdentifier(value) ? undefined : (
        <FormattedMessage id="comet.blocks.vimeoVideo.validation" defaultMessage="Should be a valid Vimeo URL or identifier" />
    );
};

export const VimeoVideoBlock: BlockInterface<VimeoVideoBlockData, VimeoVideoBlockData, VimeoVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "VimeoVideo",

    displayName: <FormattedMessage id="blocks.vimeoVideo" defaultMessage="Video (Vimeo)" />,

    defaultValues: () => ({ vimeoIdentifier: "", autoplay: false, showControls: true, loop: false, aspectRatio: "16X9" }),

    category: BlockCategory.Media,

    // !vimeoIdentifier to allow saving empty string
    isValid: ({ vimeoIdentifier }) => !vimeoIdentifier || isValidVimeoIdentifier(vimeoIdentifier),

    createPreviewState: (state, previewCtx) => {
        return { ...state, autoplay: false, adminMeta: { route: previewCtx.parentUrl } };
    },
    definesOwnPadding: true,
    AdminComponent: ({ state, updateState }) => {
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <SelectPreviewComponent>
                    <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                        <Field
                            name="vimeoIdentifier"
                            label={<FormattedMessage id="blocks.vimeoVideo.vimeoIdentifier" defaultMessage="Vimeo URL or Vimeo Video ID" />}
                            validate={validateIdentifier}
                            type="text"
                            component={FinalFormInput}
                            fullWidth
                            disableContentTranslation
                        />
                        <FieldContainer label={<FormattedMessage id="comet.blocks.vimeoVideo.aspectRatio" defaultMessage="Aspect Ratio" />}>
                            <Field name="aspectRatio" type="radio" value="16X9">
                                {(props) => (
                                    <FormControlLabel
                                        label={<FormattedMessage id="comet.blocks.vimeoVideo.aspectRatio.16X9" defaultMessage="16:9" />}
                                        control={<FinalFormRadio {...props} />}
                                    />
                                )}
                            </Field>
                            <Field name="aspectRatio" type="radio" value="4X3">
                                {(props) => (
                                    <FormControlLabel
                                        label={<FormattedMessage id="comet.blocks.vimeoVideo.aspectRatio.4X3" defaultMessage="4:3" />}
                                        control={<FinalFormRadio {...props} />}
                                    />
                                )}
                            </Field>
                        </FieldContainer>
                        <Field
                            label={<FormattedMessage id="blocks.vimeoVideo.autoplay" defaultMessage="Autoplay" />}
                            name="autoplay"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                        <Field
                            label={<FormattedMessage id="blocks.vimeoVideo.showControls" defaultMessage="Show controls" />}
                            name="showControls"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                        <Field
                            label={<FormattedMessage id="blocks.vimeoVideo.loop" defaultMessage="Loop" />}
                            name="loop"
                            type="checkbox"
                            component={FinalFormSwitch}
                        />
                    </BlocksFinalForm>
                </SelectPreviewComponent>
            </Box>
        );
    },
    previewContent: (state) => {
        return state.vimeoIdentifier ? [{ type: "text", content: state.vimeoIdentifier }] : [];
    },
};
