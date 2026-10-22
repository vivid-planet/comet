import { Chip } from "@dextinity/ui";
import type { ReactNode } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import { MainNavigationItem, type MainNavigationItemProps } from "./Item";

export interface MainNavigationItemRouterLinkProps extends Omit<MainNavigationItemProps, "href" | "render"> {
    to: string;
    badgeContent?: ReactNode;
}

export const MainNavigationItemRouterLink = ({ to, badgeContent, secondaryAction, ...itemProps }: MainNavigationItemRouterLinkProps) => {
    const match = useRouteMatch({ path: to, strict: false });

    return (
        <MainNavigationItem
            render={<Link to={to} />}
            selected={Boolean(match)}
            secondaryAction={badgeContent ? <Chip tone="danger">{badgeContent}</Chip> : secondaryAction}
            {...itemProps}
        />
    );
};
