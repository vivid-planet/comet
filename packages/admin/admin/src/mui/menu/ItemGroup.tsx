import { Box, ComponentsOverrides, Theme, Tooltip, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { MenuContext } from "./Context";

export type MenuItemGroupClassKey = "root" | "title" | "titleMenuOpen" | "titleContainer" | "titleContainerMenuOpen";

const styles = (theme: Theme) =>
    createStyles<MenuItemGroupClassKey, MenuItemGroupProps>({
        root: { marginTop: theme.spacing(8) },
        title: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: 12,
            border: `2px solid ${theme.palette.grey[100]}`,
            borderRadius: 20,
            padding: theme.spacing(0.5, 2),
            lineHeight: "20px",
            color: `${theme.palette.grey[300]}`,
        },
        titleMenuOpen: {
            fontSize: 14,
            border: `2px solid ${theme.palette.common.white}`,
            borderRadius: "initial",
            padding: 0,
            color: theme.palette.common.black,
        },
        titleContainer: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            display: "flex",
            justifyContent: "center",
            padding: `${theme.spacing(2)} 0`,
        },
        titleContainerMenuOpen: {
            justifyContent: "flex-start",
            padding: theme.spacing(2, 4),
        },
    });

export interface MenuItemGroupProps {
    title: string;
    shortTitle?: string;
}

const ItemGroup: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuItemGroupProps>> = ({ title, shortTitle, children, classes }) => {
    const { open: menuOpen } = React.useContext(MenuContext);
    let displayedTitle = title;
    function getInitials(title: string) {
        const words = title.split(/\s+/).filter((word) => word.match(/[A-Za-z]/));
        return words.map((word) => word[0].toUpperCase()).join("");
    }

    if (!menuOpen) {
        displayedTitle = shortTitle || getInitials(title);
    }

    return (
        <Box className={classes.root}>
            <Tooltip placement="right" disableHoverListener={menuOpen} disableFocusListener={menuOpen} disableTouchListener={menuOpen} title={title}>
                <Box className={clsx(classes.titleContainer, menuOpen && classes.titleContainerMenuOpen)}>
                    <Typography className={clsx(classes.title, menuOpen && classes.titleMenuOpen)} variant="h3">
                        {displayedTitle}
                    </Typography>
                </Box>
            </Tooltip>
            {children}
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
