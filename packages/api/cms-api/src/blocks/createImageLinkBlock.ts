import {
    Block,
    BlockData,
    BlockDataInterface,
    BlockInput,
    BlockInputInterface,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
    NameOrOptions,
    SimpleBlockInputInterface,
} from "@comet/blocks-api";

import { PixelImageBlock } from "./PixelImageBlock";

interface CreateImageLinkBlockOptions<LinkBlock extends Block, ImageBlock extends Block> {
    image?: ImageBlock;
    link: LinkBlock;
}

interface ImageLinkBlockInputInterface<LinkBlockInput extends BlockInputInterface, ImageBlockInput extends BlockInputInterface>
    extends SimpleBlockInputInterface {
    link: LinkBlockInput;
    image: ImageBlockInput;
}

export function createImageLinkBlock<LinkBlock extends Block, ImageBlock extends Block = typeof PixelImageBlock>(
    options: CreateImageLinkBlockOptions<LinkBlock, ImageBlock>,
    nameOrOptions: NameOrOptions = "ImageLink",
): Block<BlockDataInterface, ImageLinkBlockInputInterface<ExtractBlockInput<LinkBlock>, ExtractBlockInput<ImageBlock>>> {
    const image = options.image || PixelImageBlock;
    const link = options.link;

    class ImageLinkBlockData extends BlockData {
        @ChildBlock(link)
        link: BlockDataInterface;

        @ChildBlock(image)
        image: BlockDataInterface;
    }

    class ImageLinkBlockInput extends BlockInput {
        @ChildBlockInput(link)
        link: ExtractBlockInput<LinkBlock>;

        @ChildBlockInput(image)
        image: ExtractBlockInput<ImageBlock>;

        transformToBlockData(): ImageLinkBlockData {
            return inputToData(ImageLinkBlockData, this);
        }
    }

    return createBlock(ImageLinkBlockData, ImageLinkBlockInput, nameOrOptions);
}
