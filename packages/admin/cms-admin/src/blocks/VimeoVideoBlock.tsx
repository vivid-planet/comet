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

import { VimeoVideoBlockData, VimeoVideoBlockInput } from "../blocks.generated";
import { VideoOptionsFields } from "./helpers/VideoOptionsFields";
import { PixelImageBlock } from "./PixelImageBlock";

type State = Omit<VimeoVideoBlockData, "previewImage"> & { previewImage: BlockState<typeof PixelImageBlock> };

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

export const VimeoVideoBlock: BlockInterface<VimeoVideoBlockData, State, VimeoVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "VimeoVideo",

    displayName: <FormattedMessage id="comet.blocks.vimeoVideo" defaultMessage="Video (Vimeo)" />,

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

    isValid: ({ vimeoIdentifier }) => !vimeoIdentifier || isValidVimeoIdentifier(vimeoIdentifier),

    AdminComponent: ({ state, updateState }) => {
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <SelectPreviewComponent>
                    <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                        <Field
                            name="vimeoIdentifier"
                            label={<FormattedMessage id="comet.blocks.vimeoVideo.vimeoIdentifier" defaultMessage="Vimeo URL or Vimeo Video ID" />}
                            validate={validateIdentifier}
                            type="text"
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
                                updateState({
                                    ...state,
                                    previewImage: resolveNewState({ prevState: state.previewImage, setStateAction }),
                                });
                            }}
                        />
                    </AdminComponentSection>
                </SelectPreviewComponent>
            </Box>
        );
    },

    previewContent: (state) => [{ type: "text", content: state.vimeoIdentifier }],

    extractTextContents: (state) => [state.previewImage.damFile?.altText ?? "", state.previewImage.damFile?.title ?? ""],
};
