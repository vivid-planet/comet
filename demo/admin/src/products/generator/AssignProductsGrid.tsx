import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Loading, Savable } from "@comet/admin";
import {
    type GQLGetProductIdsForProductCategoryQuery,
    type GQLGetProductIdsForProductCategoryQueryVariables,
    type GQLSetProductCategoryMutation,
    type GQLSetProductCategoryMutationVariables,
} from "@src/products/generator/AssignProductsGrid.generated";
import { ProductsGrid as SelectProductsGrid } from "@src/products/generator/generated/SelectProductsGrid";
import isEqual from "lodash.isequal";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const setProductCategoryMutation = gql`
    mutation SetProductCategory($id: ID!, $input: [ID!]!) {
        updateProductCategory(id: $id, input: { products: $input }) {
            id
        }
    }
`;

const getProductIdsForProductCategory = gql`
    query GetProductIdsForProductCategory($id: ID!) {
        products(filter: { category: { equal: $id } }) {
            nodes {
                id
            }
        }
    }
`;

interface FormProps {
    productCategoryId: string;
}

export function AssignProductsGrid({ productCategoryId }: FormProps) {
    const client = useApolloClient();

    const { data, error, loading } = useQuery<GQLGetProductIdsForProductCategoryQuery, GQLGetProductIdsForProductCategoryQueryVariables>(
        getProductIdsForProductCategory,
        {
            variables: { id: productCategoryId },
            onCompleted: (data) => {
                setValues(data.products.nodes.map((product) => product.id));
            },
        },
    );

    const [values, setValues] = useState<string[]>([]);

    if (error) return <FormattedMessage id="common.error" defaultMessage="An error has occured. Please try again at later" />;
    if (loading) return <Loading />;

    return (
        <>
            <Savable
                doSave={async () => {
                    await client.mutate<GQLSetProductCategoryMutation, GQLSetProductCategoryMutationVariables>({
                        mutation: setProductCategoryMutation,
                        variables: { id: productCategoryId, input: values },
                        update: (cache, result) => cache.evict({ fieldName: "products" }),
                    });
                    return true;
                }}
                hasChanges={!isEqual((data?.products.nodes.map((product) => product.id) ?? []).sort(), values.sort())}
                doReset={() => {
                    setValues(data?.products.nodes.map((product) => product.id) ?? []);
                }}
            />
            <SelectProductsGrid
                rowSelectionModel={values}
                onRowSelectionModelChange={(newSelectionModel) => {
                    setValues(newSelectionModel.map((rowId) => String(rowId)));
                }}
            />
        </>
    );
}
