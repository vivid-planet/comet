import { gql } from "@apollo/client";
import { finalFormFileUploadDownloadableFragment } from "@comet/cms-admin";

export const productVariantFormFragment = gql`
    fragment ProductVariantFormManual on ProductVariant {
        name
        image {
            ...FinalFormFileUploadDownloadable
        }
    }
    ${finalFormFileUploadDownloadableFragment}
`;

export const productVariantFormQuery = gql`
    query ProductVariantForm($id: ID!) {
        productVariant(id: $id) {
            id
            updatedAt
            ...ProductVariantFormManual
        }
    }
    ${productVariantFormFragment}
`;

export const createProductVariantFormMutation = gql`
    mutation CreateProductVariant($product: ID!, $input: ProductVariantInput!) {
        createProductVariant(product: $product, input: $input) {
            id
            updatedAt
            ...ProductVariantFormManual
        }
    }
    ${productVariantFormFragment}
`;

export const updateProductVariantFormMutation = gql`
    mutation UpdateProductVariant($id: ID!, $input: ProductVariantUpdateInput!) {
        updateProductVariant(id: $id, input: $input) {
            id
            updatedAt
            ...ProductVariantFormManual
        }
    }
    ${productVariantFormFragment}
`;
