import { AppBarClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminAppHeaderClassKeys = AppBarClassKey;

export const useStyles = makeStyles<Theme, { headerHeight: number }, CometAdminAppHeaderClassKeys>(
    ({ palette }) => ({
        root: {
            "--header-height": ({ headerHeight }) => `${headerHeight}px`,
            backgroundColor: palette.grey["A400"],
            height: "var(--header-height)",
            flexDirection: "row",
            alignItems: "center",
        },
        positionFixed: {},
        positionAbsolute: {},
        positionSticky: {},
        positionStatic: {},
        positionRelative: {},
        colorDefault: {},
        colorPrimary: {},
        colorSecondary: {},
    }),
    { name: "CometAdminAppHeader" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeader: CometAdminAppHeaderClassKeys;
    }
}
