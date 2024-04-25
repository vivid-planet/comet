import { css, Drawer as MuiDrawer, drawerClasses, DrawerProps, Theme } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { DEFAULT_DRAWER_WIDTH, DEFAULT_DRAWER_WIDTH_COLLAPSED } from "./Menu";

const getOpenedAnimation = (theme: Theme, drawerWidth?: number) => css`
    width: ${drawerWidth ?? DEFAULT_DRAWER_WIDTH}px;
    transition: width ${theme.transitions.easing.sharp} ${theme.transitions.duration.enteringScreen}ms;
`;

const getClosedAnimation = (theme: Theme, drawerVariant: DrawerProps["variant"], drawerWidth?: number, drawerWidthCollapsed?: number) => css`
    width: ${drawerVariant === "temporary" ? drawerWidth ?? DEFAULT_DRAWER_WIDTH : drawerWidthCollapsed ?? DEFAULT_DRAWER_WIDTH_COLLAPSED}px;
    transition: width ${theme.transitions.easing.sharp} ${theme.transitions.duration.leavingScreen}ms;
`;

export type MenuClassKey = "drawer" | "permanent" | "temporary" | "open" | "closed";

export type OwnerState = {
    drawerWidth: number;
    drawerWidthCollapsed: number;
    open: boolean;
    headerHeight: number;
};

const getSharedStyles = (theme: Theme) => css`
    background-color: ${theme.palette.common.white};
    overflow-x: hidden;
`;

export const TemporaryDrawer = createComponentSlot(MuiDrawer)<MenuClassKey, OwnerState>({
    componentName: "Menu",
    slotName: "temporary",
    classesResolver(ownerState) {
        return ["drawer", ownerState.open ? "open" : "closed"];
    },
})(
    ({ theme, ownerState }) => css`
        .${drawerClasses.paper} {
            ${getSharedStyles(theme)}
            ${ownerState.open ? getOpenedAnimation(theme, ownerState.drawerWidth) : getClosedAnimation(theme, "temporary", ownerState.drawerWidth)}
        }

        .${drawerClasses.paperAnchorLeft} {
            border-right: none;
        }
    `,
);

export const PermanentDrawer = createComponentSlot(MuiDrawer)<MenuClassKey, OwnerState>({
    componentName: "Menu",
    slotName: "permanent",
    classesResolver(ownerState) {
        return ["drawer", ownerState.open ? "open" : "closed"];
    },
})(
    ({ theme, ownerState }) => css`
        ${getSharedStyles(theme)}
        flex-shrink: 0;
        white-space: nowrap;
        box-sizing: border-box;
        ${ownerState.open
            ? getOpenedAnimation(theme, ownerState.drawerWidth)
            : getClosedAnimation(theme, "permanent", ownerState.drawerWidthCollapsed)}

        .${drawerClasses.paper} {
            ${getSharedStyles(theme)}
            top: ${ownerState.headerHeight}px;
            height: calc(100% - ${ownerState.headerHeight}px);
            ${ownerState.open
                ? getOpenedAnimation(theme, ownerState.drawerWidth)
                : getClosedAnimation(theme, "permanent", ownerState.drawerWidthCollapsed)}
        }

        .${drawerClasses.paperAnchorLeft} {
            border-right: none;
        }
    `,
);
