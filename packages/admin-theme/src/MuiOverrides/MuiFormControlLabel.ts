import { FormControlLabelClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiFormControlLabelOverrides = (): OverridesStyleRules<FormControlLabelClassKey> => ({
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
    error: {},
});
