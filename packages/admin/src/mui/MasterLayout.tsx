import { CssBaseline } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/styles";
import * as React from "react";

import { AppHeader } from "../appHeader/AppHeader";
import { AppHeaderMenuButton } from "../appHeader/menuButton/AppHeaderMenuButton";
import { mergeClasses } from "../helpers/mergeClasses";
import { CometAdminMasterLayoutClassKeys, useStyles } from "./MasterLayout.styles";
import { MasterLayoutContext } from "./MasterLayoutContext";
import { MenuContext } from "./menu/Context";

export interface MasterLayoutProps {
    children: React.ReactNode;
    menuComponent: React.ComponentType;
    headerComponent?: React.ComponentType;
    openMenuByDefault?: boolean;
    headerHeight?: number;
}

export function MasterLayout({
    classes: passedClasses,
    children,
    menuComponent: Menu,
    headerComponent: HeaderComponent,
    openMenuByDefault = true,
    headerHeight = 60,
}: MasterLayoutProps & StyledComponentProps<CometAdminMasterLayoutClassKeys>) {
    const classes = mergeClasses<CometAdminMasterLayoutClassKeys>(useStyles({ headerHeight }), passedClasses);
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
                    <div className={classes.contentWrapper}>{children}</div>
                </div>
            </MasterLayoutContext.Provider>
        </MenuContext.Provider>
    );
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminMasterLayout: MasterLayoutProps;
    }
}
