import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

export type CometAdminMenuClassKeys = "drawer" | "permanent" | "temporary" | "open" | "closed";

export const styles = (theme: Theme) =>
    createStyles<CometAdminMenuClassKeys, any>({
        drawer: {
            "& [class*='MuiPaper-root']": {
                flexGrow: 1,
                overflowX: "hidden",
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
        closed: {},
    });
