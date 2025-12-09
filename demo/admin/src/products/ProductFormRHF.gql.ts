import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormRHF on Product {
        title
        price
        category {
            id
            title
        }
        statistics {
            views
        }
    }
`;

export const productQuery = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            updatedAt
            ...ProductFormRHF
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            updatedAt
            ...ProductFormRHF
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
        updateProduct(id: $id, input: $input) {
            id
            updatedAt
            ...ProductFormRHF
        }
    }
    ${productFormFragment}
`;
