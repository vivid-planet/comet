import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminMasterLayoutClassKeys = "root" | "header" | "toolbar" | "menuButton" | "contentWrapper";

export const useStyles = makeStyles<Theme, { headerHeight: number }, CometAdminMasterLayoutClassKeys>(
    ({ spacing, zIndex }) => ({
        root: {
            display: "flex",
            flexWrap: "nowrap",
        },
        header: {
            zIndex: zIndex.drawer + 1,
        },
        toolbar: {
            minHeight: 0,
            paddingLeft: spacing(2),
            paddingRight: spacing(2),
        },
        menuButton: {},
        contentWrapper: {
            flexGrow: 1,
            paddingTop: ({ headerHeight }) => headerHeight,
        },
    }),
    { name: "CometAdminMasterLayout" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminMasterLayout: CometAdminMasterLayoutClassKeys;
    }
}
