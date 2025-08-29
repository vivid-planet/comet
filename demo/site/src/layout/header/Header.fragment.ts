import { gql } from "@comet/site-nextjs";

import { desktopMenuFragment } from "./DesktopMenu.fragment";
import { mobileMenuFragment } from "./MobileMenu.fragment";

export const headerFragment = gql`
    fragment Header on MainMenu {
        ...DesktopMenu
        ...MobileMenu
    }
    ${desktopMenuFragment}
    ${mobileMenuFragment}
`;
