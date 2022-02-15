import { InputAdornmentClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiInputAdornmentOverrides = (): OverridesStyleRules<InputAdornmentClassKey> => ({
    root: {
        height: "auto",
        alignSelf: "stretch",
        maxHeight: "none",
    },
    filled: {},
    outlined: {},
    standard: {},
    positionStart: {
        marginRight: 0,
    },
    positionEnd: {
        marginLeft: 0,
    },
    disablePointerEvents: {},
    hiddenLabel: {},
    sizeSmall: {},
});
