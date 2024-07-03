import { createOneOfBlock } from "@comet/blocks-api";
import { DamVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

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
