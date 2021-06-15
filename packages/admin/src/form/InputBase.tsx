import { InputBaseClassKey, Theme } from "@material-ui/core";
import MuiInputBase from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/styles";

export type CometAdminInputBaseClassKeys = InputBaseClassKey;

const styles = (theme: Theme) =>
    createStyles<CometAdminInputBaseClassKeys, any>({
        root: {
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 2,
            backgroundColor: "#fff",
            "&:not($multiline)": {
                height: 40,
            },
            "& [class*='MuiSvgIcon-root']": {
                pointerEvents: "none",
            },
            "& [class*='CometAdminClearInputButton-root']": {
                marginRight: -theme.spacing(1),
                "& [class*='MuiSvgIcon-root']": {
                    pointerEvents: "auto",
                },
            },
        },
        formControl: {},
        focused: {
            borderColor: theme.palette.primary.main,
        },
        disabled: {},
        adornedEnd: {
            paddingRight: theme.spacing(2),
        },
        adornedStart: {
            paddingLeft: theme.spacing(2),
        },
        error: {},
        marginDense: {
            marginBottom: theme.spacing(2),
        },
        multiline: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        fullWidth: {},
        colorSecondary: {},
        input: {
            height: "100%",
            boxSizing: "border-box",
            lineHeight: "20px",
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            "&::-ms-clear": {
                display: "none",
            },
        },
        inputMarginDense: {},
        inputMultiline: {},
        inputTypeSearch: {},
        inputAdornedStart: {},
        inputAdornedEnd: {},
        inputHiddenLabel: {},
    });

export const InputBase = withStyles(styles, { name: "CometAdminInputBase", withTheme: false })(MuiInputBase);
