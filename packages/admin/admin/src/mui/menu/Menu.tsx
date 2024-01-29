import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { PaperProps } from "@mui/material/Paper";
import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";
import { useHistory } from "react-router";

import { MasterLayoutContext } from "../MasterLayoutContext";
import { MenuContext } from "./Context";

export type MenuClassKey = "drawer" | "permanent" | "temporary" | "open";

type OwnerState = { open: boolean; variant: string };

const StyledDrawer = styled(Drawer, {
    name: "CometAdminMenu",
    slot: "drawer",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.drawer,
            ownerState.variant === "temporary" && styles.temporary,
            ownerState.variant === "permanent" && ownerState.open && styles.permanent,
        ];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        [class*="MuiDrawer-paper"] {
            background-color: #fff;
        }
        [class*="MuiPaper-root"] {
            flex-grow: 1;
            overflow-x: hidden;
        }
        [class*="MuiDrawer-paperAnchorLeft"] {
            border-right: none;
        }

        ${ownerState.variant === "permanent" &&
        ownerState.open &&
        css`
            transition: ${theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            })};

            [class*="MuiPaper-root"] {
                transition: ${theme.transitions.create("margin", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                })};
            }
        `}

        ${ownerState.variant === "permanent" &&
        !ownerState.open &&
        css`
            transition: ${theme.transitions.create("width", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.leavingScreen,
            })};

            [class*="MuiPaper-root"] {
                transition: ${theme.transitions.create("margin", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                })};
                box-shadow: none;
            }
        `}
    `,
);

export interface MenuProps extends ThemedComponentBaseProps<{ drawer: typeof Drawer }> {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
    temporaryDrawerProps?: DrawerProps;
    permanentDrawerProps?: DrawerProps;
    temporaryDrawerPaperProps?: PaperProps;
    permanentDrawerPaperProps?: PaperProps;
}

export function Menu(inProps: MenuProps) {
    const {
        children,
        drawerWidth = 300,
        variant = "permanent",
        temporaryDrawerProps = {},
        permanentDrawerProps = {},
        temporaryDrawerPaperProps = {},
        permanentDrawerPaperProps = {},
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminMenu" });
    const history = useHistory();
    const { open, toggleOpen } = React.useContext(MenuContext);
    const { headerHeight } = React.useContext(MasterLayoutContext);
    const initialRender = React.useRef(true);

    const ownerState: OwnerState = {
        variant,
        open,
    };

    // Close the menu on initial render if it is temporary to prevent a page-overlay when initially loading the page.
    React.useEffect(() => {
        if (variant === "temporary" && open) {
            toggleOpen();
        }
        // workaround for issue: https://github.com/mui/material-ui/issues/35793
        initialRender.current = false;

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

    const temporaryOpen = variant === "temporary" && open;
    const permanentOpen = variant === "permanent" && open;

    // Always render both temporary and permanent drawers to make sure, the opening and closing animations run fully when switching between variants.
    return (
        <>
            <StyledDrawer
                variant="temporary"
                {...slotProps?.drawer}
                // workaround for issue: https://github.com/mui/material-ui/issues/35793
                open={initialRender.current ? false : temporaryOpen}
                ownerState={ownerState}
                PaperProps={{ style: { width: drawerWidth }, ...temporaryDrawerPaperProps }}
                onClose={toggleOpen}
                {...temporaryDrawerProps}
                {...restProps}
            >
                {children}
            </StyledDrawer>

            <StyledDrawer
                variant="permanent"
                {...slotProps?.drawer}
                open={permanentOpen}
                style={{ width: permanentOpen ? drawerWidth : 0 }}
                ownerState={ownerState}
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
            </StyledDrawer>
        </>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenu: MenuClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenu: Partial<MenuProps>;
    }

    interface Components {
        CometAdminenu?: {
            defaultProps?: ComponentsPropsList["CometAdminMenu"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenu"];
        };
    }
}
