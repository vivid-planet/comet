import { pageLinkFragment } from "./PageLink.fragment";

export const headerFragment = /* GraphQL */ `
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
