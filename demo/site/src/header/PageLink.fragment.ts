import { gql } from "graphql-request";

export const pageLinkFragment = gql`
    fragment PageLink on PageTreeNode {
        path
        documentType
        scope {
            language
        }
        document {
            __typename
            ... on Link {
                content
            }
            ... on PredefinedPage {
                type
            }
        }
    }
`;
