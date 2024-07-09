import { IsBoolean, IsOptional, IsString } from "class-validator";

import { typesafeMigrationPipe } from "../../migrations/typesafeMigrationPipe";
import { BlockData, BlockDataInterface, BlockInput, createBlock, inputToData } from "../block";
import { BlockField } from "../decorators/field";
import { IsValidYoutubeIdentifier } from "../validator/is-valid-youtube-identifier";
import { RemoveAspectRatioMigration } from "./migrations/1-remove-aspect-ratio.migration";

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
