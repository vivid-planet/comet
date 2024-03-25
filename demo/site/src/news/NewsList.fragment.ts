import { gql } from "graphql-request";

export const newsListFragment = gql`
    fragment NewsList on PaginatedNews {
        nodes {
            id
            title
            slug
            image
            createdAt
        }
    }
`;
