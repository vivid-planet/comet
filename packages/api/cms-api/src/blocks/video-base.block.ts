import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { IsBoolean, IsOptional } from "class-validator";

import { DamImageBlock } from "../dam/blocks/dam-image.block";

export class VideoBaseBlockData extends BlockData {
    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;

    @ChildBlock(DamImageBlock)
    previewImage: BlockDataInterface;
}

export class VideoBaseBlockInput extends BlockInput {
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

    @ChildBlockInput(DamImageBlock)
    previewImage: ExtractBlockInput<typeof DamImageBlock>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(VideoBaseBlockData, this);
    }
}
