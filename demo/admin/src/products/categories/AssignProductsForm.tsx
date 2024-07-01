import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm } from "@comet/admin";
import { Box, CircularProgress } from "@mui/material";
import {
    GQLGetProductIdsForProductCategoryQuery,
    GQLGetProductIdsForProductCategoryQueryVariables,
    GQLSetProductCategoryMutation,
    GQLSetProductCategoryMutationVariables,
} from "@src/products/categories/AssignProductsForm.generated";
import { ProductsSelectGrid } from "@src/products/categories/ProductsSelectGrid";
import isEqual from "lodash.isequal";
import React from "react";
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

export function AssignProductsForm({ productCategoryId }: FormProps): React.ReactElement {
    const client = useApolloClient();

    const { data, error, loading } = useQuery<GQLGetProductIdsForProductCategoryQuery, GQLGetProductIdsForProductCategoryQueryVariables>(
        getProductIdsForProductCategory,
        {
            variables: { id: productCategoryId },
        },
    );
    if (error) return <FormattedMessage id="common.error" defaultMessage="An error has occured. Please try again at later" />;
    if (loading) return <CircularProgress />;

    const initialValues = {
        productIds: (data?.products.nodes ?? []).map((product) => product.id),
    };
    return (
        <FinalForm<{ productIds: string[] }>
            mode="edit"
            onSubmit={async (values, form, event) => {
                await client.mutate<GQLSetProductCategoryMutation, GQLSetProductCategoryMutationVariables>({
                    mutation: setProductCategoryMutation,
                    variables: { id: productCategoryId, input: values.productIds },
                });
            }}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            subscription={{}}
        >
            {({ handleSubmit, submitting }) => {
                return (
                    <Field name="productIds" fullWidth>
                        {(props) => (
                            // TODO: height should be defined by parent, but is required because of nesting in field. use FinalFormField directly?
                            <Box sx={{ height: "70vh" }}>
                                <ProductsSelectGrid {...props} />
                            </Box>
                        )}
                    </Field>
                );
            }}
        </FinalForm>
    );
}
