import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminAppHeaderDropdownClassKeys = "root" | "popoverRoot" | "popoverPaper";

export const useStyles = makeStyles<Theme, { itemWidth: number }, CometAdminAppHeaderDropdownClassKeys>(
    () => ({
        root: {
            height: "100%",
        },
        popoverRoot: {},
        popoverPaper: {
            minWidth: ({ itemWidth }) => itemWidth,
        },
    }),
    { name: "CometAdminAppHeaderDropdown" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderDropdown: CometAdminAppHeaderDropdownClassKeys;
    }
}
