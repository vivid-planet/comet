import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
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
        tags {
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
            ...ProductFormManual
        }
    }
    ${productFormFragment}
`;

export const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            updatedAt
            ...ProductFormManual
        }
    }
    ${productFormFragment}
`;

export const updateProductMutation = gql`
    mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!, $lastUpdatedAt: DateTime) {
        updateProduct(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
            id
            updatedAt
            ...ProductFormManual
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
        productCategories {
            nodes {
                ...ProductCategorySelect
            }
        }
    }
    ${productCategorySelectFragment}
`;

export const productTagsSelectFragment = gql`
    fragment ProductTagsSelect on ProductTag {
        id
        title
    }
`;

export const productTagsQuery = gql`
    query ProductTags {
        productTags {
            nodes {
                ...ProductTagsSelect
            }
        }
    }
    ${productTagsSelectFragment}
`;
