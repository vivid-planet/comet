import { ListItem, ListItemIcon, ListItemProps, ListItemText, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { MenuLevel } from "./CollapsibleItem";
import { MenuContext } from "./Context";

export type MenuItemClassKey = "root" | "level1" | "level2" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction";

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

const styles = (theme: Theme) =>
    createStyles<MenuItemClassKey, MenuItemProps & MuiListItemProps>({
        root: {
            flexShrink: 0,
            "&:after": {
                content: "''",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 2,
            },
            "& [class*='MuiListItemIcon-root']": {
                color: colors.textLevel1,
                minWidth: 28,
            },
            "& [class*='MuiListItemText-inset']": {
                paddingLeft: 28,
            },
            "& [class*='MuiSvgIcon-root']": {
                fontSize: 16,
            },
        },
        level1: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            boxSizing: "border-box",
            color: colors.textLevel1,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.grey[50],
                color: theme.palette.primary.main,
                "&:after": {
                    backgroundColor: theme.palette.primary.main,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightMedium,
                fontSize: 16,
                lineHeight: "20px",
            },
        },
        level2: {
            color: colors.textLevel2,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            "&:last-child": {
                borderBottom: `1px solid ${theme.palette.grey[50]}`,
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                "&:after": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightBold,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: 14,
                lineHeight: "20px",
            },
        },
        hasIcon: {},
        hasSecondaryText: {},
        hasSecondaryAction: {
            paddingRight: 18,
        },
    });

export interface MenuItemProps extends MenuLevel {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
}

type MuiListItemProps = Pick<ListItemProps, Exclude<keyof ListItemProps, "innerRef" | "button">> & { component?: React.ElementType };

const Item: React.FC<WithStyles<typeof styles> & MenuItemProps & MuiListItemProps> = ({
    classes,
    primary,
    secondary,
    icon,
    level = 1,
    secondaryAction,
    ...otherProps
}) => {
    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");
    if (level > 2) throw new Error("Maximum nesting level of 2 exceeded.");

    const hasIcon = !!icon;

    const listItemClasses = [classes.root];
    if (level === 1) listItemClasses.push(classes.level1);
    if (level === 2) listItemClasses.push(classes.level2);
    if (hasIcon) listItemClasses.push(classes.hasIcon);
    if (secondary) listItemClasses.push(classes.hasSecondaryText);
    if (secondaryAction) listItemClasses.push(classes.hasSecondaryAction);

    return (
        <ListItem component="div" button classes={{ root: listItemClasses.join(" ") }} {...otherProps}>
            {hasIcon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={primary} secondary={secondary} inset={!icon} />
            {!!secondaryAction && secondaryAction}
        </ListItem>
    );
};

export const MenuItem = withStyles(styles, { name: "CometAdminMenuItem" })(Item);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminMenuItem: MenuItemClassKey;
    }
}
