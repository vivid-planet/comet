import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuProps } from "./Menu";

export type MenuClassKey = "drawer" | "permanent" | "temporary" | "open" | "closed";

export const styles = (theme: Theme) =>
    createStyles<MenuClassKey, MenuProps>({
        drawer: {
            "& [class*='MuiDrawer-paper']": {
                backgroundColor: "#fff",
            },
            "& [class*='MuiPaper-root']": {
                flexGrow: 1,
                overflowX: "hidden",
            },
            "& [class*='MuiDrawer-paperAnchorLeft']": {
                borderRight: "none",
            },
            "&$permanent": {
                "&$open": {
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    "& [class*='MuiPaper-root']": {
                        transition: theme.transitions.create("margin", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    },
                },
                "&$closed": {
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    "& [class*='MuiPaper-root']": {
                        transition: theme.transitions.create("margin", {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                },
            },
        },
        permanent: {},
        temporary: {},
        open: {},
        closed: {
            "&$permanent": {
                "& [class*='MuiPaper']": {
                    boxShadow: "none",
                },
            },
        },
    });
