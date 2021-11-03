import { WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type ToolbarFillSpaceClassKey = "root";

export interface ToolbarFillSpaceProps {
    children?: React.ReactNode;
}

const styles = () => {
    return createStyles<ToolbarFillSpaceClassKey, ToolbarFillSpaceProps>({
        root: {
            flexGrow: 1,
        },
    });
};

function FillSpace({ children, classes }: ToolbarFillSpaceProps & WithStyles<typeof styles>): React.ReactElement {
    return <div className={classes.root}>{children}</div>;
}

export const ToolbarFillSpace = withStyles(styles, { name: "CometAdminToolbarFillSpace" })(FillSpace);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarFillSpace: ToolbarFillSpaceClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarFillSpace: ToolbarFillSpaceProps;
    }
}
