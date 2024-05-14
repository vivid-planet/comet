import { IsBoolean, IsOptional, IsString } from "class-validator";

import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";

class VimeoVideoBlockData extends BlockData {
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;

    @BlockField({ nullable: true })
    autoplay?: boolean;
}

class VimeoVideoBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;

    @IsOptional()
    @IsBoolean()
    @BlockField({ nullable: true })
    autoplay?: boolean;

    transformToBlockData(): BlockDataInterface {
        return inputToData(VimeoVideoBlockData, this);
    }
}

export const VimeoVideoBlock = createBlock(VimeoVideoBlockData, VimeoVideoBlockInput, "VimeoVideo");
