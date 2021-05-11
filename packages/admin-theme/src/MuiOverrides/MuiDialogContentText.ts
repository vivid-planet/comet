import { DialogContentTextClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { paletteOptions } from "../paletteOptions";

export const getMuiDialogTextContentOverrides = (): StyleRules<{}, DialogContentTextClassKey> => ({
    root: {
        color: paletteOptions.text?.primary,
        marginBottom: 20,
    },
});
