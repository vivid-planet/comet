import { DialogContentClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export const getMuiDialogContentOverrides = (): StyleRules<{}, DialogContentClassKey> => ({
    root: {
        backgroundColor: neutrals[50],
        padding: 40,
    },
    dividers: {},
});
