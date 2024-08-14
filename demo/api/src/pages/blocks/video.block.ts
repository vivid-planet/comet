import { createOneOfBlock } from "@comet/blocks-api";
import { DamVideoBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

export const VideoBlock = createOneOfBlock(
    {
        supportedBlocks: {
            damVideo: DamVideoBlock,
            youtubeVideo: YouTubeVideoBlock,
            vimeoVideo: VimeoVideoBlock,
        },
        allowEmpty: true,
    },
    {
        name: "Video",
    },
);
