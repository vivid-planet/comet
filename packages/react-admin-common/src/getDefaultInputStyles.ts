import { Theme } from "@material-ui/core";

const getDefaultVPAdminInputStyles = (theme: Theme) => {
    return {
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "2px",
        padding: "0 10px",
        height: "32px",
    };
};

export default getDefaultVPAdminInputStyles;
