import { Badge } from "@mui/material";
import { ListItemProps } from "@mui/material/ListItem";
import { FC, ReactNode } from "react";
import { Link, LinkProps, Route } from "react-router-dom";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MenuItem, MenuItemProps } from "./Item";

interface MenuItemRouterLinkStandardProps
    extends ThemedComponentBaseProps<{
        badge: typeof Badge;
    }> {
    to: string;
    badgeContent?: ReactNode;
}

export type MenuItemRouterLinkProps = MenuItemRouterLinkStandardProps & MenuItemProps & ListItemProps & LinkProps;

export const MenuItemRouterLink = ({
    badgeContent,
    secondaryAction: passedSecondaryAction,
    slotProps,
    ...restProps
}: MenuItemRouterLinkProps) => {
    const tempSlotProps = { ...slotProps };
    const badge = tempSlotProps?.badge;
    delete tempSlotProps?.badge;

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
                return <MenuItem selected={!!match} secondaryAction={secondaryAction} component={Link} slotProps={tempSlotProps} {...restProps} />;
            }}
        </Route>
    );
};
