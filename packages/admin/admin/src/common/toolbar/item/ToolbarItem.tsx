import { WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
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

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarItem: ToolbarItemClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarItem: ToolbarItemProps;
    }
}
