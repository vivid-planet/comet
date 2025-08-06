import { gql } from "@comet/site-nextjs";

export const mobileMenuFragment = gql`
    fragment MobileMenu on PageTreeNode {
        id
        name
        ...PageLink
        childNodes {
            id
            name
            hideInMenu
            ...PageLink
        }
    }
`;
