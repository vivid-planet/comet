import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminToolbarActionsClassKeys = "root";

export const useStyles = makeStyles<Theme, {}, CometAdminToolbarActionsClassKeys>(
    () => ({
        root: {
            display: "flex",
            alignItems: "center",
        },
    }),
    { name: "CometAdminToolbarActions" },
);

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarActions: CometAdminToolbarActionsClassKeys;
    }
}
