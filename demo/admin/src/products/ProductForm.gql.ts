import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductForm on Product {
        title
        slug
        description
        price
        type
        inStock
        image
        category {
            id
            title
        }
    }
`;

export const productQuery = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            updatedAt
            ...ProductForm
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation ProductFormCreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            updatedAt
            ...ProductForm
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation ProductFormUpdateProduct($id: ID!, $input: ProductInput!, $lastUpdatedAt: DateTime) {
        updateProduct(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
            id
            updatedAt
            ...ProductForm
        }
    }
    ${productFormFragment}
`;

export const productCategorySelectFragment = gql`
    fragment ProductCategorySelect on ProductCategory {
        id
        title
    }
`;

export const productCategoriesQuery = gql`
    query ProductCategories {
        productCategorys {
            nodes {
                ...ProductCategorySelect
            }
        }
    }
    ${productCategorySelectFragment}
`;
