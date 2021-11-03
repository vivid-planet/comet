import { WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type ToolbarActionsClassKey = "root";
interface Props {
    children: React.ReactNode;
}

const styles = () => {
    return createStyles<ToolbarActionsClassKey, Props>({
        root: {
            display: "flex",
            alignItems: "center",
        },
    });
};

function Actions({ children, classes }: Props & WithStyles<typeof styles>): React.ReactElement {
    return <div className={classes.root}>{children}</div>;
}

export const ToolbarActions = withStyles(styles, { name: "CometAdminToolbarActions" })(Actions);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarActions: ToolbarActionsClassKey;
    }
}
