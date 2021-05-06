import { Paper, Toolbar as MUIToolbar } from "@material-ui/core";
import * as React from "react";

import { MenuContext } from "../../mui";
import { useStyles, useThemeProps } from "./Toolbar.styles";

interface ToolbarProps {}
const Toolbar: React.FunctionComponent<ToolbarProps> = ({ children }) => {
    const themeProps = useThemeProps();
    const { headerHeight } = React.useContext(MenuContext);
    const classes = useStyles({ headerHeight });

    return (
        <Paper elevation={themeProps.elevation} className={classes.root}>
            <MUIToolbar classes={{ root: classes.muiToolbar }}>
                <div className={classes.mainContentContainer}>{children}</div>
            </MUIToolbar>
        </Paper>
    );
};

export { Toolbar };
