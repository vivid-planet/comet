import { AppBarClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiAppBarOverrides = (): StyleRules<Record<string, unknown>, AppBarClassKey> => ({
    root: {},
    positionFixed: {},
    positionAbsolute: {},
    positionSticky: {},
    positionStatic: {},
    positionRelative: {},
    colorDefault: {},
    colorPrimary: {},
    colorSecondary: {},
});
