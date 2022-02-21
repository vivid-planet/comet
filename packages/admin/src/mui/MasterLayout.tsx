import { ComponentsOverrides, CssBaseline, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { AppHeader } from "../appHeader/AppHeader";
import { AppHeaderMenuButton } from "../appHeader/menuButton/AppHeaderMenuButton";
import { MasterLayoutClassKey, styles } from "./MasterLayout.styles";
import { MasterLayoutContext } from "./MasterLayoutContext";
import { MenuContext } from "./menu/Context";

export interface MasterLayoutProps {
    children: React.ReactNode;
    menuComponent: React.ComponentType;
    headerComponent?: React.ComponentType;
    openMenuByDefault?: boolean;
    /**
     * Defines the global header-height. The value defined here will also be used by AppHeader and Toolbar.
     */
    headerHeight?: number;
}

function MasterLayoutComponent({
    classes,
    children,
    menuComponent: Menu,
    headerComponent: HeaderComponent,
    openMenuByDefault = true,
    headerHeight = 60,
}: MasterLayoutProps & WithStyles<typeof styles>) {
    const [open, setOpen] = React.useState(openMenuByDefault);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MenuContext.Provider value={{ open, toggleOpen }}>
            <MasterLayoutContext.Provider value={{ headerHeight }}>
                <CssBaseline />
                <div className={classes.root}>
                    <div className={classes.header}>
                        {HeaderComponent ? (
                            <HeaderComponent />
                        ) : (
                            <AppHeader>
                                <AppHeaderMenuButton onClick={toggleOpen} />
                            </AppHeader>
                        )}
                    </div>
                    <Menu />
                    <div
                        className={classes.contentWrapper}
                        style={{ "--comet-admin-master-layout-content-top-spacing": `${headerHeight}px` } as React.CSSProperties}
                    >
                        {children}
                    </div>
                </div>
            </MasterLayoutContext.Provider>
        </MenuContext.Provider>
    );
}

export const MasterLayout = withStyles(styles, { name: "CometAdminMasterLayout" })(MasterLayoutComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMasterLayout: MasterLayoutClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMasterLayout: MasterLayoutProps;
    }

    interface Components {
        CometAdminMasterLayout?: {
            defaultProps?: ComponentsPropsList["CometAdminMasterLayout"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMasterLayout"];
        };
    }
}
