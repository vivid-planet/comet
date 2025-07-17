import { BlockCategory, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { FormattedMessage } from "react-intl";

export const ProductListItemBlock = createCompositeBlock(
    {
        name: "ProductListItem",
        displayName: <FormattedMessage id="productList.item.displayName" defaultMessage="Product Item" />,
        blocks: {
            image: {
                block: DamImageBlock,
                title: <FormattedMessage id="productList.item.image" defaultMessage="Image" />,
            },
            name: {
                block: createCompositeBlockTextField({
                    fullWidth: true,
                    label: <FormattedMessage id="productList.item.name" defaultMessage="Name" />,
                }),
                hiddenInSubroute: true,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
