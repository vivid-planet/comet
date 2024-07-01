import {
    Block,
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    BlockInputInterface,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
    SimpleBlockInputInterface,
} from "@comet/blocks-api";
import { Type } from "class-transformer";
import { IsEnum, IsString } from "class-validator";

import { PixelImageBlock } from "../dam/blocks/pixel-image.block";
import { IsAllowedImageAspectRatio } from "../dam/images/validators/is-allowed-aspect-ratio.validator";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum ImagePosition {
    Left = "left",
    Right = "right",
}
/* eslint-enable @typescript-eslint/naming-convention */

interface CreateTextImageBlockOptions<TextBlock extends Block, ImageBlock extends Block> {
    text: TextBlock;
    image?: ImageBlock;
}

interface TextImageBlockInputInterface<TextBlockInput extends BlockInputInterface, ImageBlockInput extends BlockInputInterface>
    extends SimpleBlockInputInterface {
    text: TextBlockInput;
    image: ImageBlockInput;
    imagePosition: ImagePosition;
    imageAspectRatio: string;
}

export function createTextImageBlock<TextBlock extends Block, ImageBlock extends Block = typeof PixelImageBlock>(
    options: CreateTextImageBlockOptions<TextBlock, ImageBlock>,
): Block<BlockDataInterface, TextImageBlockInputInterface<ExtractBlockInput<TextBlock>, ExtractBlockInput<ImageBlock>>> {
    const image = options.image || PixelImageBlock;
    const text = options.text;

    class TextImageBlockData extends BlockData {
        @ChildBlock(text)
        text: BlockDataInterface;

        @ChildBlock(image)
        image: BlockDataInterface;

        @Type()
        @BlockField({
            type: "enum",
            enum: ImagePosition,
        })
        imagePosition: ImagePosition;

        @BlockField()
        imageAspectRatio: string;
    }

    class TextImageBlockInput
        extends BlockInput
        implements TextImageBlockInputInterface<ExtractBlockInput<TextBlock>, ExtractBlockInput<ImageBlock>>
    {
        @ChildBlockInput(text)
        text: ExtractBlockInput<TextBlock>;

        @ChildBlockInput(image)
        image: ExtractBlockInput<ImageBlock>;

        @Type()
        @IsEnum(ImagePosition)
        @BlockField({
            type: "enum",
            enum: ImagePosition,
        })
        imagePosition: ImagePosition;

        @IsString()
        @IsAllowedImageAspectRatio()
        @BlockField()
        imageAspectRatio: string;

        transformToBlockData(): TextImageBlockData {
            return inputToData(TextImageBlockData, this);
        }
    }

    return createBlock(TextImageBlockData, TextImageBlockInput, "TextImage");
}
