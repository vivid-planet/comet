import { gql } from "@comet/site-nextjs";

export const fragment = gql`
    fragment NewsDetailPage on News {
        title
        image
        createdAt
        content
    }
`;
