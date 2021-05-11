import { CometAdminInputBaseClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, neutrals } from "../colors";

export default (): StyleRules<{}, CometAdminInputBaseClassKeys> => ({
    root: {
        borderColor: neutrals[100],
        borderRadius: 2,
        "&:not($multiline)": {
            height: 40,
        },
    },
    formControl: {},
    focused: {
        borderColor: bluePalette.main,
    },
    disabled: {},
    adornedEnd: {
        paddingRight: 10,
    },
    adornedStart: {
        paddingLeft: 10,
    },
    error: {},
    marginDense: {
        marginBottom: 10,
    },
    multiline: {},
    fullWidth: {},
    colorSecondary: {},
    input: {
        lineHeight: "20px",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    inputMarginDense: {},
    inputMultiline: {},
    inputTypeSearch: {},
    inputAdornedStart: {},
    inputAdornedEnd: {},
    inputHiddenLabel: {},
});
