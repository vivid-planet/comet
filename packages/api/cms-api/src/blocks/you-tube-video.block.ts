import { BlockDataInterface, BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString, Matches } from "class-validator";

import { VideoBaseBlockData, VideoBaseBlockInput } from "./video-base.block";

class YouTubeVideoBlockData extends VideoBaseBlockData {
    @BlockField({ nullable: true })
    youtubeIdentifier?: string;
}

class YouTubeVideoBlockInput extends VideoBaseBlockInput {
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

export const YouTubeVideoBlock = createBlock(YouTubeVideoBlockData, YouTubeVideoBlockInput, "YouTubeVideo");
