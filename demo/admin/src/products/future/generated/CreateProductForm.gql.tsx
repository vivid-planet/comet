// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { gql } from "@apollo/client";

export const productCategoriesSelectFragment = gql`
    fragment ProductCategorySelect on ProductCategory {
        id
        title
    }
`;
export const productCategoriesQuery = gql`
    query ProductCategoriesSelect {
        productCategories {
            nodes {
                ...ProductCategorySelect
            }
        }
    }
    ${productCategoriesSelectFragment}
`;
export const productFormFragment = gql`
    fragment ProductFormDetails on Product {
        title
        slug
        createdAt
        description
        type
        category {
            id
            title
        }
        inStock
        availableSince
        image
    }
`;
export const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            updatedAt
            ...ProductFormDetails
        }
    }
    ${productFormFragment}
`;