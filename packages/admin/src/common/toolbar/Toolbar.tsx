import { AppBar, IconButton, Toolbar as MUIToolbar, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { MenuContext } from "../../mui";
import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface ToolbarThemeProps {
    backIcon?: React.ReactNode;
}

export type CometAdminToolbarClassKeys = "root";

const useStyles = makeStyles<Theme, { headerHeight: number }, CometAdminToolbarClassKeys>(
    () => ({
        root: {
            top: (props) => props.headerHeight,
        },
    }),
    { name: "CometAdminToolbar" },
);

const Toolbar: React.FunctionComponent = () => {
    const { headerHeight } = React.useContext(MenuContext);
    const classes = useStyles({ headerHeight });

    const themeProps = useComponentThemeProps<ToolbarThemeProps>("CometAdminToolbar");

    return (
        <AppBar position={"sticky"} className={classes.root}>
            <MUIToolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    {themeProps?.backIcon ? themeProps?.backIcon : <ArrowBack />}
                </IconButton>
                <Typography variant="h6">Toolbar - all things start small</Typography>
            </MUIToolbar>
        </AppBar>
    );
};

export { Toolbar };
