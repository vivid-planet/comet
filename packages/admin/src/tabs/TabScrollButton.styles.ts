import { TabScrollButtonClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminTabScrollButtonClassKeys = TabScrollButtonClassKey;

export const useStyles = makeStyles<Theme, {}, CometAdminTabScrollButtonClassKeys>(
    () => ({
        root: {
            width: 40,
            flexShrink: 0,
        },
        vertical: {
            width: "100%",
            height: 40,
        },
        disabled: {},
    }),
    { name: "CometAdminTabScrollButton" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTabScrollButton: CometAdminTabScrollButtonClassKeys;
    }
}
