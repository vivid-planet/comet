import { Icon } from "@dextinity/ui";

import { MainNavigationItem, type MainNavigationItemProps } from "./Item";

export type MainNavigationItemAnchorLinkProps = MainNavigationItemProps;

export const MainNavigationItemAnchorLink = ({ secondaryAction, isMenuOpen, ...itemProps }: MainNavigationItemAnchorLinkProps) => (
    <MainNavigationItem
        selected={false}
        // don't use ?? to allow null as value and with that an empty secondaryAction
        secondaryAction={secondaryAction !== undefined ? secondaryAction : isMenuOpen && <Icon name="external-link" />}
        isMenuOpen={isMenuOpen}
        {...itemProps}
    />
);
