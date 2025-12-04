import { IsBoolean, IsOptional } from "class-validator";

import { PixelImageBlock } from "../dam/blocks/pixel-image.block";
import { BlockData, BlockDataInterface, BlockInput, blockInputToData, ExtractBlockInput } from "./block";
import { ChildBlock } from "./decorators/child-block";
import { ChildBlockInput } from "./decorators/child-block-input";
import { BlockField } from "./decorators/field";

export class BaseVideoBlockData extends BlockData {
    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;

    @ChildBlock(PixelImageBlock)
    previewImage: BlockDataInterface;
}

export class BaseVideoBlockInput extends BlockInput {
    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    autoplay?: boolean;

    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    showControls?: boolean;

    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    loop?: boolean;

    @ChildBlockInput(PixelImageBlock)
    previewImage: ExtractBlockInput<typeof PixelImageBlock>;

    transformToBlockData(): BlockDataInterface {
        return blockInputToData(BaseVideoBlockData, this);
    }
}
