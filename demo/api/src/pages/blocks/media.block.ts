import { createOneOfBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

export const MediaBlock = createOneOfBlock(
    {
        supportedBlocks: { image: DamImageBlock, damVideo: DamVideoBlock, youTubeVideo: YouTubeVideoBlock },
    },
    "Media",
);
