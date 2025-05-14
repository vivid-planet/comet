import { gql } from "@comet/site-next";

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
        }
    }
`;
