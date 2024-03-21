import { createOneOfBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-api";

export const MediaBlock = createOneOfBlock(
    {
        supportedBlocks: { image: DamImageBlock, video: DamVideoBlock },
        allowEmpty: true,
    },
    "Media",
);
