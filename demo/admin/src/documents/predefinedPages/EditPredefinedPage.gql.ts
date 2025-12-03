import { gql } from "@apollo/client";

const predefinedPageFormFragment = gql`
    fragment PredefinedPageForm on PredefinedPage {
        type
    }
`;

export const predefinedPageQuery = gql`
    query PredefinedPage($pageTreeNodeId: ID!) {
        pageTreeNode(id: $pageTreeNodeId) {
            id
            document {
                __typename
                ... on DocumentInterface {
                    id
                    updatedAt
                }
                ... on PredefinedPage {
                    ...PredefinedPageForm
                }
            }
        }
    }
    ${predefinedPageFormFragment}
`;

export const savePredefinedPageMutation = gql`
    mutation SavePredefinedPage($id: ID!, $input: PredefinedPageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
        savePredefinedPage(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
            id
            updatedAt
            ...PredefinedPageForm
        }
    }
    ${predefinedPageFormFragment}
`;
