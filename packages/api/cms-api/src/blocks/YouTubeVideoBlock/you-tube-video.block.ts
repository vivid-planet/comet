import { IsOptional, IsString } from "class-validator";

import { BaseVideoBlockData, BaseVideoBlockInput } from "../base-video-block";
import { BlockDataInterface, createBlock, inputToData } from "../block";
import { BlockField } from "../decorators/field";
import { typesafeMigrationPipe } from "../migrations/typesafeMigrationPipe";
import { IsValidYouTubeIdentifier } from "../validator/is-valid-you-tube-identifier";
import { RemoveAspectRatioMigration } from "./migrations/1-remove-aspect-ratio.migration";
import { AddPreviewImageMigration } from "./migrations/2-add-preview-image.migration";

class YouTubeVideoBlockData extends BaseVideoBlockData {
    @BlockField({ nullable: true })
    youtubeIdentifier?: string;
}

class YouTubeVideoBlockInput extends BaseVideoBlockInput {
    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    @IsValidYouTubeIdentifier()
    youtubeIdentifier?: string;

    transformToBlockData(): BlockDataInterface {
        return inputToData(YouTubeVideoBlockData, this);
    }
}

export const YouTubeVideoBlock = createBlock(YouTubeVideoBlockData, YouTubeVideoBlockInput, {
    name: "YouTubeVideo",
    migrate: {
        version: 2,
        migrations: typesafeMigrationPipe([RemoveAspectRatioMigration, AddPreviewImageMigration]),
    },
});
