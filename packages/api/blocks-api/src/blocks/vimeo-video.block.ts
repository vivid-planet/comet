import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { VideoAspectRatio } from "../constants/enums";
import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";

class VimeoVideoBlockData extends BlockData {
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;

    @BlockField({ type: "enum", enum: VideoAspectRatio })
    aspectRatio: VideoAspectRatio;

    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;
}

class VimeoVideoBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;

    @IsEnum(VideoAspectRatio)
    @BlockField({ type: "enum", enum: VideoAspectRatio })
    aspectRatio: VideoAspectRatio;

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

    transformToBlockData(): BlockDataInterface {
        return inputToData(VimeoVideoBlockData, this);
    }
}

export const VimeoVideoBlock = createBlock(VimeoVideoBlockData, VimeoVideoBlockInput, "VimeoVideo");
