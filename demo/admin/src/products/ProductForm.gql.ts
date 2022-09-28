import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormFragment on Product {
        title
        slug
        description
        price
    }
`;

export const productQuery = gql`
    query Product($id: ID!) {
        product(id: $id) {
            ...ProductFormFragment
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation ProductFormCreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            ...ProductFormFragment
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation ProductFormUpdateProduct($id: ID!, $input: ProductInput!) {
        updateProduct(id: $id, input: $input) {
            ...ProductFormFragment
        }
    }
    ${productFormFragment}
`;
