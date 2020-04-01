import { Drawer, Theme } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { MenuContext } from "./Context";
import * as sc from "./Menu.sc";

interface IProps {
    children: React.ReactNode;
}

const Menu = ({ classes, children, theme }: WithStyles<typeof styles, true> & IProps) => {
    const { open } = React.useContext(MenuContext);
    const themeStyles = styles(theme);

    return (
        <Drawer
            variant="permanent"
            className={classes.drawer + " " + (open ? classes.drawerOpen : classes.drawerClose)}
            classes={{
                paper: classes.drawer + " " + (open ? classes.drawerOpen : classes.drawerClose),
            }}
            open={open}
        >
            <sc.MenuItemsWrapper width={`${(themeStyles.drawer as { width: number }).width}px`}>
                <div className={classes.toolbar} />
                {children}
            </sc.MenuItemsWrapper>
        </Drawer>
    );
};

const styles = (theme: Theme) => {
    return createStyles({
        drawer: {
            width: 300, //  theme.appDrawer.width,
        },
        drawerOpen: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: 60,
        },
        toolbar: theme.mixins.toolbar,
    });
};
const ExtendedMenu = withStyles(styles, { withTheme: true })(Menu);

export { ExtendedMenu as Menu };
