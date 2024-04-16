import { gql } from "@comet/cms-site";

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
