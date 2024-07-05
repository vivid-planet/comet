import { createOneOfBlock, YouTubeVideoBlock } from "@comet/blocks-api";
import { DamVideoBlock } from "@comet/cms-api";

export const VideoBlock = createOneOfBlock(
    {
        supportedBlocks: {
            damVideo: DamVideoBlock,
            youtubeVideo: YouTubeVideoBlock,
        },
        allowEmpty: true,
    },
    {
        name: "Video",
    },
);
