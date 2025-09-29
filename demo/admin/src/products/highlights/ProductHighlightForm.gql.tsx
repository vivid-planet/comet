import { gql } from "@apollo/client";

export const productHighlightFormFragment = gql`
    fragment ProductHighlightFormHandmadeDetails on ProductHighlight {
        description
        product {
            id
            title
            category {
                id
                title
            }
        }
    }
`;
export const productHighlightQuery = gql`
    query ProductHighlight($id: ID!) {
        productHighlight(id: $id) {
            id
            updatedAt
            ...ProductHighlightFormHandmadeDetails
        }
    }
    ${productHighlightFormFragment}
`;
export const createProductHighlightMutation = gql`
    mutation CreateProductHighlight($input: ProductHighlightInput!) {
        createProductHighlight(input: $input) {
            id
            updatedAt
            ...ProductHighlightFormHandmadeDetails
        }
    }
    ${productHighlightFormFragment}
`;
export const updateProductHighlightMutation = gql`
    mutation UpdateProductHighlight($id: ID!, $input: ProductHighlightUpdateInput!) {
        updateProductHighlight(id: $id, input: $input) {
            id
            updatedAt
            ...ProductHighlightFormHandmadeDetails
        }
    }
    ${productHighlightFormFragment}
`;
