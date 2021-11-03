import { WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type AppHeaderFillSpaceClassKey = "root";

const styles = () => {
    return createStyles<AppHeaderFillSpaceClassKey, {}>({
        root: {
            flexGrow: 1,
        },
    });
};

function FillSpace({ classes }: WithStyles<typeof styles>) {
    return <div className={classes.root} />;
}

export const AppHeaderFillSpace = withStyles(styles, { name: "CometAdminAppHeaderFillSpace" })(FillSpace);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderFillSpace: AppHeaderFillSpaceClassKey;
    }
}
