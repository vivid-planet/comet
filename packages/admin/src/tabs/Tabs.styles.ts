import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminTabsClassKeys = "root" | "tabs" | "content";

export const useStyles = makeStyles<Theme, {}, CometAdminTabsClassKeys>(
    () => ({
        root: {},
        tabs: {},
        content: {},
    }),
    { name: "CometAdminTabs" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTabs: CometAdminTabsClassKeys;
    }
}
