import { ButtonProps } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export type CometAdminFilterBarPopoverFilterClassKeys =
    | "root"
    | "fieldBarWrapper"
    | "fieldBarWrapper--hasValues"
    | "fieldBarInnerWrapper"
    | "labelWrapper"
    | "labelWrapper--hasValues"
    | "popoverContentContainer"
    | "popoverInnerContentContainer"
    | "paper"
    | "buttonsContainer";

export interface FilterBarPopoverFilterThemeProps {
    submitButton?: ButtonProps;
    resetButton?: ButtonProps;
}

export const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            backgroundColor: `${theme.palette.common.white}`,
            position: "relative",
            marginBottom: "10px",
            borderRadius: "2px",
            marginRight: "6px",
        },
        fieldBarWrapper: {
            position: "relative",
            border: `1px solid ${theme.palette.grey[100]}`,
        },
        "fieldBarWrapper--hasValues": {
            border: `1px solid ${theme.palette.grey[300]}`,
        },
        fieldBarInnerWrapper: {
            position: "relative",
            alignItems: "center",
            padding: "10px 15px",
            cursor: "pointer",
            display: "flex",

            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },
        },
        labelWrapper: {
            boxSizing: "border-box",
            marginRight: "6px",
            "& [class*='MuiTypography-body1']": {
                fontWeight: 300,
            },
        },

        "labelWrapper--hasValues": {
            "& [class*='MuiTypography-body1']": {
                fontWeight: 500,
            },
        },
        popoverContentContainer: {
            minWidth: 300,
            "& [class*='CometAdminFormFieldContainer-root']": {
                boxSizing: "border-box",
                padding: "20px",
                marginBottom: 0,
            },
        },
        buttonsContainer: {
            borderTop: `1px solid ${theme.palette.grey[100]}`,
            justifyContent: "space-between",
            boxSizing: "border-box",
            padding: "10px 15px",
            display: "flex",
            height: 60,
        },
        paper: {
            boxShadow: "0 0 8px 0 rgba(0,0,0,0.1)",
            marginLeft: -1, //due to border of popover, but now overrideable with styling if needed
            marginTop: 2, //due to boxShadow of popover to not overlap border of clickable fieldBar
        },
    }),
    { name: "CometAdminFilterBarPopoverFilter" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarPopoverFilter: CometAdminFilterBarPopoverFilterClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBarPopoverFilter: FilterBarPopoverFilterThemeProps;
    }
}
