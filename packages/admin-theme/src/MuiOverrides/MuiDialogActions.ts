import { DialogActionsClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export const getMuiDialogActionsOverrides = (): StyleRules<{}, DialogActionsClassKey> => ({
    root: {
        borderTop: `1px solid ${neutrals[100]}`,
        padding: 20,
        justifyContent: "space-between",
    },
    spacing: {},
});
