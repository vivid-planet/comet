import { IsOptional, IsString } from "class-validator";

import { BlockIndexDataArray } from "../../../../../lib/blocks/block";
import { BlockData, BlockInput, createBlock, inputToData } from "../../../block";
import { BlockField } from "../../../decorators/field";

class ImageBlockData extends BlockData {
    @BlockField()
    damFileId?: string;

    indexData(): BlockIndexDataArray {
        return [
            {
                indexName: "DamFileIndex",
                id: this.damFileId,
            },
        ];
    }
}

class ImageBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField()
    damFileId: string;

    transformToBlockData(): ImageBlockData {
        return inputToData(ImageBlockData, this);
    }
}

export const ImageBlock = createBlock(ImageBlockData, ImageBlockInput, "ImageBlock");
