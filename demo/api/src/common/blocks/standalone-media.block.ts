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
import { MediaBlock } from "@src/common/blocks/media.block";
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";
import { IsEnum } from "class-validator";

class StandaloneMediaBlockData extends BlockData {
    @ChildBlock(MediaBlock)
    media: BlockDataInterface;

    @BlockField({ type: "enum", enum: MediaAspectRatios })
    aspectRatio: MediaAspectRatios;
}

class StandaloneMediaBlockInput extends BlockInput {
    @ChildBlockInput(MediaBlock)
    media: ExtractBlockInput<typeof MediaBlock>;

    @IsEnum(MediaAspectRatios)
    @BlockField({ type: "enum", enum: MediaAspectRatios })
    aspectRatio: MediaAspectRatios;

    transformToBlockData(): StandaloneMediaBlockData {
        return inputToData(StandaloneMediaBlockData, this);
    }
}

export const StandaloneMediaBlock = createBlock(StandaloneMediaBlockData, StandaloneMediaBlockInput, {
    name: "StandaloneMedia",
});