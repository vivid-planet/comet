import { Drawer, Theme } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { useHistory } from "react-router";
import { ThemeContext } from "styled-components";

import { MenuContext } from "./Context";
import * as sc from "./Menu.sc";
// TODO after next publish: Replace with hook from `@vivid-planet/comet-admin`
import useWindowSize from "./useWindowSize";

interface IProps {
    children: React.ReactNode;
    permanentMenuMinWidth?: number;
}

const Menu = ({ classes, children, permanentMenuMinWidth: passedPermanentMenuMinWidth, theme }: WithStyles<typeof styles, true> & IProps) => {
    const { open, toggleOpen } = React.useContext(MenuContext);
    const themeContext = React.useContext(ThemeContext);
    const history = useHistory();
    const windowSize = useWindowSize();
    const themeStyles = styles(theme);
    const permanentMenuMinWidth = passedPermanentMenuMinWidth ? passedPermanentMenuMinWidth : themeContext.breakpoints.values.lg;
    const variant = windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent";

    React.useEffect(() => {
        if (variant === "temporary" && open) {
            toggleOpen();
        }
        // useEffect dependencies need to stay empty, because the function should only be called on first render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        return history.listen(() => {
            if (variant === "temporary" && open) {
                toggleOpen();
            }
        });
    }, [history, variant, open, toggleOpen]);

    const getVariantDependantDrawerProps = () => {
        if (variant === "temporary") {
            return {
                onBackdropClick: toggleOpen,
            };
        }
        return {};
    };

    let menuClasses: string = classes.drawer;
    if (variant === "permanent") {
        menuClasses += ` ${open ? classes.permanentDrawerOpen : classes.permanentDrawerClose}`;
    }

    return (
        <Drawer variant={variant} className={menuClasses} classes={{ paper: menuClasses }} open={open} {...getVariantDependantDrawerProps()}>
            <sc.MenuItemsWrapper width={`${(themeStyles.drawer as { width: number }).width}px`}>
                {variant === "permanent" && <div className={classes.toolbar} />}
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
        permanentDrawerOpen: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        permanentDrawerClose: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: 0,
        },
        toolbar: theme.mixins.toolbar,
    });
};
const ExtendedMenu = withStyles(styles, { withTheme: true })(Menu);

export { ExtendedMenu as Menu };
