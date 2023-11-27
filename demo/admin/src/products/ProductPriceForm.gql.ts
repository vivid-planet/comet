import { gql } from "@apollo/client";

export const productPriceFormFragment = gql`
    fragment ProductPriceForm on Product {
        price
    }
`;

export const productPriceFormQuery = gql`
    query ProductPriceForm($id: ID!) {
        product(id: $id) {
            id
            updatedAt
            ...ProductPriceForm
        }
    }
    ${productPriceFormFragment}
`;

export const updateProductPriceFormMutation = gql`
    mutation ProductPriceFormUpdateProduct($id: ID!, $input: ProductUpdateInput!, $lastUpdatedAt: DateTime) {
        updateProduct(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
            id
            updatedAt
            ...ProductPriceForm
        }
    }
    ${productPriceFormFragment}
`;
