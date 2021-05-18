import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminSaveSplitButtonClassKeys = "saving" | "error" | "success" | "disabled";

const useStyles = makeStyles<Theme, {}, CometAdminSaveSplitButtonClassKeys>((theme) => ({
    saving: {
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
        "&$disabled": {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
        },
    },
    error: {
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.light,
        },
        "&$disabled": {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.light,
        },
    },
    success: {
        backgroundColor: theme.palette.success.main,
        "&:hover": {
            backgroundColor: theme.palette.success.light,
        },
        "&$disabled": {
            color: theme.palette.success.contrastText,
            backgroundColor: theme.palette.success.light,
        },
    },
    disabled: {},
}));

export { useStyles };
