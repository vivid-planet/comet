import { gql, useApolloClient } from "@apollo/client";
import { AsyncSelectField } from "@comet/admin";
import { Tag } from "@comet/admin-icons";
import { type BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/cms-admin";
import type { ProductPriceBlockData, ProductPriceBlockInput } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import type { GQLProductPriceSelectQuery, GQLProductPriceSelectQueryVariables } from "./ProductPriceBlock.generated";

type ProductOption = { id: string; title: string };

type State = {
    product?: ProductOption;
};

const productPriceSelectQuery = gql`
    query ProductPriceSelect {
        products {
            nodes {
                id
                title
            }
        }
    }
`;

const ProductPriceBlock: BlockInterface<ProductPriceBlockData, State, ProductPriceBlockInput> = {
    ...createBlockSkeleton(),

    name: "ProductPrice",

    displayName: <FormattedMessage id="blocks.productPrice.displayName" defaultMessage="Product Price" />,

    defaultValues: () => ({}),

    input2State: (input) => ({
        product: input.product ? { id: input.product.id, title: input.product.title } : undefined,
    }),

    state2Output: (state) => ({
        productId: state.product?.id,
    }),

    AdminComponent: ({ state, updateState }) => {
        const client = useApolloClient();

        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <AsyncSelectField
                    name="product"
                    fullWidth
                    label={<FormattedMessage id="blocks.productPrice.product" defaultMessage="Product" />}
                    loadOptions={async () => {
                        const { data } = await client.query<GQLProductPriceSelectQuery, GQLProductPriceSelectQueryVariables>({
                            query: productPriceSelectQuery,
                        });
                        return data.products.nodes;
                    }}
                    getOptionLabel={(option: ProductOption) => option.title}
                />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => (state.product ? [{ type: "text", content: state.product.title }] : []),

    icon: () => <Tag color="primary" />,
};

export { ProductPriceBlock };
