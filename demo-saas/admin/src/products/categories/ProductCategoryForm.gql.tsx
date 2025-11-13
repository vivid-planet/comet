import { gql } from "@apollo/client";

export const productCategoryFormFragment = gql`
    fragment ProductCategoryFormHandmade on ProductCategory {
        title
        slug
    }
`;
export const productCategoryQuery = gql`
    query ProductCategory($id: ID!) {
        productCategory(id: $id) {
            id
            updatedAt
            ...ProductCategoryFormHandmade
        }
    }
    ${productCategoryFormFragment}
`;
export const createProductCategoryMutation = gql`
    mutation CreateProductCategory($input: ProductCategoryInput!) {
        createProductCategory(input: $input) {
            id
            updatedAt
            ...ProductCategoryFormHandmade
        }
    }
    ${productCategoryFormFragment}
`;
export const updateProductCategoryMutation = gql`
    mutation UpdateProductCategory($id: ID!, $input: ProductCategoryUpdateInput!) {
        updateProductCategory(id: $id, input: $input) {
            id
            updatedAt
            ...ProductCategoryFormHandmade
        }
    }
    ${productCategoryFormFragment}
`;
