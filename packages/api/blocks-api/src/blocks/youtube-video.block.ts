import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";

enum AspectRatio {
    "16X9" = "16X9",
    "4X3" = "4X3",
}

class YouTubeVideoBlockData extends BlockData {
    @BlockField()
    youtubeIdentifier?: string;

    @BlockField({ type: "enum", enum: AspectRatio })
    aspectRatio: AspectRatio;

    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;
}

class YouTubeVideoBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField()
    youtubeIdentifier?: string;

    @IsEnum(AspectRatio)
    @BlockField({ type: "enum", enum: AspectRatio })
    aspectRatio: AspectRatio;

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
        return inputToData(YouTubeVideoBlockData, this);
    }
}

export const YouTubeVideoBlock = createBlock(YouTubeVideoBlockData, YouTubeVideoBlockInput, "YouTubeVideo");
