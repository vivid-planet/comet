import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { ProductListItemBlock } from "@src/common/blocks/product-list-item.block";

export const ProductListBlock = createListBlock({ block: ProductListItemBlock }, "ProductList");

class ProductListCarouselBlockData extends BlockData {
    @ChildBlock(ProductListBlock)
    products: BlockDataInterface;
}

class ProductListCarouselBlockInput extends BlockInput {
    @ChildBlockInput(ProductListBlock)
    products: ExtractBlockInput<typeof ProductListBlock>;

    transformToBlockData(): ProductListCarouselBlockData {
        return inputToData(ProductListCarouselBlockData, this);
    }
}

export const ProductListCarouselBlock = createBlock(ProductListCarouselBlockData, ProductListCarouselBlockInput, "ProductListCarousel");
