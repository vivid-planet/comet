import { gql } from "@comet/site-react";

export const desktopMenuFragment = gql`
    fragment DesktopMenu on MainMenu {
        items {
            id
            node {
                id
                name
                ...PageLink
                childNodes {
                    id
                    name
                    ...PageLink
                }
            }
        }
    }
`;
