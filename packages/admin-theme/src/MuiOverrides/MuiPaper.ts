import { PaperClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { paletteOptions } from "../paletteOptions";

export const getMuiPaperOverrides = (): StyleRules<{}, PaperClassKey> => ({
    root: {},
    rounded: {},
    outlined: {},
    elevation0: {
        borderBottom: `1px solid ${paletteOptions.divider}`,
    },
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
