import { ComponentsOverrides, DrawerProps, PaperProps, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { useHistory } from "react-router";

import { MenuContext } from "./Context";
import { Drawer, MenuClassKey, styles } from "./Menu.styles";

export const DRAWER_WIDTH = 300;
export const DRAWER_WIDTH_COLLAPSED = 60;

export interface MenuProps {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
    drawerWidthCollapsed?: number;
    temporaryDrawerProps?: DrawerProps;
    permanentDrawerProps?: DrawerProps;
    temporaryDrawerPaperProps?: PaperProps;
    permanentDrawerPaperProps?: PaperProps;
}

const MenuDrawer: React.FC<WithStyles<typeof styles> & MenuProps> = ({
    classes,
    children,
    drawerWidth = DRAWER_WIDTH,
    drawerWidthCollapsed = DRAWER_WIDTH_COLLAPSED,
    variant = "permanent",
    temporaryDrawerProps = {},
    permanentDrawerProps = {},
    temporaryDrawerPaperProps = {},
    permanentDrawerPaperProps = {},
}) => {
    const history = useHistory();
    const { open, toggleOpen } = React.useContext(MenuContext);
    const initialRender = React.useRef(true);

    // Close the menu on initial render if it is temporary to prevent a page-overlay when initially loading the page.
    React.useEffect(() => {
        if (variant === "temporary" && open) {
            toggleOpen();
            // workaround for issue: https://github.com/mui/material-ui/issues/35793
            initialRender.current = false;
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
                variant="temporary"
                drawerWidth={drawerWidth}
                className={temporaryDrawerClasses.join(" ")}
                // workaround for issue: https://github.com/mui/material-ui/issues/35793
                open={initialRender.current ? false : temporaryOpen}
                PaperProps={{ ...temporaryDrawerPaperProps }}
                onClose={toggleOpen}
                {...temporaryDrawerProps}
            >
                {children}
            </Drawer>

            <Drawer
                variant="permanent"
                drawerWidth={drawerWidth}
                drawerWidthCollapsed={drawerWidthCollapsed}
                className={permanentDrawerClasses.join(" ")}
                open={permanentOpen}
                hidden={variant === "temporary"}
                PaperProps={{
                    elevation: 2,
                    ...permanentDrawerPaperProps,
                }}
                {...permanentDrawerProps}
            >
                {children}
            </Drawer>
        </>
    );
};

export const Menu = withStyles(styles, { name: "CometAdminMenu" })(MenuDrawer);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenu: MenuClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenu: MenuProps;
    }

    interface Components {
        CometAdminMenu?: {
            defaultProps?: ComponentsPropsList["CometAdminMenu"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenu"];
        };
    }
}
