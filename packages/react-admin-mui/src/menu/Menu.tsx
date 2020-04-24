import { Drawer, Theme } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { useHistory } from "react-router";
import { MenuContext } from "./Context";
import * as sc from "./Menu.sc";

interface IProps {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
}

const Menu = ({ classes, children, variant = "permanent", theme }: WithStyles<typeof styles, true> & IProps) => {
    const { open, toggleOpen } = React.useContext(MenuContext);
    const themeStyles = styles(theme);
    const history = useHistory();

    React.useEffect(() => {
        if (variant === "temporary" && open) {
            toggleOpen();
        }
    }, []);

    React.useEffect(() => {
        return history.listen(() => {
            if (variant === "temporary" && open) {
                toggleOpen();
            }
        });
    }, [history, variant, open]);

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
        menuClasses += " " + (open ? classes.permanentDrawerOpen : classes.permanentDrawerClose);
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
