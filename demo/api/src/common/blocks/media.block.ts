import { createOneOfBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

const supportedBlocks = {
    image: DamImageBlock,
    damVideo: DamVideoBlock,
    youTubeVideo: YouTubeVideoBlock,
};

export const MediaTypeBlock = createOneOfBlock({ supportedBlocks }, "MediaType");
export const MediaBlock = createOneOfBlock({ supportedBlocks }, "Media");
