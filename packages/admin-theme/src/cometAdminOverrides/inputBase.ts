import { CometAdminInputBaseClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, neutrals } from "../colors";

export default (): StyleRules<{}, CometAdminInputBaseClassKeys> => ({
    root: {
        borderColor: neutrals[100],
        borderRadius: 2,
        "&:not($multiline)": {
            height: 36,
        },
    },
    formControl: {},
    focused: {
        borderColor: bluePalette.main,
    },
    disabled: {},
    adornedEnd: {},
    adornedStart: {},
    error: {},
    marginDense: {},
    multiline: {},
    fullWidth: {},
    colorSecondary: {},
    input: {
        lineHeight: "20px",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
    },
    inputMarginDense: {},
    inputMultiline: {},
    inputTypeSearch: {},
    inputAdornedStart: {},
    inputAdornedEnd: {},
    inputHiddenLabel: {},
});
