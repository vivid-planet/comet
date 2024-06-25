import { gql } from "@apollo/client";

// TODO: import from "@comet/admin" once the types are generated correctly in `ProductForm.gql.generated.ts`
// import { finalFormFileUploadFragment } from "@comet/admin";
const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUploadFragment on PublicUpload {
        id
        name
        size
    }
`;

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
        title
        slug
        description
        type
        additionalTypes
        inStock
        image
        factsheet {
            ...FinalFormFileUploadFragment
        }
        datasheets {
            ...FinalFormFileUploadFragment
        }
        category {
            id
            title
        }
        tags {
            id
            title
        }
    }
    ${finalFormFileUploadFragment}
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
    mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
        updateProduct(id: $id, input: $input) {
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
