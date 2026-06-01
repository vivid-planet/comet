import { gql } from "graphql-request";

export const getPageTreeNodeQuery = gql`
    query GetNode($id: ID!) {
        pageTreeNode(id: $id) {
            id
            name
            slug
            path
            visibility
            documentType
            parentId
            category
            hideInMenu
            pos
            numberOfDescendants
            childNodes {
                id
                name
                slug
                path
                visibility
                documentType
            }
            parentNodes {
                id
                name
                slug
            }
            document {
                __typename
                ... on Page {
                    id
                }
                ... on Link {
                    id
                }
            }
            scope {
                domain
                language
            }
        }
    }
`;
