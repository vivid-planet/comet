import { gql } from "@comet/cms-site";

export const fragment = gql`
    fragment NewsDetailPage on News {
        title
        image
        createdAt
        content
    }
`;
