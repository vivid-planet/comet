import { NavigationItem, type NavigationItemProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import type { ReactNode } from "react";

export type MainNavigationItemLevel = 1 | 2 | 3;

export interface MainNavigationItemProps extends Omit<NavigationItemProps, "children" | "icon" | "active"> {
    /** The level follows from the nesting in `MainNavigationCollapsibleItem`s. */
    level?: MainNavigationItemLevel;
    primary: ReactNode;
    secondary?: ReactNode;
    icon?: ReactNode;
    secondaryAction?: ReactNode;
    isMenuOpen?: boolean;
    isCollapsibleOpen?: boolean;
    hasSubitems?: boolean;
    /** Marks the item of the current page. */
    selected?: boolean;
}

/** Hidden visually while the navigation is collapsed to its icons, so the item keeps its name for screen readers. */
export const mainNavigationLabelClassName = "DextinityAdminMainNavigation-label";

const Secondary = styled("span")(
    ({ theme }) => css`
        display: block;
        color: ${theme.palette.text.secondary};
        font-size: 0.85em;
    `,
);

export const MainNavigationItem = ({
    primary,
    secondary,
    icon,
    level = 1,
    secondaryAction,
    isMenuOpen,
    isCollapsibleOpen,
    hasSubitems,
    selected,
    ...linkProps
}: MainNavigationItemProps) => {
    if (level > 3) {
        throw new Error("Maximum nesting level of 2 exceeded.");
    }

    return (
        <NavigationItem
            icon={level === 1 ? icon : undefined}
            active={selected}
            title={!isMenuOpen && typeof primary === "string" ? primary : undefined}
            {...linkProps}
        >
            <span className={mainNavigationLabelClassName}>
                {primary}
                {secondary && <Secondary>{secondary}</Secondary>}
            </span>
            {secondaryAction}
        </NavigationItem>
    );
};
