import { Drawer } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { useHistory } from "react-router";

import { MenuContext } from "./Context";
import { styles } from "./Menu.styles";

export interface MenuThemeProps {
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
}

export interface MenuProps extends MenuThemeProps {
    children: React.ReactNode;
}

const MenuDrawer: React.FC<WithStyles<typeof styles> & MenuProps> = ({ classes, children, drawerWidth = 300, variant = "permanent" }) => {
    const history = useHistory();
    const { open, toggleOpen, headerHeight } = React.useContext(MenuContext);

    // Close the menu on initial render if it is temporary to prevent a page-overlay when initially loading the page.
    React.useEffect(() => {
        if (variant === "temporary" && open) {
            toggleOpen();
        }
        // useEffect dependencies need to stay empty, because the function should only be called on first render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close temporary menu after changing location (e.g. when clicking menu item).
    React.useEffect(() => {
        return history.listen(() => {
            if (variant === "temporary" && open) {
                toggleOpen();
            }
        });
    }, [history, variant, open, toggleOpen]);

    const temporaryDrawerClasses: string[] = [classes.drawer, classes.temporary];
    temporaryDrawerClasses.push(open ? classes.open : classes.closed);

    const permanentDrawerClasses: string[] = [classes.drawer, classes.permanent];
    permanentDrawerClasses.push(open ? classes.open : classes.closed);

    const temporaryOpen = variant === "temporary" && open;
    const permanentOpen = variant === "permanent" && open;

    // Always render both temporary and permanent drawers to make sure, the opening and closing animations run fully when switching between variants.
    return (
        <>
            <Drawer
                variant={"temporary"}
                className={temporaryDrawerClasses.join(" ")}
                open={temporaryOpen}
                PaperProps={{ style: { width: drawerWidth } }}
                onBackdropClick={toggleOpen}
            >
                {children}
            </Drawer>
            <Drawer
                variant={"permanent"}
                className={permanentDrawerClasses.join(" ")}
                open={permanentOpen}
                style={{ width: permanentOpen ? drawerWidth : 0 }}
                PaperProps={{
                    style: {
                        top: headerHeight,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: drawerWidth,
                        marginLeft: permanentOpen ? 0 : -drawerWidth,
                    },
                }}
            >
                {children}
            </Drawer>
        </>
    );
};

export const Menu = withStyles(styles, { name: "CometAdminMenu", withTheme: true })(MenuDrawer);
