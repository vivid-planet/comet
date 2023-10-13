import { Box, ComponentsOverrides, Theme, Tooltip, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { MenuChild, MenuCollapsibleItemProps } from "./CollapsibleItem";
import { MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuItemGroupClassKey = "root" | "title" | "titleContainer";

const styles = (theme: Theme) =>
    createStyles<MenuItemGroupClassKey, MenuItemGroupProps>({
        root: { marginTop: theme.spacing(8) },
        title: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: ({ isMenuOpen }) => (isMenuOpen ? 14 : 12),
            border: ({ isMenuOpen }) => (isMenuOpen ? `2px solid ${theme.palette.common.white}` : `2px solid ${theme.palette.grey[100]}`),
            borderRadius: ({ isMenuOpen }) => (isMenuOpen ? "initial" : 20),
            padding: ({ isMenuOpen }) => (isMenuOpen ? "0" : theme.spacing(0, 1.5)),
            lineHeight: "20px",
            color: ({ isMenuOpen }) => (isMenuOpen ? `${theme.palette.common.black}` : `${theme.palette.grey[300]}`),
        },
        titleContainer: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            display: "flex",
            justifyContent: ({ isMenuOpen }) => (isMenuOpen ? "flex-start" : "center"),
            padding: ({ isMenuOpen }) => `${theme.spacing(2)} ${isMenuOpen ? theme.spacing(4) : 0}`,
        },
    });

export interface MenuItemGroupProps {
    title: string;
    isMenuOpen?: boolean;
}

const ItemGroup: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuItemGroupProps>> = ({ title, children, classes, isMenuOpen }) => {
    const initialTitle = title;
    function getInitials(title: string) {
        const words = title.split(/\s+/).filter((word) => word.match(/[A-Za-z]/));
        return words.map((word) => word[0].toUpperCase()).join("");
    }

    if (isMenuOpen === false) {
        title = getInitials(title);
    }

    const childElements = React.Children.map(children, (child: MenuChild) => {
        return React.cloneElement<MenuCollapsibleItemProps | MenuItemRouterLinkProps | MenuItemProps>(child, {
            isMenuOpen,
        });
    });

    return (
        <Box className={classes.root}>
            <Tooltip
                placement="right"
                disableHoverListener={isMenuOpen}
                disableFocusListener={isMenuOpen}
                disableTouchListener={isMenuOpen}
                title={initialTitle}
            >
                <Box className={classes.titleContainer}>
                    <Typography className={classes.title} variant="h3">
                        {title}
                    </Typography>
                </Box>
            </Tooltip>
            {childElements}
        </Box>
    );
};

export const MenuItemGroup = withStyles(styles, { name: "CometAdminMenuItemGroup" })(ItemGroup);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMenuItemGroup: MenuItemGroupProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMenuItemGroup: MenuItemGroupClassKey;
    }

    interface Components {
        CometAdminMenuItemGroup?: {
            defaultProps?: ComponentsPropsList["CometAdminMenuItemGroup"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItemGroup"];
        };
    }
}
