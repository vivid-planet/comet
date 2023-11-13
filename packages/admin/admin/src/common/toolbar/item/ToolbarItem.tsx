import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type ToolbarItemClassKey = "root";

export interface ToolbarItemProps {
    children: React.ReactNode;
}

const styles = ({ palette }: Theme) => {
    return createStyles<ToolbarItemClassKey, ToolbarItemProps>({
        root: {
            padding: 15,
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            borderRight: 1,
            borderRightStyle: "solid",
            borderRightColor: palette.grey[50],
        },
    });
};

function Item({ children, classes }: ToolbarItemProps & WithStyles<typeof styles>): React.ReactElement {
    return <div className={classes.root}>{children}</div>;
}

export const ToolbarItem = withStyles(styles, { name: "CometAdminToolbarItem" })(Item);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarItem: ToolbarItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarItem: Partial<ToolbarItemProps>;
    }

    interface Components {
        CometAdminToolbarItem?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbarItem"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarItem"];
        };
    }
}
