import { Box, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type MenuItemGroupClassKey = "root" | "groupTitle";

const styles = (theme: Theme) =>
    createStyles<MenuItemGroupClassKey, MenuItemGroupProps>({
        root: { marginTop: theme.spacing(8) },
        groupTitle: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: 14,
            lineHeight: "20px",
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            padding: theme.spacing(2, 4),
        },
    });

export interface MenuItemGroupProps {
    title?: string;
}

const ItemGroup: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuItemGroupProps>> = ({ title, children, classes }) => {
    return (
        <Box className={classes.root}>
            <Typography className={classes.groupTitle} variant="h3">
                {title}
            </Typography>
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
