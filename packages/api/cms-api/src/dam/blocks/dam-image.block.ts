import { createOneOfBlock, OneOfBlock } from "@comet/blocks-api";

import { PixelImageBlock } from "../../blocks/PixelImageBlock";
import { SvgImageBlock } from "../../blocks/SvgImageBlock";

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
