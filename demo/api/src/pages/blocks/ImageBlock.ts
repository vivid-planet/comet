import { createOneOfBlock, typesafeMigrationPipe } from "@comet/blocks-api";
import { PixelImageBlock, SvgImageBlock } from "@comet/cms-api";

import { RemoveEmptyOptionMigration } from "./imageBlock/migrations/1-remove-empy-option.migration";

export const ImageBlock = createOneOfBlock(
    {
        supportedBlocks: {
            pixelImage: PixelImageBlock,
            svgImage: SvgImageBlock,
        },
        allowEmpty: false,
    },
    {
        name: "Image",
        migrate: {
            version: 1,
            migrations: typesafeMigrationPipe([RemoveEmptyOptionMigration]),
        },
    },
);
