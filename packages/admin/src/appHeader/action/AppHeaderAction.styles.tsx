import { ButtonBaseClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminAppHeaderActionClassKeys = ButtonBaseClassKey | "inner" | "startIcon" | "endIcon" | "typography";

export const useStyles = makeStyles<Theme, {}, CometAdminAppHeaderActionClassKeys>(
    ({ spacing }) => ({
        root: {
            height: "100%",
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
        },
        inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minWidth: "var(--header-height)",
            boxSizing: "border-box",
            paddingLeft: spacing(4),
            paddingRight: spacing(4),
        },
        disabled: {},
        focusVisible: {},
        startIcon: {
            display: "flex",
            alignItems: "center",
            "&:not(:last-child)": {
                marginRight: spacing(2),
            },
        },
        endIcon: {
            display: "flex",
            alignItems: "center",
            "&:not(:first-child)": {
                marginLeft: spacing(2),
            },
        },
        typography: {},
    }),
    { name: "CometAdminAppHeaderAction" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderAction: CometAdminAppHeaderActionClassKeys;
    }
}
