import { gql } from "@src/util/graphQLClient";

export const pageLinkFragment = gql`
    fragment PageLink on PageTreeNode {
        path
        documentType
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
