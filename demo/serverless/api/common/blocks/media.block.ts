import { createOneOfBlock, createVimeoVideoBlock, createYouTubeVideoBlock } from "@dextinity/serverless-blocks/server";
import { DamImageBlock, DamVideoBlock, PixelImageBlock } from "@dextinity/serverless-dam/server";

export const MediaBlock = createOneOfBlock({
    name: "Media",
    supportedBlocks: {
        image: DamImageBlock,
        damVideo: DamVideoBlock,
        youTubeVideo: createYouTubeVideoBlock({ previewImage: PixelImageBlock }),
        vimeoVideo: createVimeoVideoBlock({ previewImage: PixelImageBlock }),
    },
    allowEmpty: false,
});
