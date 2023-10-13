import { Box, ComponentsOverrides, Theme, Tooltip, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type MenuItemGroupClassKey = "root" | "title" | "titleContainer";

const styles = (theme: Theme) =>
    createStyles<MenuItemGroupClassKey, MenuItemGroupProps>({
        root: { marginTop: theme.spacing(8) },
        title: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: ({ drawerOpen }) => (drawerOpen ? 14 : 12),
            border: ({ drawerOpen }) => (drawerOpen ? `2px solid ${theme.palette.common.white}` : `2px solid ${theme.palette.grey[100]}`),
            borderRadius: ({ drawerOpen }) => (drawerOpen ? "initial" : 20),
            padding: ({ drawerOpen }) => (drawerOpen ? "0" : theme.spacing(2, 4)),
            lineHeight: "20px",
            color: ({ drawerOpen }) => (drawerOpen ? `${theme.palette.common.black}` : `${theme.palette.grey[300]}`),
        },
        titleContainer: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            display: "flex",
            justifyContent: ({ drawerOpen }) => (drawerOpen ? "flex-start" : "center"),
            padding: ({ drawerOpen }) => `${theme.spacing(2)} ${drawerOpen ? theme.spacing(4) : 0}`,
        },
    });

export interface MenuItemGroupProps {
    title: string;
    drawerOpen?: boolean;
}

const ItemGroup: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuItemGroupProps>> = ({ title, children, classes, drawerOpen }) => {
    const initialTitle = title;
    function getInitials(title: string) {
        const words = title.split(/\s+/).filter((word) => word.match(/[A-Za-z]/));
        return words.map((word) => word[0].toUpperCase()).join("");
    }

    if (drawerOpen === false) {
        title = getInitials(title);
    }

    return (
        <Box className={classes.root}>
            <Tooltip
                placement="right"
                disableHoverListener={drawerOpen}
                disableFocusListener={drawerOpen}
                disableTouchListener={drawerOpen}
                title={initialTitle}
            >
                <Box className={classes.titleContainer}>
                    <Typography className={classes.title} variant="h3">
                        {title}
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
