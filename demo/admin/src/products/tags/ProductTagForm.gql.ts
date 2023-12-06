import { gql } from "@apollo/client";

export const productTagFormFragment = gql`
    fragment ProductTagForm on ProductTag {
        title
    }
`;

export const productTagQuery = gql`
    query ProductTag($id: ID!) {
        productTag(id: $id) {
            id
            updatedAt
            ...ProductTagForm
        }
    }
    ${productTagFormFragment}
`;

export const productTagCheckForChangesQuery = gql`
    query CheckForChangesProductTag($id: ID!) {
        productTag(id: $id) {
            updatedAt
        }
    }
`;

export const createProductTagMutation = gql`
    mutation ProductTagFormCreateProductTag($input: ProductTagInput!) {
        createProductTag(input: $input) {
            id
            updatedAt
            ...ProductTagForm
        }
    }
    ${productTagFormFragment}
`;

export const updateProductTagMutation = gql`
    mutation ProductTagFormUpdateProductTag($id: ID!, $input: ProductTagUpdateInput!, $lastUpdatedAt: DateTime) {
        updateProductTag(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
            id
            updatedAt
            ...ProductTagForm
        }
    }
    ${productTagFormFragment}
`;
