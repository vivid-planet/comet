import { BlockCategory, createCompositeBlock, createListBlock } from "@comet/blocks-admin";
import { ProductListItemBlock } from "@src/common/blocks/ProductListItemBlock";
import { FormattedMessage } from "react-intl";

const ProductListBlock = createListBlock({
    name: "ProductList",
    block: ProductListItemBlock,
    itemName: <FormattedMessage id="productList.itemName" defaultMessage="Product" />,
    itemsName: <FormattedMessage id="productList.itemsName" defaultMessage="Products" />,
});

export const ProductListCarouselBlock = createCompositeBlock(
    {
        name: "ProductListCarousel",
        displayName: <FormattedMessage id="productListCarousel.displayName" defaultMessage="Product Carousel" />,
        blocks: {
            products: {
                block: ProductListBlock,
                title: <FormattedMessage id="productListCarousel.products" defaultMessage="Products" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
