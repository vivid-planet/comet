import { CometAdminInputBaseClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getInputBaseOverrides = (palette: Palette): StyleRules<{}, CometAdminInputBaseClassKeys> => ({
    root: {
        borderColor: palette.grey[100],
        borderRadius: 2,
        "&:not($multiline)": {
            height: 40,
        },
    },
    formControl: {},
    focused: {
        borderColor: palette.primary.main,
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
