import { NavigationGroup } from "@dextinity/ui";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, useEffect, useMemo, useState } from "react";
import { matchPath, useLocation } from "react-router";

import { useMainNavigation } from "./Context";
import { type MainNavigationItemLevel, type MainNavigationItemProps, mainNavigationLabelClassName } from "./Item";
import type { MainNavigationItemRouterLinkProps } from "./ItemRouterLink";

export type MainNavigationChild = ReactElement<MainNavigationCollapsibleItemProps | MainNavigationItemRouterLinkProps | MainNavigationItemProps>;

export interface MainNavigationCollapsibleItemProps extends Omit<MainNavigationItemProps, "slotProps" | "children"> {
    children: MainNavigationChild | MainNavigationChild[];
    openByDefault?: boolean;
    isMenuOpen?: boolean;
    /** @deprecated The ui `NavigationGroup` shows its own indicator. */
    iconMapping?: {
        openDropdown?: ReactNode;
        closeDropdown?: ReactNode;
        firstLevelHoverIndicator?: ReactNode;
        secondLevelHoverIndicator?: ReactNode;
    };
}

function containsPath(children: ReactNode, pathname: string): boolean {
    return Children.toArray(children).some((child) => {
        if (!isValidElement<{ to?: string; children?: ReactNode }>(child)) {
            return false;
        }
        if (child.props.to !== undefined && matchPath(pathname, { path: child.props.to, strict: true })) {
            return true;
        }
        return containsPath(child.props.children, pathname);
    });
}

export const MainNavigationCollapsibleItem = ({
    level = 1,
    primary,
    isMenuOpen,
    icon,
    openByDefault,
    children,
    className,
    style,
}: MainNavigationCollapsibleItemProps) => {
    const location = useLocation();
    const { setOpen } = useMainNavigation();
    const hasSelectedChild = containsPath(children, location.pathname);
    const [isGroupOpen, setIsGroupOpen] = useState(Boolean(openByDefault) || hasSelectedChild);

    useEffect(() => {
        if (hasSelectedChild) {
            setIsGroupOpen(true);
        }
    }, [hasSelectedChild]);

    const childElements = useMemo(
        () =>
            Children.map(children, (child: MainNavigationChild) => {
                const childLevel = level + 1;
                return cloneElement<MainNavigationCollapsibleItemProps | MainNavigationItemRouterLinkProps | MainNavigationItemProps>(child, {
                    level: childLevel === 2 || childLevel === 3 ? (childLevel as MainNavigationItemLevel) : undefined,
                    isMenuOpen,
                });
            }),
        [children, isMenuOpen, level],
    );

    return (
        <NavigationGroup
            label={<span className={mainNavigationLabelClassName}>{primary}</span>}
            icon={level === 1 ? icon : undefined}
            // The collapsed navigation only shows the icons, so the group opens with the navigation.
            open={isMenuOpen === false ? false : isGroupOpen}
            onOpenChange={(open) => {
                if (isMenuOpen === false) {
                    setOpen(true);
                }
                setIsGroupOpen(open);
            }}
            className={className}
            style={style}
        >
            {childElements}
        </NavigationGroup>
    );
};
