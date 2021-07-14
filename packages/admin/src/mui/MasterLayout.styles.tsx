import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminMasterLayoutClassKeys = "root" | "header" | "contentWrapper";

export const useStyles = makeStyles<Theme, { headerHeight: number }, CometAdminMasterLayoutClassKeys>(
    ({ zIndex }) => ({
        root: {
            display: "flex",
            flexWrap: "nowrap",
        },
        header: {
            zIndex: zIndex.drawer + 1,
        },
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
