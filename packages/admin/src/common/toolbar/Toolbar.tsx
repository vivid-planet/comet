import { Paper, Toolbar as MuiToolbar } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { MenuContext } from "../../mui/menu/Context";
import { CometAdminToolbarClassKeys, useStyles, useThemeProps } from "./Toolbar.styles";

interface ToolbarProps {}
const Toolbar: React.FunctionComponent<ToolbarProps & StyledComponentProps<CometAdminToolbarClassKeys>> = ({ children, classes: passedClasses }) => {
    const themeProps = useThemeProps();
    const { headerHeight } = React.useContext(MenuContext);
    const classes = mergeClasses<CometAdminToolbarClassKeys>(useStyles({ headerHeight }), passedClasses);

    return (
        <Paper elevation={themeProps.elevation} classes={{ root: classes.root }}>
            <MuiToolbar classes={{ root: classes.muiToolbar }}>
                <div className={classes.mainContentContainer}>{children}</div>
            </MuiToolbar>
        </Paper>
    );
};

export { Toolbar };
