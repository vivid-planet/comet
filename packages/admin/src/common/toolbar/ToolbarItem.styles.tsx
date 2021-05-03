import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminToolbarItemClassKeys = "root";

export const useToolbarItemStyles = makeStyles<Theme, {}, CometAdminToolbarItemClassKeys>(
    () => ({
        root: {
            padding: 15,
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            borderRight: 1,
            borderRightStyle: "solid",
        },
    }),
    { name: "CometAdminToolbarItem" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarItem: CometAdminToolbarItemClassKeys;
    }
}
