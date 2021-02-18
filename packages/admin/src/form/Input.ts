import { Theme } from "@material-ui/core";

/**
 * @deprecated Getting the default-input-styles should no longer be necessary, just use CometAdminInputBase instead of the material-ui InputBase
 */
export const getDefaultVPAdminInputStyles = (theme: Theme) => {
    return {
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "2px",
        padding: "0 10px",
        height: "32px",
    };
};
