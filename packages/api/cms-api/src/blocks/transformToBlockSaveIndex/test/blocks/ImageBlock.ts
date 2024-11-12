import { IsOptional, IsString } from "class-validator";

import { BlockData, BlockIndexData, BlockInput, blockInputToData, createBlock } from "../../../block";
import { BlockField } from "../../../decorators/field";

class ImageBlockData extends BlockData {
    @BlockField()
    damFileId?: string;

    indexData(): BlockIndexData {
        if (this.damFileId === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: "DamFile",
                    id: this.damFileId,
                },
            ],
        };
    }
}

class ImageBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField()
    damFileId: string;

    transformToBlockData(): ImageBlockData {
        return blockInputToData(ImageBlockData, this);
    }
}

export const ImageBlock = createBlock(ImageBlockData, ImageBlockInput, "ImageBlock");
