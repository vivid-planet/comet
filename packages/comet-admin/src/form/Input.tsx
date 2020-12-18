import { Theme } from "@material-ui/core";
import MuiInputBase from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/styles";
export type VPAdminInputClassKeys = "input";

export const getDefaultVPAdminInputStyles = (theme: Theme) => {
    return {
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "2px",
        padding: "0 10px",
        height: "32px",
    };
};

const styles = (theme: Theme) =>
    createStyles({
        input: getDefaultVPAdminInputStyles(theme),
    });

export const Input = withStyles(styles, { name: "VPAdminInputBase", withTheme: true })(MuiInputBase);
