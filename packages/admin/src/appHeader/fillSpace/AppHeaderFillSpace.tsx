import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderFillSpace: AppHeaderFillSpaceClassKey;
    }

    interface Components {
        CometAdminAppHeaderFillSpace?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderFillSpace"];
        };
    }
}
