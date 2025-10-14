import { gql } from "@comet/site-nextjs";

export const pageTreeIndexFragment = gql`
    fragment PageTreeIndex on MainMenu {
        items {
            id
            node {
                id
                name
                path
                childNodes {
                    id
                    name
                    path
                }
            }
        }
    }
`;
