<<<<<<< HEAD:packages/api/blocks-api/src/blocks/YouTubeVideoBlock/youtube-video.block.ts
import { IsBoolean, IsOptional, IsString, Matches } from "class-validator";

import { typesafeMigrationPipe } from "../../migrations/typesafeMigrationPipe";
import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "../block";
import { BlockField } from "../decorators/field";
import { RemoveAspectRatioMigration } from "./migrations/1-remove-aspect-ratio.migration";
=======
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";
import { IsValidYoutubeIdentifier } from "./validator/is-valid-youtube-identifier";

enum AspectRatio {
    "16X9" = "16X9",
    "4X3" = "4X3",
}
>>>>>>> main:packages/api/blocks-api/src/blocks/youtube-video.block.ts

class YouTubeVideoBlockData extends BlockData {
    @BlockField({ nullable: true })
    youtubeIdentifier?: string;

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
    @BlockField({ nullable: true })
    @IsValidYoutubeIdentifier()
    youtubeIdentifier?: string;

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

export const YouTubeVideoBlock = createBlock(YouTubeVideoBlockData, YouTubeVideoBlockInput, {
    name: "YouTubeVideo",
    migrate: {
        version: 1,
        migrations: typesafeMigrationPipe([RemoveAspectRatioMigration]),
    },
});
