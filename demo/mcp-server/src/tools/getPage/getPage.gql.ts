import { gql } from "graphql-request";

export const getPageQuery = gql`
    query GetPage($id: ID!) {
        page(id: $id) {
            id
            content
            seo
            stage
            updatedAt
        }
    }
`;
