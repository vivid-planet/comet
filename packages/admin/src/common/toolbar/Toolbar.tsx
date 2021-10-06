import { Paper, Toolbar as MuiToolbar, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { MasterLayoutContext } from "../../mui/MasterLayoutContext";

export type ToolbarClassKey = "root" | "muiToolbar" | "mainContentContainer";

export interface ToolbarProps {
    elevation?: number;
}

const styles = () => {
    return createStyles<ToolbarClassKey, ToolbarProps>({
        root: {
            position: "sticky",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: "var(--comet-admin-toolbar-top-spacing)",
            padding: 0,
            minHeight: 80,
        },
        muiToolbar: {
            display: "flex",
            flex: 1,
            alignItems: "stretch",
        },
        mainContentContainer: {
            display: "flex",
            flex: 1,
        },
    });
};

const ToolbarComponent: React.FunctionComponent<ToolbarProps & WithStyles<typeof styles>> = ({ children, elevation = 1, classes }) => {
    const { headerHeight } = React.useContext(MasterLayoutContext);

    return (
        <Paper
            elevation={elevation}
            style={{ "--comet-admin-toolbar-top-spacing": `${headerHeight}px` } as React.CSSProperties}
            classes={{ root: classes.root }}
        >
            <MuiToolbar classes={{ root: classes.muiToolbar }}>
                <div className={classes.mainContentContainer}>{children}</div>
            </MuiToolbar>
        </Paper>
    );
};

export const Toolbar = withStyles(styles, { name: "CometAdminToolbar" })(ToolbarComponent);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbar: ToolbarClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbar: ToolbarProps;
    }
}
