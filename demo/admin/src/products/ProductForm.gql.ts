import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
        title
        slug
        description
        type
        inStock
        image
        category {
            id
            title
        }
        manufacturer {
            id
            address {
                street
                country
            }
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

export const productManufacturerSelectFragment = gql`
    fragment ProductManufacturerSelect on Manufacturer {
        id
        address {
            street
        }
    }
`;
export const productManufacturersQuery = gql`
    query ProductManufacturers($filter: ManufacturerFilter) {
        manufacturers(filter: $filter) {
            nodes {
                ...ProductManufacturerSelect
            }
        }
    }
    ${productManufacturerSelectFragment}
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
