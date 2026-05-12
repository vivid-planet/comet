import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    PixelImageBlock,
} from "@comet/cms-api";

export class NewsletterImageBlockData extends BlockData {
    @ChildBlock(PixelImageBlock)
    image: BlockDataInterface;
}
export class NewsletterImageBlockInput extends BlockInput {
    @ChildBlockInput(PixelImageBlock)
    image: ExtractBlockInput<typeof PixelImageBlock>;

    transformToBlockData(): NewsletterImageBlockData {
        return blockInputToData(NewsletterImageBlockData, this);
    }
}
export const NewsletterImageBlock = createBlock(NewsletterImageBlockData, NewsletterImageBlockInput, {
    name: "NewsletterImage",
});
