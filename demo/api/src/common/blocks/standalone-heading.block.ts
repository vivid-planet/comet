import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { IsEnum } from "class-validator";

export enum TextAlignment {
    left = "left",
    center = "center",
}

class StandaloneHeadingBlockData extends BlockData {
    @ChildBlock(HeadingBlock)
    heading: BlockDataInterface;

    @BlockField({ type: "enum", enum: TextAlignment })
    textAlignment: TextAlignment;
}

class StandaloneHeadingBlockInput extends BlockInput {
    @ChildBlockInput(HeadingBlock)
    heading: ExtractBlockInput<typeof HeadingBlock>;

    @IsEnum(TextAlignment)
    @BlockField({ type: "enum", enum: TextAlignment })
    textAlignment: TextAlignment;

    transformToBlockData(): StandaloneHeadingBlockData {
        return inputToData(StandaloneHeadingBlockData, this);
    }
}

export const StandaloneHeadingBlock = createBlock(StandaloneHeadingBlockData, StandaloneHeadingBlockInput, {
    name: "StandaloneHeading",
});
