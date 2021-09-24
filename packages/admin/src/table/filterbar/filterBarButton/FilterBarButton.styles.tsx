import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
    (theme: Theme) => ({
        button: {
            position: "relative",
            alignItems: "center",
            padding: "10px 15px",
            cursor: "pointer",
            display: "flex",
            border: `1px solid ${theme.palette.grey[100]}`,

            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },

            "&:active": {
                border: `1px solid ${theme.palette.grey[400]}`,
                backgroundColor: "initial",
            },

            "&:hover": {
                border: `1px solid ${theme.palette.primary.main}`,
                backgroundColor: "initial",
            },
        },
        startIcon: {
            marginRight: "6px",
        },
        endIcon: {
            marginLeft: "10px",
        },
        labelWrapper: {
            boxSizing: "border-box",
            "& [class*='MuiTypography-body1']": {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },
        labelWrapperWithValues: {
            "& [class*='MuiTypography-body1']": {
                fontWeight: theme.typography.fontWeightBold,
            },
        },
    }),
    { name: "CometAdminFilterBarButton" },
);
