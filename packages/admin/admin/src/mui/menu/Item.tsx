import { ComponentsOverrides, ListItem, ListItemIcon, ListItemProps, ListItemText, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { MenuLevel } from "./CollapsibleItem";
import { MenuItemClassKey, styles } from "./Item.styles";

export interface MenuItemProps extends MenuLevel {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
    isMenuOpen?: boolean;
    isCollapsibleOpen?: boolean;
    hasSubitems?: boolean;
}

export type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef" | "button">> & { component?: React.ElementType };

const Item: React.FC<WithStyles<typeof styles> & MenuItemProps & MuiListItemProps> = ({
    classes,
    primary,
    secondary,
    icon,
    level = 1,
    secondaryAction,
    isMenuOpen,
    hasSubitems,
    isCollapsibleOpen,
    ...otherProps
}) => {
    if (level > 3) throw new Error("Maximum nesting level of 2 exceeded.");

    const showIcon = !!icon && level === 1;
    const showText = isMenuOpen || level !== 1;

    const listItemClasses = [classes.root];
    if (level === 1) listItemClasses.push(classes.level1);
    if (level === 2) listItemClasses.push(classes.level2);
    if (level === 3) listItemClasses.push(classes.level3);
    if (level === 3 && isMenuOpen) listItemClasses.push(classes.level3Enumeration);
    if (showIcon) listItemClasses.push(classes.hasIcon);
    if (secondary) listItemClasses.push(classes.hasSecondaryText);
    if (secondaryAction) listItemClasses.push(classes.hasSecondaryAction);

    return (
        <ListItem component="div" button classes={{ root: listItemClasses.join(" ") }} {...otherProps}>
            {showIcon && <ListItemIcon sx={{ my: 1.25 }}>{icon}</ListItemIcon>}
            {showText && <ListItemText primary={primary} secondary={secondary} inset={!icon} />}
            {!!secondaryAction && secondaryAction}
        </ListItem>
    );
};

export const MenuItem = withStyles(styles, { name: "CometAdminMenuItem" })(Item);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuItem: MenuItemClassKey;
    }

    interface Components {
        CometAdminMenuItem?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItem"];
        };
    }
}
