import { gql } from "@apollo/client";
import { finalFormFileUploadFragment } from "@comet/cms-admin";

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
        title
        slug
        description
        type
        additionalTypes
        inStock
        flammable
        image
        priceList {
            ...FinalFormFileUpload
        }
        datasheets {
            ...FinalFormFileUpload
        }
        manufacturer {
            id
            name
            addressAsEmbeddable {
                country
            }
        }
        category {
            id
            title
        }
        tags {
            id
            title
        }
        priceRange {
            min
            max
        }
        lastCheckedAt
        dimensions {
            width
            height
            depth
        }
        availableSince
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
