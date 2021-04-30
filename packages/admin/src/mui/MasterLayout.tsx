import { AppBar, CssBaseline, IconButton, Toolbar } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import MuiMenuIcon from "@material-ui/icons/Menu";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { MenuContext } from "./menu";

export interface MasterLayoutProps {
    children: React.ReactNode;
    menuComponent: React.ComponentType;
    headerComponent?: React.ComponentType;
}

export interface MasterLayoutThemeProps {
    hideToolbarMenuIcon?: boolean;
    openMenuByDefault?: boolean;
    headerHeight?: number;
    menuIcon?: React.ComponentType;
}

export type CometAdminMasterLayoutClassKeys = "root" | "header" | "toolbar" | "menuButton" | "contentWrapper";

const styles = (theme: Theme) =>
    createStyles<CometAdminMasterLayoutClassKeys, any>({
        root: {
            display: "flex",
            flexWrap: "nowrap",
        },
        header: {
            zIndex: theme.zIndex.drawer + 1,
        },
        toolbar: {
            minHeight: 0,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        menuButton: {},
        contentWrapper: {
            flexGrow: 1,
        },
    });

const MasterLayout: React.FC<WithStyles<typeof styles> & MasterLayoutProps & MasterLayoutThemeProps> = (props) => {
    const {
        classes,
        children,
        menuComponent: Menu,
        headerComponent: HeaderComponent,
        hideToolbarMenuIcon,
        openMenuByDefault = true,
        headerHeight = 60,
        menuIcon: MenuIcon = MuiMenuIcon,
    } = props;
    const [open, setOpen] = React.useState(openMenuByDefault);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MenuContext.Provider value={{ open, toggleOpen, headerHeight }}>
            <CssBaseline />
            <div className={classes.root}>
                <AppBar position="fixed" color="inherit" classes={{ root: classes.header }}>
                    <Toolbar style={{ height: headerHeight }} classes={{ root: classes.toolbar }}>
                        {!hideToolbarMenuIcon && (
                            <IconButton onClick={toggleOpen} classes={{ root: classes.menuButton }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        {HeaderComponent && <HeaderComponent />}
                    </Toolbar>
                </AppBar>
                <Menu />
                <div style={{ paddingTop: headerHeight }} className={classes.contentWrapper}>
                    {children}
                </div>
            </div>
        </MenuContext.Provider>
    );
};

const StyledMasterLayout = withStyles(styles, { name: "CometAdminMasterLayout", withTheme: true })(MasterLayout);
export { StyledMasterLayout as MasterLayout };
