import { messages } from "@comet/admin";
import {
    AdminComponentPaper,
    AdminComponentSection,
    BlockCategory,
    BlockInterface,
    composeBlocks,
    createBlockSkeleton,
    decomposeUpdateStateAction,
    withAdditionalBlockAttributes,
} from "@comet/blocks-admin";
import { FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { TextImageBlockData, TextImageBlockInput } from "../blocks.generated";
import { RichTextBlock, RichTextBlockState } from "./createRichTextBlock";
import { ImageBlockState, PixelImageBlock } from "./PixelImageBlock";
import { useCmsBlockContext } from "./useCmsBlockContext";

interface State {
    text: RichTextBlockState;
    image: ImageBlockState;
    imagePosition: "left" | "right";
    imageAspectRatio: string;
}

export interface TextImageBlockFactoryOptions {
    text: RichTextBlock;
    image?: BlockInterface;
}

const createTextImageBlock = ({
    text,
    image = PixelImageBlock,
}: TextImageBlockFactoryOptions): BlockInterface<TextImageBlockData, State, TextImageBlockInput> => {
    const composed = composeBlocks({ text, image });

    const { api: composedApi, block: composedBlock } = composed;

    const block = withAdditionalBlockAttributes<Pick<TextImageBlockData, "imagePosition" | "imageAspectRatio">>({
        imagePosition: "left",
        imageAspectRatio: "4x3",
    })(composedBlock);

    const TextImageBlock: BlockInterface<TextImageBlockData, State, TextImageBlockInput> = {
        ...createBlockSkeleton(),
        ...block,

        name: "TextImage",

        displayName: <FormattedMessage id="comet.blocks.textImage" defaultMessage="Text/Image" />,

        category: BlockCategory.TextAndContent,

        AdminComponent: ({ state, updateState }) => {
            const { text, image } = composedApi.adminComponents({
                state,
                updateState: decomposeUpdateStateAction(updateState, ["text", "image"]),
            });
            const context = useCmsBlockContext();

            return (
                <>
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.textImage.text" defaultMessage="Text" />}>
                        {text}
                    </AdminComponentSection>
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.textImage.image" defaultMessage="Image" />}>
                        <AdminComponentPaper disablePadding>{image}</AdminComponentPaper>
                    </AdminComponentSection>
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.textImage.imagePosition" defaultMessage="Image position" />}>
                        <RadioGroup
                            row
                            value={state.imagePosition}
                            onChange={(event) => {
                                updateState((prevState) => ({
                                    ...prevState,
                                    imagePosition: event.target.value as TextImageBlockData["imagePosition"],
                                }));
                            }}
                        >
                            <FormControlLabel value="left" control={<Radio />} label={<FormattedMessage {...messages.left} />} />
                            <FormControlLabel value="right" control={<Radio />} label={<FormattedMessage {...messages.right} />} />
                        </RadioGroup>
                    </AdminComponentSection>
                    <AdminComponentSection
                        title={<FormattedMessage id="comet.blocks.textImage.imageAspectRatio" defaultMessage="Image aspect ratio" />}
                    >
                        <Select
                            value={state.imageAspectRatio}
                            onChange={(event) => {
                                updateState((prevState) => ({
                                    ...prevState,
                                    imageAspectRatio: event.target.value as string,
                                }));
                            }}
                            fullWidth
                        >
                            {context.damConfig.allowedImageAspectRatios.map((aspectRatio) => (
                                <MenuItem key={aspectRatio} value={aspectRatio}>
                                    {aspectRatio}
                                </MenuItem>
                            ))}
                        </Select>
                    </AdminComponentSection>
                </>
            );
        },
    };
    return TextImageBlock;
};

export { createTextImageBlock };
