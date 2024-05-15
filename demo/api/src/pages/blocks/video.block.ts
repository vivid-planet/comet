import { VimeoVideoBlock } from "@comet/blocks-api";
import { createOneOfBlock } from "@comet/blocks-api/lib/blocks/factories/createOneOfBlock";
import { YouTubeVideoBlock } from "@comet/blocks-api/lib/blocks/youtube-video.block";
import { DamVideoBlock } from "@comet/cms-api";

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
