import { gql, useApolloClient } from "@apollo/client";
import { Savable } from "@comet/admin";
import {
    GQLGetProductIdsForProductCategoryQuery,
    GQLGetProductIdsForProductCategoryQueryVariables,
    GQLSetProductCategoryMutation,
    GQLSetProductCategoryMutationVariables,
} from "@src/products/categories/AssignProductsGrid.generated";
import { ProductsSelectGrid } from "@src/products/categories/ProductsSelectGrid";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";

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

    const [selection, setSelection] = useState<{ initialValues?: string[]; values: string[] }>({ values: [] });
    useEffect(() => {
        let active = true;
        (async () => {
            const response = await client.query<GQLGetProductIdsForProductCategoryQuery, GQLGetProductIdsForProductCategoryQueryVariables>({
                query: getProductIdsForProductCategory,
                variables: { id: productCategoryId },
            });
            const orderedIds = response.data.products.nodes.map((product) => product.id).sort();
            if (active) setSelection({ initialValues: orderedIds, values: orderedIds });
        })();
        return () => {
            active = false;
        };
    }, [client, productCategoryId]);

    return (
        <>
            <Savable
                doSave={async () => {
                    await client.mutate<GQLSetProductCategoryMutation, GQLSetProductCategoryMutationVariables>({
                        mutation: setProductCategoryMutation,
                        variables: { id: productCategoryId, input: selection.values },
                    });
                    setSelection({ initialValues: selection.values, values: selection.values });
                    return true;
                }}
                hasChanges={!isEqual(selection.initialValues, selection.values)}
                doReset={() => {
                    setSelection({ initialValues: selection.initialValues, values: selection.initialValues ?? [] });
                }}
            />
            <ProductsSelectGrid
                value={selection.values}
                onChange={(productIds) => {
                    setSelection({ initialValues: selection.initialValues, values: productIds.sort() });
                }}
            />
        </>
    );
}
