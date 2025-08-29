import { gql } from "@comet/site-nextjs";

import { pageLinkFragment } from "./PageLink.fragment";

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

    ${pageLinkFragment}
`;
