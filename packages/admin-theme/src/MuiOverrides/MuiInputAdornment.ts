import { InputAdornmentClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiInputAdornmentOverrides = (): StyleRules<{}, InputAdornmentClassKey> => ({
    root: {},
    filled: {},
    positionStart: {
        marginRight: 0,
    },
    positionEnd: {},
    disablePointerEvents: {},
    hiddenLabel: {},
    marginDense: {},
});
