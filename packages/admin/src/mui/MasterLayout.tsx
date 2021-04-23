import { CssBaseline, IconButton, Toolbar } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { Header } from "./MasterLayout.sc";
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
}

export type CometAdminMasterLayoutClassKeys = "root" | "header" | "toolbar" | "contentWrapper" | "mainContent";

const styles = (theme: Theme) =>
    createStyles<CometAdminMasterLayoutClassKeys, any>({
        root: {
            display: "flex",
            flexWrap: "nowrap",
        },
        header: {},
        toolbar: {
            minHeight: 0,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        contentWrapper: {
            flexGrow: 1,
        },
        mainContent: {
            padding: theme.spacing(4),
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
    } = props;
    const [open, setOpen] = React.useState(openMenuByDefault);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MenuContext.Provider value={{ open, toggleOpen, headerHeight }}>
            <CssBaseline />
            <div className={classes.root}>
                <Header position="fixed" color="inherit" classes={{ root: classes.header }}>
                    <Toolbar style={{ height: headerHeight }} classes={{ root: classes.toolbar }}>
                        {!hideToolbarMenuIcon && (
                            <IconButton onClick={toggleOpen}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        {HeaderComponent && <HeaderComponent />}
                    </Toolbar>
                </Header>
                <Menu />
                <div style={{ paddingTop: headerHeight }} className={classes.contentWrapper}>
                    <main className={classes.mainContent}>{children}</main>
                </div>
            </div>
        </MenuContext.Provider>
    );
};

const StyledMasterLayout = withStyles(styles, { name: "CometAdminMasterLayout", withTheme: true })(MasterLayout);
export { StyledMasterLayout as MasterLayout };
