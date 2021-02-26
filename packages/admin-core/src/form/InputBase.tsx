import { Theme } from "@material-ui/core";
import MuiInputBase from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/styles";

export type CometAdminInputBaseClassKeys = "root" | "focused" | "adornedStart" | "adornedEnd" | "input";

const styles = (theme: Theme) =>
    createStyles<CometAdminInputBaseClassKeys, any>({
        root: {
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "2px",
            height: "32px",
            backgroundColor: "#fff",
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
        focused: {
            borderColor: theme.palette.grey[400],
        },
        adornedStart: {
            paddingLeft: theme.spacing(1),
        },
        adornedEnd: {
            paddingRight: theme.spacing(1),
        },
        input: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            "&::-ms-clear": {
                display: "none",
            },
        },
    });

export const InputBase = withStyles(styles, { name: "CometAdminInputBase", withTheme: false })(MuiInputBase);
