import { CSSObject, Drawer as MuiDrawer, DrawerProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createStyles, StyledComponent } from "@mui/styles";
import { MUIStyledCommonProps } from "@mui/system";
import * as React from "react";

import { MasterLayoutContext } from "../MasterLayoutContext";
import { DEFAULT_DRAWER_WIDTH, DEFAULT_DRAWER_WIDTH_COLLAPSED, MenuProps } from "./Menu";

const openedMixin = (theme: Theme, drawerWidth?: number): CSSObject => ({
    width: drawerWidth ?? DEFAULT_DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
});
const closedMixin = (theme: Theme, drawerVariant: DrawerProps["variant"], drawerWidth?: number, drawerWidthCollapsed?: number): CSSObject => ({
    width: drawerVariant === "temporary" ? drawerWidth ?? DEFAULT_DRAWER_WIDTH : drawerWidthCollapsed ?? DEFAULT_DRAWER_WIDTH_COLLAPSED,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});
export const Drawer: StyledComponent<DrawerProps & MUIStyledCommonProps<Theme> & Pick<MenuProps, "drawerWidth" | "drawerWidthCollapsed">> = styled(
    MuiDrawer,
    { shouldForwardProp: (prop) => prop !== "drawerWidth" && prop !== "drawerWidthCollapsed" },
)<DrawerProps & MUIStyledCommonProps<Theme> & Pick<MenuProps, "drawerWidth" | "drawerWidthCollapsed">>(
    ({ theme, open, variant, drawerWidth, drawerWidthCollapsed }) => {
        const { headerHeight } = React.useContext(MasterLayoutContext);

        const sharedStyles: CSSObject = {
            backgroundColor: theme.palette.common.white,
            overflowX: "hidden",
        };

        return {
            ...(variant === "permanent" && {
                ...sharedStyles,
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                ...(open ? openedMixin(theme, drawerWidth) : closedMixin(theme, variant, drawerWidth, drawerWidthCollapsed)),
            }),
            "& .MuiDrawer-paper": {
                ...sharedStyles,
                ...(variant === "permanent" && {
                    top: headerHeight,
                    height: `calc(100% - ${headerHeight}px)`,
                }),
                ...(open ? openedMixin(theme, drawerWidth) : closedMixin(theme, variant, drawerWidth, drawerWidthCollapsed)),
            },
            "& .MuiDrawer-paperAnchorLeft": {
                borderRight: "none",
            },
        };
    },
);

export type MenuClassKey = "drawer" | "permanent" | "temporary" | "open" | "closed";

export const styles = () => {
    return createStyles<MenuClassKey, MenuProps>({
        drawer: {
            "& > div": {
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            },
        },
        permanent: {},
        temporary: {},
        open: {},
        closed: {},
    });
};
