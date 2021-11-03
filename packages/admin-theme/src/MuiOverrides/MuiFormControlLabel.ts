import { FormControlLabelClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiFormControlLabelOverrides = (): StyleRules<{}, FormControlLabelClassKey> => ({
    root: {
        marginLeft: -9,
        marginTop: -7,
        marginBottom: -7,
    },
    labelPlacementStart: {},
    labelPlacementTop: {},
    labelPlacementBottom: {},
    disabled: {},
    label: {},
});
