import { ComponentsOverrides, Drawer, DrawerProps, PaperProps, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { useHistory } from "react-router";

import { MasterLayoutContext } from "../MasterLayoutContext";
import { MenuContext } from "./Context";
import { MenuClassKey, styles } from "./Menu.styles";

export interface MenuProps {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
    temporaryDrawerProps?: DrawerProps;
    permanentDrawerProps?: DrawerProps;
    temporaryDrawerPaperProps?: PaperProps;
    permanentDrawerPaperProps?: PaperProps;
}

const MenuDrawer: React.FC<WithStyles<typeof styles> & MenuProps> = ({
    classes,
    children,
    drawerWidth = 300,
    variant = "permanent",
    temporaryDrawerProps = {},
    permanentDrawerProps = {},
    temporaryDrawerPaperProps = {},
    permanentDrawerPaperProps = {},
}) => {
    const history = useHistory();
    const { open, toggleOpen } = React.useContext(MenuContext);
    const { headerHeight } = React.useContext(MasterLayoutContext);

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
                PaperProps={{ style: { width: drawerWidth }, ...temporaryDrawerPaperProps }}
                onClose={toggleOpen}
                {...temporaryDrawerProps}
            >
                {children}
            </Drawer>
            <Drawer
                variant={"permanent"}
                className={permanentDrawerClasses.join(" ")}
                open={permanentOpen}
                style={{ width: permanentOpen ? drawerWidth : 0 }}
                PaperProps={{
                    elevation: 2,
                    style: {
                        top: headerHeight,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: drawerWidth,
                        marginLeft: permanentOpen ? 0 : -drawerWidth,
                    },
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
        CometAdminenu?: {
            defaultProps?: ComponentsPropsList["CometAdminMenu"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenu"];
        };
    }
}
