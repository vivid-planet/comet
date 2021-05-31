import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import zIndex from "@material-ui/core/styles/zIndex";

export type CometAdminTableQueryClassKeys = "root" | "loadingContainer" | "loadingPaper";

export const useStyles = makeStyles<Theme, {}, CometAdminTableQueryClassKeys>(
    () => ({
        root: {
            position: "relative",
        },
        loadingContainer: {
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: zIndex.modal,
            transform: "translate(50%, 200px)",
        },
        loadingPaper: {
            display: "flex",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
            height: 100,
            width: 100,
        },
    }),
    { name: "CometAdminTableQuery" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTableQuery: CometAdminTableQueryClassKeys;
    }
}
