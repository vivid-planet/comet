import { gql } from "@apollo/client";

// TODO: import from "@comet/admin" once the types are generated correctly in `ProductForm.gql.generated.ts`
// import { finalFormFileUploadFragment } from "@comet/cms-admin";
const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUpload on PublicUpload {
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
        priceList {
            ...FinalFormFileUpload
        }
        datasheets {
            ...FinalFormFileUpload
        }
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
