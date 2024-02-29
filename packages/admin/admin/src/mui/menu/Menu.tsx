import Drawer from "@mui/material/Drawer";
import { PaperProps } from "@mui/material/Paper";
import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { useHistory } from "react-router";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "../MasterLayoutContext";
import { MenuContext } from "./Context";

export type MenuClassKey = "drawer" | "permanentDrawer" | "temporaryDrawer" | "open" | "closed";

type OwnerState = { open: boolean; drawerWidth: number };

const PermanentDrawer = styled(Drawer, {
    name: "CometAdminMenu",
    slot: "permanentDrawer",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.drawer, styles.permanentDrawer, ownerState.open && styles.open, !ownerState.open && styles.closed];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        width: 0;
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

        ${ownerState.open &&
        css`
            width: ${ownerState.drawerWidth}px;
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

        ${!ownerState.open &&
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
            }

            [class*="MuiPaper"] {
                box-shadow: none;
            }
        `}
    `,
);

const TemporaryDrawer = styled(Drawer, {
    name: "CometAdminMenu",
    slot: "temporaryDrawer",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.drawer, styles.temporaryDrawer, ownerState.open && styles.open, !ownerState.open && styles.closed];
    },
})<{ ownerState: OwnerState }>(css`
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
`);

export interface MenuProps
    extends ThemedComponentBaseProps<{
        permanentDrawer: typeof Drawer;
        temporaryDrawer: typeof Drawer;
    }> {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
    temporaryDrawerPaperProps?: PaperProps;
    permanentDrawerPaperProps?: PaperProps;
}

export function Menu(inProps: MenuProps) {
    const {
        children,
        drawerWidth = 300,
        variant = "permanent",
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
        open,
        drawerWidth,
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
            <TemporaryDrawer
                variant="temporary"
                {...slotProps?.temporaryDrawer}
                // workaround for issue: https://github.com/mui/material-ui/issues/35793
                open={initialRender.current ? false : temporaryOpen}
                ownerState={ownerState}
                PaperProps={{
                    ...temporaryDrawerPaperProps,
                    sx: { width: drawerWidth, ...temporaryDrawerPaperProps?.sx },
                }}
                onClose={toggleOpen}
                {...restProps}
            >
                {children}
            </TemporaryDrawer>

            <PermanentDrawer
                variant="permanent"
                {...slotProps?.permanentDrawer}
                open={permanentOpen}
                ownerState={ownerState}
                PaperProps={{
                    elevation: 2,
                    ...permanentDrawerPaperProps,
                    sx: {
                        top: headerHeight,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: drawerWidth,
                        marginLeft: permanentOpen ? 0 : -drawerWidth,
                        ...permanentDrawerPaperProps?.sx,
                    },
                }}
                {...restProps}
            >
                {children}
            </PermanentDrawer>
        </>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenu: MenuClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenu: MenuProps;
    }

    interface Components {
        CometAdminenu?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMenu"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenu"];
        };
    }
}
