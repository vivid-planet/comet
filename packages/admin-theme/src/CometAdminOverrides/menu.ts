import { CometAdminMenuClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getCometAdminMenuOverrides = (): StyleRules<{}, CometAdminMenuClassKeys> => ({
    drawer: {
        "& [class*='MuiDrawer-paper']": {
            backgroundColor: "#fff",
        },
        "& [class*='MuiDrawer-paperAnchorLeft']": {
            borderRight: "none",
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
