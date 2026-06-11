import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
        title
        slug
    }
`;

export const productQuery = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            updatedAt
            ...ProductFormManual
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            product {
                id
                updatedAt
                ...ProductFormManual
            }
            errors {
                code
                field
            }
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
        updateProduct(id: $id, input: $input) {
            id
            updatedAt
            ...ProductFormManual
        }
    }
    ${productFormFragment}
`;
