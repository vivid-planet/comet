import { createOneOfBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/cms-api";

const supportedBlocks = {
    image: DamImageBlock,
    damVideo: DamVideoBlock,
    youTubeVideo: YouTubeVideoBlock,
    vimeoVideo: VimeoVideoBlock,
};

export const MediaTypeBlock = createOneOfBlock({ supportedBlocks }, "MediaType");
export const MediaBlock = createOneOfBlock({ supportedBlocks }, "Media");
