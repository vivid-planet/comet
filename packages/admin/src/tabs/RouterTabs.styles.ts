import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminRouterTabsClassKeys = "root" | "tabs" | "content" | "contentHidden";

export const useStyles = makeStyles<Theme, {}, CometAdminRouterTabsClassKeys>(
    () => ({
        root: {},
        tabs: {},
        content: {},
        contentHidden: {
            display: "none",
        },
    }),
    { name: "CometAdminRouterTabs" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRouterTabs: CometAdminRouterTabsClassKeys;
    }
}
