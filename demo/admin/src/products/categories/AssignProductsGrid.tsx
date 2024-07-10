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
    const initialValues = data?.products.nodes ? data.products.nodes.map((product) => product.id).sort() : [];
    const [values, setValues] = useState<string[]>(initialValues);
    useEffect(() => {
        setValues(initialValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        refetchQueries: ["GetProductIdsForProductCategory"],
                    });
                    return true;
                }}
                hasChanges={!isEqual(initialValues, values)}
                doReset={() => {
                    setValues(initialValues);
                }}
            />
            <ProductsSelectGrid
                value={values}
                onChange={(productIds) => {
                    setValues(productIds.sort());
                }}
            />
        </>
    );
}
