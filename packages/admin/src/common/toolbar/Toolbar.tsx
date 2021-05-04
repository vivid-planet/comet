import { Paper, Toolbar as MUIToolbar } from "@material-ui/core";
import * as React from "react";

import { MenuContext } from "../../mui";
import { IStackSwitchApi, useStackSwitchApi } from "../../stack";
import { useStyles, useThemeProps } from "./Toolbar.styles";

interface ToolbarProps {
    actionItems?: (stackSwitchApi: IStackSwitchApi | undefined) => React.ReactNode;
}
const Toolbar: React.FunctionComponent<ToolbarProps> = ({ actionItems, children }) => {
    const themeProps = useThemeProps();
    const { headerHeight } = React.useContext(MenuContext);
    const classes = useStyles({ headerHeight });
    const stackSwitchApiContext = useStackSwitchApi();

    return (
        <Paper elevation={themeProps.elevation} className={classes.root}>
            <MUIToolbar classes={{ root: classes.muiToolbar }}>
                <div className={classes.mainContentContainer}>{children}</div>
                <div className={classes.actionContainer}>{actionItems?.(stackSwitchApiContext)}</div>
            </MUIToolbar>
        </Paper>
    );
};

export { Toolbar };
