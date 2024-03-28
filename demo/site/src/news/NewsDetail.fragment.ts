import { gql } from "graphql-request";

export const newsDetailFragment = gql`
    fragment NewsDetail on News {
        id
        title
        image
        createdAt
        content
    }
`;
