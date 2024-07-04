import { BlockDataInterface, BlockField, createBlock, inputToData, typesafeMigrationPipe } from "@comet/blocks-api";
import { IsOptional, IsString, Matches } from "class-validator";

import { BaseVideoBlockData, BaseVideoBlockInput } from "../BaseVideoBlockData";
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
    // regex from https://stackoverflow.com/a/51870158
    @Matches(
        /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/,
    )
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
