import { DrawerClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export const getMuiDrawerOverrides = (): StyleRules<{}, DrawerClassKey> => ({
    root: {},
    docked: {},
    paper: {
        backgroundColor: neutrals[50],
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
