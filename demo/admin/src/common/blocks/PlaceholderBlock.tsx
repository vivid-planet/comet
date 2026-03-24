import { gql, useApolloClient, useQuery } from "@apollo/client";
import { AsyncAutocompleteField } from "@comet/admin";
import { BlocksFinalForm, createBlockSkeleton, createCompositeBlockSelectField } from "@comet/cms-admin";
import { type PlaceholderBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

const placeholderBlockProductSearchQuery = gql`
    query PlaceholderBlockProductSearch($search: String) {
        products(search: $search, offset: 0, limit: 20) {
            nodes {
                id
                title
            }
        }
    }
`;

const placeholderBlockProductQuery = gql`
    query PlaceholderBlockProduct($id: ID!) {
        product(id: $id) {
            id
            title
        }
    }
`;

interface ProductOption {
    id: string;
    title: string;
}

const fieldOptions: Array<{ value: PlaceholderBlockData["field"]; label: React.ReactNode }> = [
    {
        value: "title",
        label: <FormattedMessage id="placeholderBlock.field.title" defaultMessage="Title" />,
    },
    {
        value: "price",
        label: <FormattedMessage id="placeholderBlock.field.price" defaultMessage="Price" />,
    },
];

interface PlaceholderBlockState {
    productId?: string;
    field: PlaceholderBlockData["field"];
}

const [FieldSelect] = createCompositeBlockSelectField<PlaceholderBlockData["field"]>({
    label: <FormattedMessage id="placeholderBlock.field" defaultMessage="Field" />,
    defaultValue: "title",
    options: fieldOptions,
});

export const PlaceholderBlock = {
    ...createBlockSkeleton(),

    name: "Placeholder",

    displayName: <FormattedMessage id="placeholderBlock.displayName" defaultMessage="Placeholder" />,

    defaultValues: (): PlaceholderBlockState => ({ productId: undefined, field: "title" }),

    input2State: (input: PlaceholderBlockData): PlaceholderBlockState => ({
        productId: input.productId ?? undefined,
        field: input.field,
    }),

    state2Output: (state: PlaceholderBlockState): PlaceholderBlockData => ({
        productId: state.productId,
        field: state.field,
    }),

    output2State: async (output: PlaceholderBlockData): Promise<PlaceholderBlockState> => ({
        productId: output.productId ?? undefined,
        field: output.field,
    }),

    createPreviewState: (state: PlaceholderBlockState) => ({
        productId: state.productId,
        field: state.field,
    }),

    AdminComponent: ({
        state,
        updateState,
    }: {
        state: PlaceholderBlockState;
        updateState: (setter: PlaceholderBlockState | ((prev: PlaceholderBlockState) => PlaceholderBlockState)) => void;
    }) => {
        const client = useApolloClient();
        const { data: productData } = useQuery(placeholderBlockProductQuery, {
            variables: { id: state.productId },
            skip: !state.productId,
        });
        const initialProduct: ProductOption | undefined = productData?.product ?? undefined;

        return (
            <div>
                <BlocksFinalForm<{ product: ProductOption | undefined }>
                    onSubmit={({ product }) => {
                        updateState((prev) => ({ ...prev, productId: product?.id }));
                    }}
                    initialValues={{ product: initialProduct }}
                >
                    <AsyncAutocompleteField
                        name="product"
                        label={<FormattedMessage id="placeholderBlock.product" defaultMessage="Product" />}
                        fullWidth
                        loadOptions={async (search?: string) => {
                            const { data } = await client.query({
                                query: placeholderBlockProductSearchQuery,
                                variables: { search },
                            });
                            return data.products.nodes;
                        }}
                        getOptionLabel={(option: ProductOption) => option.title}
                        isOptionEqualToValue={(option: ProductOption, value: ProductOption) => option.id === value.id}
                    />
                </BlocksFinalForm>

                <FieldSelect.AdminComponent
                    state={state.field}
                    updateState={(newField) => {
                        const resolvedField = typeof newField === "function" ? newField(state.field) : newField;
                        updateState((prev) => ({ ...prev, field: resolvedField }));
                    }}
                />
            </div>
        );
    },
};
