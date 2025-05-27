import { createOneOfBlock, DamImageBlock, DamVideoBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

export const MediaBlock = createOneOfBlock(
    {
        supportedBlocks: {
            image: DamImageBlock,
            damVideo: DamVideoBlock,
            youTubeVideo: YouTubeVideoBlock,
            vimeoVideo: VimeoVideoBlock,
        },
    },
    "Media",
);
