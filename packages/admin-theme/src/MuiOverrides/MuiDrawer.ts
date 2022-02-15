import { DrawerClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiDrawerOverrides = (palette: Palette): OverridesStyleRules<DrawerClassKey> => ({
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
