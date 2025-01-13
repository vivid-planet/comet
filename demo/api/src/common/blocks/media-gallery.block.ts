import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { MediaGalleryItemBlock } from "@src/common/blocks/media-gallery-item.block";
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";
import { IsEnum } from "class-validator";

const MediaGalleryListBlock = createListBlock({ block: MediaGalleryItemBlock }, "MediaGalleryList");

class MediaGalleryBlockData extends BlockData {
    @ChildBlock(MediaGalleryListBlock)
    items: BlockDataInterface;

    @BlockField({ type: "enum", enum: MediaAspectRatios })
    aspectRatio: MediaAspectRatios;
}

class MediaGalleryBlockInput extends BlockInput {
    @ChildBlockInput(MediaGalleryListBlock)
    items: ExtractBlockInput<typeof MediaGalleryListBlock>;

    @IsEnum(MediaAspectRatios)
    @BlockField({ type: "enum", enum: MediaAspectRatios })
    aspectRatio: MediaAspectRatios;

    transformToBlockData(): MediaGalleryBlockData {
        return inputToData(MediaGalleryBlockData, this);
    }
}

export const MediaGalleryBlock = createBlock(MediaGalleryBlockData, MediaGalleryBlockInput, "MediaGallery");
