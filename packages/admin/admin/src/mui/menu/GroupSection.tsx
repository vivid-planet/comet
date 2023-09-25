import { Box, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type MenuGroupSectionClassKey = "root" | "sectionTitle";

const styles = (theme: Theme) =>
    createStyles<MenuGroupSectionClassKey, MenuGroupSectionProps>({
        root: { marginTop: theme.spacing(8) },
        sectionTitle: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: 14,
            lineHeight: "20px",
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            padding: theme.spacing(2, 4),
        },
    });

export interface MenuGroupSectionProps {
    title?: string;
}

const GroupSection: React.FC<React.PropsWithChildren<WithStyles<typeof styles> & MenuGroupSectionProps>> = ({ title, children, classes }) => {
    return (
        <Box className={classes.root}>
            <Typography className={classes.sectionTitle} variant="h3">
                {title}
            </Typography>
            {children}
        </Box>
    );
};

export const MenuGroupSection = withStyles(styles, { name: "CometAdminMenuGroupSection" })(GroupSection);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMenuGroupSection: MenuGroupSectionProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMenuGroupSection: MenuGroupSectionClassKey;
    }

    interface Components {
        CometAdminMenuGroupSection?: {
            defaultProps?: ComponentsPropsList["CometAdminMenuGroupSection"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuGroupSection"];
        };
    }
}
