import { createOneOfBlock } from "@comet/blocks-api/lib/blocks/factories/createOneOfBlock";
import { YouTubeVideoBlock } from "@comet/blocks-api/lib/blocks/youtube-video.block";
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
