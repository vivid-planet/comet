import { gql } from "@comet/site-react";

export const fragment = gql`
    fragment NewsDetailPage on News {
        title
        image
        createdAt
        content
    }
`;
