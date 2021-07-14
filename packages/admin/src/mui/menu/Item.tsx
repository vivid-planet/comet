import { ListItem, ListItemIcon, ListItemProps, ListItemText, Theme } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { MenuLevel } from "./CollapsibleItem";
import { MenuContext } from "./Context";

export type CometAdminMenuItemClassKeys = "root" | "level1" | "level2" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction";

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

const styles = (theme: Theme) =>
    createStyles<CometAdminMenuItemClassKeys, any>({
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

const Item: React.FC<WithStyles<typeof styles, false> & MenuItemProps & MuiListItemProps> = ({
    classes,
    theme,
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

    const listItemClasses = [classes.root, classes[`level${level}`]];
    if (hasIcon) listItemClasses.push(classes.hasIcon);
    if (secondary) listItemClasses.push(classes.hasSecondaryText);
    if (secondaryAction) listItemClasses.push(classes.hasSecondaryAction);

    return (
        <ListItem button {...otherProps} className={listItemClasses.join(" ")}>
            {hasIcon && <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>}
            <ListItemText primary={primary} secondary={secondary} inset={!icon} />
            {!!secondaryAction && secondaryAction}
        </ListItem>
    );
};

export const MenuItem = withStyles(styles, { name: "CometAdminMenuItem", withTheme: true })(Item);
