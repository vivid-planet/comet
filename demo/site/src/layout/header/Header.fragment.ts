import { gql } from "@comet/site-nextjs";

import { pageLinkFragment } from "./PageLink.fragment";

export const headerFragment = gql`
    fragment Header on MainMenu {
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
