import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export type CometAdminFilterBarPopoverFilterClassKeys =
    | "root"
    | "fieldBarWrapper"
    | "fieldBarInnerWrapper"
    | "labelWrapper"
    | "popoverContentContainer"
    | "popoverInnerContentContainer"
    | "paper"
    | "buttonsContainer";

export const useStyles = makeStyles(
    (theme: Theme) => ({
        showMoreWrapper: {
            backgroundColor: `${theme.palette.common.white}`,
            border: `1px solid ${theme.palette.grey[300]}`,
            justifyContent: "center",
            padding: "10px 15px",
            position: "relative",
            marginBottom: "10px",
            alignItems: "center",
            marginRight: "10px",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",

            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },
        },
        showMoreTextWrapper: {
            marginLeft: "15px",

            "& [class*='MuiTypography-body1']": {
                fontWeight: theme.typography.fontWeightBold,
            },
        },
    }),
    { name: "CometAdminFilterBar" },
);
