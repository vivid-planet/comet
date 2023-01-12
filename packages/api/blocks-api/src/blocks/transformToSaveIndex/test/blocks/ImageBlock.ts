import { IsOptional, IsString } from "class-validator";

import { BlockData, BlockIndexDataArray, BlockInput, createBlock, inputToData } from "../../../block";
import { BlockField } from "../../../decorators/field";

export const DAM_FILE_BLOCK_INDEX_IDENTIFIER = "DamFile_BlockIndex";

class ImageBlockData extends BlockData {
    @BlockField()
    damFileId?: string;

    indexData(): BlockIndexDataArray {
        return [
            {
                targetIdentifier: DAM_FILE_BLOCK_INDEX_IDENTIFIER,
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
