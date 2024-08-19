import { gql } from "@apollo/client";

export const productVariantFormFragment = gql`
    fragment ProductVariantForm on ProductVariant {
        name
        image
    }
`;

export const productVariantFormQuery = gql`
    query ProductVariantForm($id: ID!) {
        productVariant(id: $id) {
            id
            updatedAt
            ...ProductVariantForm
        }
    }
    ${productVariantFormFragment}
`;

export const createProductVariantFormMutation = gql`
    mutation CreateProductVariant($product: ID!, $input: ProductVariantInput!) {
        createProductVariant(product: $product, input: $input) {
            id
            updatedAt
            ...ProductVariantForm
        }
    }
    ${productVariantFormFragment}
`;

export const updateProductVariantFormMutation = gql`
    mutation UpdateProductVariant($id: ID!, $input: ProductVariantUpdateInput!) {
        updateProductVariant(id: $id, input: $input) {
            id
            updatedAt
            ...ProductVariantForm
        }
    }
    ${productVariantFormFragment}
`;
