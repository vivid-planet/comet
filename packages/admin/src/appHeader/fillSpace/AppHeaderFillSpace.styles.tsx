import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminAppHeaderFillSpaceClassKeys = "root";

export const useStyles = makeStyles<Theme, {}, CometAdminAppHeaderFillSpaceClassKeys>(
    () => ({
        root: {
            flexGrow: 1,
        },
    }),
    { name: "CometAdminAppHeaderFillSpace" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderFillSpace: CometAdminAppHeaderFillSpaceClassKeys;
    }
}
