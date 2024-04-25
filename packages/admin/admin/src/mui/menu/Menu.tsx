import { ComponentsOverrides, Drawer as MuiDrawer, Theme, useThemeProps } from "@mui/material";
import * as React from "react";
import { useHistory } from "react-router";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "../MasterLayoutContext";
import { MenuContext } from "./Context";
import { MenuClassKey, OwnerState, PermanentDrawer, TemporaryDrawer } from "./Menu.styles";

export const DEFAULT_DRAWER_WIDTH = 300;
export const DEFAULT_DRAWER_WIDTH_COLLAPSED = 60;

export interface MenuProps
    extends ThemedComponentBaseProps<{
        temporaryDrawer: typeof MuiDrawer;
        permanentDrawer: typeof MuiDrawer;
    }> {
    children: React.ReactNode;
    variant?: "permanent" | "temporary";
    drawerWidth?: number;
    drawerWidthCollapsed?: number;
    // temporaryDrawerProps?: DrawerProps; // TODO: Mention removal in changeset, if present in `main` branch.
    // permanentDrawerProps?: DrawerProps; // TODO: Mention removal in changeset, if present in `main` branch.
    // temporaryDrawerPaperProps?: PaperProps; // TODO: Mention removal in changeset, if present in `main` branch.
    // permanentDrawerPaperProps?: PaperProps; // TODO: Mention removal in changeset, if present in `main` branch.
}

export const Menu = (inProps: MenuProps) => {
    const {
        children,
        drawerWidth = DEFAULT_DRAWER_WIDTH,
        drawerWidthCollapsed = DEFAULT_DRAWER_WIDTH_COLLAPSED,
        variant = "permanent",
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminMenu" });
    const history = useHistory();
    const { open, toggleOpen, setDrawerVariant, drawerVariant } = React.useContext(MenuContext);
    const initialRender = React.useRef(true);
    const { headerHeight } = React.useContext(MasterLayoutContext);

    // useEffect needed to avoid a React error stating that a bad setState call was made.
    React.useEffect(() => {
        if (drawerVariant !== variant) {
            setDrawerVariant(variant);
        }
    }, [drawerVariant, setDrawerVariant, variant]);

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

    // workaround for issue: https://github.com/mui/material-ui/issues/35793
    const temporaryDrawerIsOpen = initialRender.current ? false : open;

    const ownerState: OwnerState = {
        drawerWidth,
        drawerWidthCollapsed,
        open: variant === "temporary" ? temporaryDrawerIsOpen : open,
        headerHeight,
    };

    // Always render both temporary and permanent drawers to make sure, the opening and closing animations run fully when switching between variants.
    return (
        <>
            <TemporaryDrawer
                variant="temporary"
                onClose={toggleOpen}
                open={variant === "temporary" && temporaryDrawerIsOpen}
                ownerState={ownerState}
                {...slotProps?.temporaryDrawer}
                {...restProps}
            >
                {children}
            </TemporaryDrawer>
            <PermanentDrawer
                variant="permanent"
                ownerState={ownerState}
                open={variant === "permanent" && open}
                hidden={variant === "temporary"}
                {...slotProps?.permanentDrawer}
                PaperProps={{
                    elevation: 2,
                    ...slotProps?.permanentDrawer?.PaperProps,
                }}
                {...restProps}
            >
                {children}
            </PermanentDrawer>
        </>
    );
};

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
