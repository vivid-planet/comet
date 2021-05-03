import { IconButton, Paper, Toolbar as MUIToolbar } from "@material-ui/core";
import * as React from "react";

import { MenuContext } from "../../mui";
import { useThemeProps, useToolbarStyles } from "./Toolbar.styles";
import { ToolbarItem } from "./ToolbarItem";

interface ToolbarProps {
    historyBackButton?: () => React.ReactNode;
    actionItems?: React.ReactNode;
}
const Toolbar: React.FunctionComponent<ToolbarProps> = ({
    historyBackButton = () => (
        <ToolbarItem>
            <IconButton>{themeProps.backIcon}</IconButton>
        </ToolbarItem>
    ),
    actionItems,
    children,
}) => {
    const themeProps = useThemeProps();
    const { headerHeight } = React.useContext(MenuContext);
    const classes = useToolbarStyles({ headerHeight });

    return (
        <Paper elevation={themeProps.elevation} className={classes.root}>
            <MUIToolbar classes={{ root: classes.muiToolbar }}>
                <div className={classes.historyContainer}>{historyBackButton()}</div>
                <div className={classes.mainContentContainer}>{children}</div>
                <div className={classes.actionContainer}>{actionItems}</div>
            </MUIToolbar>
        </Paper>
    );
};

export { Toolbar };
