import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createOptionalBlock,
    ExtractBlockData,
    inputToData,
} from "@comet/api-blocks";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { ValidateNested } from "class-validator";

import { ImageBlock } from "./ImageBlock";

const FullWidthImageContentBlock = createOptionalBlock(RichTextBlock);

class FullWidthImageBlockData extends BlockData {
    @ChildBlock(ImageBlock)
    image: ExtractBlockData<typeof ImageBlock>;

    @ChildBlock(FullWidthImageContentBlock)
    content: ExtractBlockData<typeof FullWidthImageContentBlock>;
}

class FullWidthImageBlockInput extends BlockInput {
    @ChildBlockInput(ImageBlock)
    @ValidateNested()
    image: ExtractBlockData<typeof ImageBlock>;

    @ChildBlockInput(FullWidthImageContentBlock)
    @ValidateNested()
    content: ExtractBlockData<typeof FullWidthImageContentBlock>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(FullWidthImageBlockData, this);
    }
}

export const FullWidthImageBlock = createBlock(FullWidthImageBlockData, FullWidthImageBlockInput, "FullWidthImage");
