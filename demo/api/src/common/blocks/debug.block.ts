import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { PixelImageBlock } from "@comet/cms-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

class DebugBlockData extends BlockData {
    @ChildBlock(PixelImageBlock)
    image: BlockDataInterface;

    @ChildBlock(PixelImageBlock)
    icon: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;
}

class DebugBlockInput extends BlockInput {
    @ChildBlockInput(PixelImageBlock)
    image: ExtractBlockInput<typeof PixelImageBlock>;

    @ChildBlockInput(PixelImageBlock)
    icon: ExtractBlockInput<typeof PixelImageBlock>;

    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): DebugBlockData {
        return inputToData(DebugBlockData, this);
    }
}

export const DebugBlock = createBlock(DebugBlockData, DebugBlockInput, "Debug");
