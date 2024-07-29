import { gql } from "@apollo/client";

export const productFormFragment = gql`
    fragment ProductFormManual on Product {
        title
        slug
        description
        type
        additionalTypes
        inStock
        image
        manufacturerCountry: manufacturer {
            addressAsEmbeddable {
                country
            }
        }
        manufacturer {
            id
            name
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
`;

export const productQuery = gql`
    query Product($id: UUID!) {
        productById2(id: $id) {
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
