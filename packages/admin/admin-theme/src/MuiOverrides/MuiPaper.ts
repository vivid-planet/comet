import { PaperClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiPaperOverrides = (palette: Palette): StyleRules<Record<string, unknown>, PaperClassKey> => ({
    root: {},
    rounded: {},
    outlined: {
        borderTop: "none",
        borderRight: "none",
        borderBottom: `1px solid ${palette.divider}`,
        borderLeft: "none",
    },
    elevation0: {},
    elevation1: {},
    elevation2: {},
    elevation3: {},
    elevation4: {},
    elevation5: {},
    elevation6: {},
    elevation7: {},
    elevation8: {},
    elevation9: {},
    elevation10: {},
    elevation11: {},
    elevation12: {},
    elevation13: {},
    elevation14: {},
    elevation15: {},
    elevation16: {},
    elevation17: {},
    elevation18: {},
    elevation19: {},
    elevation20: {},
    elevation21: {},
    elevation22: {},
    elevation23: {},
    elevation24: {},
});
