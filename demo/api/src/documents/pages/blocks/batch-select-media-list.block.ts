import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    DamImageBlock,
    DamVideoBlock,
    ExtractBlockInput,
} from "@comet/cms-api";
import { ValidateNested } from "class-validator";

export const BatchSelectMediaListImageListBlock = createListBlock({ block: DamImageBlock }, "BatchSelectMediaListImageList");

export const BatchSelectMediaListVideoListBlock = createListBlock({ block: DamVideoBlock }, "BatchSelectMediaListVideoList");

class BatchSelectMediaListBlockData extends BlockData {
    @ChildBlock(BatchSelectMediaListImageListBlock)
    images: BlockDataInterface;

    @ChildBlock(BatchSelectMediaListVideoListBlock)
    videos: BlockDataInterface;
}

class BatchSelectMediaListBlockInput extends BlockInput {
    @ChildBlockInput(BatchSelectMediaListImageListBlock)
    @ValidateNested()
    images: ExtractBlockInput<typeof BatchSelectMediaListImageListBlock>;

    @ChildBlockInput(BatchSelectMediaListVideoListBlock)
    @ValidateNested()
    videos: ExtractBlockInput<typeof BatchSelectMediaListVideoListBlock>;

    transformToBlockData(): BlockDataInterface {
        return blockInputToData(BatchSelectMediaListBlockData, this);
    }
}

export const BatchSelectMediaListBlock = createBlock(BatchSelectMediaListBlockData, BatchSelectMediaListBlockInput, "BatchSelectMediaList");
