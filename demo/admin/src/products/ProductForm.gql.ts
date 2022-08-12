import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormFragment on Product {
        name
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
    mutation CreateProduct($data: ProductInput!) {
        addProduct(data: $data) {
            ...ProductFormFragment
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation UpdateProduct($id: ID!, $data: ProductInput!) {
        updateProduct(id: $id, data: $data) {
            ...ProductFormFragment
        }
    }
    ${productFormFragment}
`;
