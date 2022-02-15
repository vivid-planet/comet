import { AppBarClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiAppBarOverrides = (): OverridesStyleRules<AppBarClassKey> => ({
    root: {},
    positionFixed: {},
    positionAbsolute: {},
    positionSticky: {},
    positionStatic: {},
    positionRelative: {},
    colorDefault: {},
    colorPrimary: {},
    colorSecondary: {},
    colorInherit: {},
    colorTransparent: {},
});
