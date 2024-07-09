import { createOneOfBlock, OneOfBlock } from "@comet/blocks-api";

import { PixelImageBlock } from "./pixel-image.block";
import { SvgImageBlock } from "./svg-image.block";

const DamImageBlock: OneOfBlock<{ pixelImage: typeof PixelImageBlock; svgImage: typeof SvgImageBlock }> = createOneOfBlock(
    {
        supportedBlocks: {
            pixelImage: PixelImageBlock,
            svgImage: SvgImageBlock,
        },
        allowEmpty: false,
    },
    "DamImage",
);

export { DamImageBlock };
