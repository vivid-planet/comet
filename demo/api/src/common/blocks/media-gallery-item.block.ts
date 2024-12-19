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
import { IsUndefinable } from "@comet/cms-api";
import { MediaBlock } from "@src/common/blocks/media.block";
import { IsString } from "class-validator";

class MediaGalleryItemBlockData extends BlockData {
    @ChildBlock(MediaBlock)
    media: BlockDataInterface;

    @BlockField({ nullable: true })
    caption?: string;
}

class MediaGalleryItemBlockInput extends BlockInput {
    @ChildBlockInput(MediaBlock)
    media: ExtractBlockInput<typeof MediaBlock>;

    @IsUndefinable()
    @BlockField({ nullable: true })
    @IsString()
    caption?: string;

    transformToBlockData(): MediaGalleryItemBlockData {
        return inputToData(MediaGalleryItemBlockData, this);
    }
}

export const MediaGalleryItemBlock = createBlock(MediaGalleryItemBlockData, MediaGalleryItemBlockInput, "MediaGalleryItem");
