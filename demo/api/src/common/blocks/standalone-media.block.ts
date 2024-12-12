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
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";
import { IsEnum } from "class-validator";

import { MediaBlock } from "./media.block";

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
