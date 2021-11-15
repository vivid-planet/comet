import { InputBaseClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiInputBaseOverrides = (palette: Palette, spacing: Spacing): StyleRules<{}, InputBaseClassKey> => ({
    root: {
        border: `1px solid ${palette.grey[100]}`,
        borderRadius: 2,
        backgroundColor: "#fff",
        "& [class*='MuiSvgIcon-root']": {
            pointerEvents: "none",
        },
        "& [class*='CometAdminClearInputButton-root']": {
            marginRight: -spacing(2),
            marginLeft: -spacing(2),
            "& [class*='MuiSvgIcon-root']": {
                pointerEvents: "auto",
            },
        },
        "&$focused": {
            borderColor: palette.primary.main,
        },
    },
    formControl: {},
    focused: {},
    disabled: {},
    adornedEnd: {
        paddingRight: spacing(2),
    },
    adornedStart: {
        paddingLeft: spacing(2),
    },
    error: {},
    marginDense: {},
    multiline: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    fullWidth: {},
    colorSecondary: {},
    input: {
        height: "auto",
        boxSizing: "border-box",
        padding: spacing(2) - 1, // 1px less for border, set in root
        lineHeight: "20px",
        "&::-ms-clear": {
            display: "none",
        },
    },
    inputMarginDense: {},
    inputMultiline: {
        padding: spacing(2) - 1, // 1px less for border, set in root
    },
    inputTypeSearch: {},
    inputAdornedStart: {
        paddingLeft: spacing(2),
    },
    inputAdornedEnd: {
        paddingRight: spacing(2),
    },
    inputHiddenLabel: {},
});
