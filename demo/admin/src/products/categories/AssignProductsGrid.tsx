import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Savable } from "@comet/admin";
import { CircularProgress } from "@mui/material";
import {
    GQLGetProductIdsForProductCategoryQuery,
    GQLGetProductIdsForProductCategoryQueryVariables,
    GQLSetProductCategoryMutation,
    GQLSetProductCategoryMutationVariables,
} from "@src/products/categories/AssignProductsGrid.generated";
import { ProductsSelectGrid } from "@src/products/categories/ProductsSelectGrid";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";
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

export function AssignProductsGrid({ productCategoryId }: FormProps): React.ReactElement {
    const client = useApolloClient();

    const { data, error, loading } = useQuery<GQLGetProductIdsForProductCategoryQuery, GQLGetProductIdsForProductCategoryQueryVariables>(
        getProductIdsForProductCategory,
        {
            variables: { id: productCategoryId },
        },
    );

    const [values, setValues] = useState<string[]>(data?.products.nodes ? data.products.nodes.map((product) => product.id) : []);
    useEffect(() => {
        if (data?.products.nodes) setValues(data.products.nodes.map((product) => product.id));
    }, [data?.products.nodes]);

    if (error) return <FormattedMessage id="common.error" defaultMessage="An error has occured. Please try again at later" />;
    if (loading) return <CircularProgress />;

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
            <ProductsSelectGrid
                dataGridProps={{
                    checkboxSelection: true,
                    keepNonExistentRowsSelected: true,
                    selectionModel: values,
                    onSelectionModelChange: (newSelectionModel) => {
                        setValues(newSelectionModel.map((rowId) => String(rowId)));
                    },
                }}
            />
        </>
    );
}
