import { ComponentsOverrides, ListItem, ListItemIcon, ListItemProps, ListItemText, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { MenuLevel } from "./CollapsibleItem";
import { MenuContext } from "./Context";
import { MenuItemClassKey, styles } from "./Item.styles";

export interface MenuItemProps extends MenuLevel {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
    showText?: boolean;
    isMenuOpen?: boolean;
    isCollapsibleOpen?: boolean;
    hasChildElements?: boolean;
}

export type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef" | "button">> & { component?: React.ElementType };

const Item: React.FC<WithStyles<typeof styles> & MenuItemProps & MuiListItemProps> = ({
    classes,
    primary,
    secondary,
    icon,
    level = 1,
    secondaryAction,
    showText,
    isMenuOpen,
    ...otherProps
}) => {
    showText = isMenuOpen ? showText || true : level === 2 || level === 3 ? showText || true : false;
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");
    if (level > 3) throw new Error("Maximum nesting level of 2 exceeded.");

    const showIcon = Boolean(icon) && (level === 1 || isMenuOpen);

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
            {showText && <ListItemText primary={primary} secondary={secondary} inset={!showIcon} />}
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
