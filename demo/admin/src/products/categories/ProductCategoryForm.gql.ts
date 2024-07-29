import { gql } from "@apollo/client";

export const productCategoryFormFragment = gql`
    fragment ProductCategoryForm on ProductCategory {
        title
        slug
    }
`;

export const productCategoryQuery = gql`
    query ProductCategory($id: ID!) {
        productCategory(id: $id) {
            id
            updatedAt
            ...ProductCategoryForm
        }
    }
    ${productCategoryFormFragment}
`;

export const productCategoryCheckForChangesQuery = gql`
    query CheckForChangesProductCategory($id: ID!) {
        productCategory(id: $id) {
            updatedAt
        }
    }
`;

export const createProductCategoryMutation = gql`
    mutation ProductCategoryFormCreateProductCategory($input: ProductCategoryInput!) {
        createProductCategory(input: $input) {
            id
            updatedAt
            ...ProductCategoryForm
        }
    }
    ${productCategoryFormFragment}
`;

export const updateProductCategoryMutation = gql`
    mutation ProductCategoryFormUpdateProductCategory($id: ID!, $input: ProductCategoryUpdateInput!) {
        updateProductCategory(id: $id, input: $input) {
            id
            updatedAt
            ...ProductCategoryForm
        }
    }
    ${productCategoryFormFragment}
`;
