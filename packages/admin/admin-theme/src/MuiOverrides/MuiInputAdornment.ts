import { InputAdornmentClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiInputAdornmentOverrides = (): StyleRules<{}, InputAdornmentClassKey> => ({
    root: {
        height: "auto",
        alignSelf: "stretch",
        maxHeight: "none",
    },
    filled: {},
    positionStart: {
        marginRight: 0,
    },
    positionEnd: {
        marginLeft: 0,
    },
    disablePointerEvents: {},
    hiddenLabel: {},
    marginDense: {},
});
