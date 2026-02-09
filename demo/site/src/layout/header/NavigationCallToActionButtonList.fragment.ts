import { gql } from "@comet/site-nextjs";

export const navigationCallToActionButtonListFragment = gql`
    fragment NavigationCallToActionButtonList on NavigationCallToActionButtonList {
        id
        content
    }
`;
