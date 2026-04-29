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

export const MediaDownloadImageListBlock = createListBlock({ block: DamImageBlock }, "MediaDownloadImageList");

export const MediaDownloadVideoListBlock = createListBlock({ block: DamVideoBlock }, "MediaDownloadVideoList");

class MediaDownloadBlockData extends BlockData {
    @ChildBlock(MediaDownloadImageListBlock)
    images: BlockDataInterface;

    @ChildBlock(MediaDownloadVideoListBlock)
    videos: BlockDataInterface;
}

class MediaDownloadBlockInput extends BlockInput {
    @ChildBlockInput(MediaDownloadImageListBlock)
    @ValidateNested()
    images: ExtractBlockInput<typeof MediaDownloadImageListBlock>;

    @ChildBlockInput(MediaDownloadVideoListBlock)
    @ValidateNested()
    videos: ExtractBlockInput<typeof MediaDownloadVideoListBlock>;

    transformToBlockData(): BlockDataInterface {
        return blockInputToData(MediaDownloadBlockData, this);
    }
}

export const MediaDownloadBlock = createBlock(MediaDownloadBlockData, MediaDownloadBlockInput, "MediaDownload");
