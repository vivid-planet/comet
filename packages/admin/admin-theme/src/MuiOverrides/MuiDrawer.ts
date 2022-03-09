import { DrawerClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDrawerOverrides = (palette: Palette): StyleRules<Record<string, unknown>, DrawerClassKey> => ({
    root: {},
    docked: {},
    paper: {
        backgroundColor: palette.grey[50],
    },
    paperAnchorLeft: {},
    paperAnchorRight: {},
    paperAnchorTop: {},
    paperAnchorBottom: {},
    paperAnchorDockedLeft: {},
    paperAnchorDockedTop: {},
    paperAnchorDockedRight: {},
    paperAnchorDockedBottom: {},
    modal: {},
});
