import { createCompositeBlock, createCompositeBlockSelectField } from "@comet/cms-admin";
import { type ProductListBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

const options: { value: ProductListBlockData["types"][number]; label: JSX.Element }[] = [
    {
        value: "cap",
        label: <FormattedMessage id="cap" defaultMessage="Cap" />,
    },
    {
        value: "shirt",
        label: <FormattedMessage id="shirt" defaultMessage="Shirt" />,
    },
    {
        value: "tie",
        label: <FormattedMessage id="tie" defaultMessage="Tie" />,
    },
];

export const ProductListBlock = createCompositeBlock({
    name: "ProductList",
    displayName: <FormattedMessage id="productListBlock.displayName" defaultMessage="Product List" />,
    blocks: {
        products: {
            block: createCompositeBlockSelectField<ProductListBlockData["types"]>({
                defaultValue: ["cap"],
                label: <FormattedMessage id="productListBlock.products" defaultMessage="Products" />,
                options: options,
                multiple: true,
                fullWidth: true,
            }),
        },
    },
});
