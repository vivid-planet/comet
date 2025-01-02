import { Badge } from "@mui/material";
import { ListItemProps } from "@mui/material/ListItem";
import { ReactNode } from "react";
import { Link, LinkProps, Route } from "react-router-dom";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MainNavigationItem, MainNavigationItemProps } from "./Item";

interface MainNavigationRouterLinkItemStandardProps
    extends ThemedComponentBaseProps<{
        badge: typeof Badge;
    }> {
    to: string;
    badgeContent?: ReactNode;
}

export type MainNavigationItemRouterLinkProps = MainNavigationRouterLinkItemStandardProps & MainNavigationItemProps & ListItemProps & LinkProps;

export const MainNavigationItemRouterLink = ({
    badgeContent,
    secondaryAction: passedSecondaryAction,
    slotProps,
    ...restProps
}: MainNavigationItemRouterLinkProps) => {
    const { badge, ...mainNavigationItemSlotProps } = slotProps ?? {};

    const secondaryAction = badgeContent ? ( // prioritize badgeContent over passed secondaryAction
        <Badge
            variant={restProps.isMenuOpen ? "standard" : "dot"}
            color="error"
            overlap="circular"
            {...badge}
            badgeContent={badgeContent}
            sx={{ marginLeft: 2, ...badge?.sx }}
        />
    ) : (
        passedSecondaryAction
    );

    return (
        <Route path={restProps.to} strict={false}>
            {({ match }) => {
                return (
                    <MainNavigationItem
                        selected={!!match}
                        secondaryAction={secondaryAction}
                        component={Link}
                        slotProps={mainNavigationItemSlotProps}
                        {...restProps}
                    />
                );
            }}
        </Route>
    );
};
