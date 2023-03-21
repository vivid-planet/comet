import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductForm on Product {
        title
        slug
        description
        price
        type
        inStock
    }
`;

export const productQuery = gql`
    query Product($id: ID!) {
        product(id: $id) {
            ...ProductForm
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation ProductFormCreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            ...ProductForm
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation ProductFormUpdateProduct($id: ID!, $input: ProductInput!) {
        updateProduct(id: $id, input: $input) {
            ...ProductForm
        }
    }
    ${productFormFragment}
`;
