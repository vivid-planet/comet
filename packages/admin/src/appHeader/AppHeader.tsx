import { AppBar } from "@material-ui/core";
import { AppBarProps } from "@material-ui/core/AppBar";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";
import { MasterLayoutContext } from "../mui/MasterLayoutContext";
import { CometAdminAppHeaderClassKeys, useStyles } from "./AppHeader.styles";

interface AppHeaderProps extends AppBarProps {
    headerHeight?: number;
}

export function AppHeader({
    children,
    headerHeight: passedHeaderHeight,
    classes: passedClasses,
    ...restProps
}: AppHeaderProps & StyledComponentProps<CometAdminAppHeaderClassKeys>): React.ReactElement {
    const { headerHeight: masterLayoutHeaderHeight } = React.useContext(MasterLayoutContext);
    const headerHeight = passedHeaderHeight === undefined ? masterLayoutHeaderHeight : passedHeaderHeight;
    const classes = mergeClasses<CometAdminAppHeaderClassKeys>(useStyles({ headerHeight }), passedClasses);

    return (
        <AppBar classes={classes} {...restProps}>
            {children}
        </AppBar>
    );
}
