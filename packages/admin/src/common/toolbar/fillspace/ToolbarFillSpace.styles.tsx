import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminToolbarFillSpaceClassKeys = "root";

export const useStyles = makeStyles<Theme, {}, CometAdminToolbarFillSpaceClassKeys>(
    () => ({
        root: {
            flexGrow: 1,
        },
    }),
    { name: "CometAdminToolbarFillSpace" },
);

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarFillSpace: CometAdminToolbarFillSpaceClassKeys;
    }
}
