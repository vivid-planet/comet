import { Badge } from "@mui/material";
import { ListItemProps } from "@mui/material/ListItem";
import * as React from "react";
import { Link, LinkProps, Route } from "react-router-dom";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MenuItem, MenuItemProps } from "./Item";

interface MenuItemRouterLinkStandardProps
    extends ThemedComponentBaseProps<{
        badge: typeof Badge;
    }> {
    to: string;
    badgeContent?: React.ReactNode;
}

export type MenuItemRouterLinkProps = MenuItemRouterLinkStandardProps & MenuItemProps & ListItemProps & LinkProps;

export const MenuItemRouterLink: React.FC<MenuItemRouterLinkProps> = ({ badgeContent, secondaryAction, slotProps, ...restProps }) => {
    const tempSlotProps = { ...slotProps };
    const badge = tempSlotProps?.badge;
    delete tempSlotProps?.badge;

    const computedSecondaryAction = badgeContent ? (
        <Badge
            variant={restProps.isMenuOpen ? "standard" : "dot"}
            color="error"
            overlap="circular"
            {...badge}
            badgeContent={badgeContent}
            sx={{ marginLeft: 2, ...badge?.sx }}
        />
    ) : (
        secondaryAction
    );

    return (
        <Route path={restProps.to} strict={false}>
            {({ match }) => {
                return (
                    <MenuItem
                        selected={!!match}
                        secondaryAction={computedSecondaryAction}
                        component={Link}
                        slotProps={tempSlotProps}
                        {...restProps}
                    />
                );
            }}
        </Route>
    );
};
