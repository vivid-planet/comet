import { graphql } from "@src/gql";

export const pageLinkFragment = graphql(/* GraphQL */ `
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
`);
